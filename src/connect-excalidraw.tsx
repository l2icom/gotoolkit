import React, { useCallback } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
    Excalidraw,
    convertToExcalidrawElements
} from "@excalidraw/excalidraw";
import type {
    BinaryFiles,
    ExcalidrawImperativeAPI
} from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";

const MERMAID_OPTIONS = { fontSize: 20 };

type SceneData = {
    elements: readonly ExcalidrawElement[];
    files?: BinaryFiles | null;
};

const createInitialData = () => ({
    elements: [] as ExcalidrawElement[],
    appState: {
        viewBackgroundColor: "#fdfdfd",
        gridModeEnabled: false,
        isLoading: false
    }
});

class ExcalidrawBridge {
    private api: ExcalidrawImperativeAPI | null = null;
    private root: Root | null = null;
    private host: HTMLElement | null = null;
    private readyPromise: Promise<ExcalidrawImperativeAPI> | null = null;

    initialize(container: HTMLElement | string): Promise<void> {
        const host = typeof container === "string" ? document.getElementById(container) : container;
        if (!host) {
            return Promise.reject(new Error("Excalidraw host introuvable"));
        }
        if (this.host && host !== this.host) {
            this.root?.unmount();
            this.root = null;
            this.api = null;
            this.readyPromise = null;
        }
        this.host = host;
        if (!this.readyPromise) {
            this.readyPromise = new Promise((resolve, reject) => {
                try {
                    this.root = createRoot(host);
                } catch (error) {
                    reject(error);
                    return;
                }
                let resolved = false;
                const handleReady = (instance: ExcalidrawImperativeAPI) => {
                    this.api = instance;
                    if (!resolved) {
                        resolved = true;
                        resolve(instance);
                    }
                };
                const Surface: React.FC<{ onReady: (api: ExcalidrawImperativeAPI) => void }> = ({ onReady }) => {
                    const syncApi = useCallback(
                        (api: ExcalidrawImperativeAPI | null) => {
                            if (api) {
                                onReady(api);
                            }
                        },
                        [onReady]
                    );
                    const ExcalidrawAny = Excalidraw as unknown as React.ComponentType<any>;
                    return (
                        <ExcalidrawAny
                            excalidrawAPI={syncApi}
                            theme="light"
                            viewModeEnabled={false}
                            gridModeEnabled={false}
                            zenModeEnabled={false}
                            initialData={createInitialData()}
                        />
                    );
                };
                this.root.render(<Surface onReady={handleReady} />);
            });
        }
        return this.readyPromise.then(() => undefined);
    }

    async convertMermaid(code: string): Promise<SceneData | null> {
        const trimmed = code?.trim();
        if (!trimmed) {
            return null;
        }
        const parsed = await parseMermaidToExcalidraw(trimmed, MERMAID_OPTIONS as any);
        const skeleton = Array.isArray(parsed?.elements) ? parsed?.elements : [];
        if (!skeleton.length) {
            return null;
        }
        const converted = convertToExcalidrawElements(skeleton as any);
        const normalizedElements = Array.isArray(converted)
            ? converted
            : Array.isArray((converted as any)?.elements)
            ? (converted as any).elements
            : [];
        if (!normalizedElements.length) {
            return null;
        }
        const normalizedFiles = (!Array.isArray(converted) && (converted as any)?.files) || parsed?.files || null;
        return {
            elements: normalizedElements as readonly ExcalidrawElement[],
            files: normalizedFiles || undefined
        };
    }

    applyScene(scene: SceneData): void {
        const api = this.ensureApi();
        const payload: any = {
            elements: scene.elements.slice(),
            appState: {
                ...(api.getAppState() as any),
                viewBackgroundColor: "#fdfdfd",
                gridModeEnabled: false,
                isLoading: false
            }
        };
        if (scene.files) {
            payload.files = scene.files;
        }
        api.updateScene(payload);
        if (scene.files) {
            const fileList = Object.values(scene.files);
            if (fileList.length) {
                api.addFiles?.(fileList as any);
            }
        }
    }

    getApi(): ExcalidrawImperativeAPI | null {
        return this.api;
    }

    private ensureApi(): ExcalidrawImperativeAPI {
        if (!this.api) {
            throw new Error("Excalidraw API non initialisé");
        }
        return this.api;
    }
}

const bridge = new ExcalidrawBridge();

export type GoToolkitExcalidrawAPI = {
    initialize: (container: HTMLElement | string) => Promise<void>;
    convertMermaid: (code: string) => Promise<SceneData | null>;
    applyScene: (scene: SceneData) => void;
    getApi: () => ExcalidrawImperativeAPI | null;
};

declare global {
    interface Window {
        GoToolkitExcalidraw?: GoToolkitExcalidrawAPI;
    }
}

window.GoToolkitExcalidraw = {
    initialize: container => bridge.initialize(container),
    convertMermaid: code => bridge.convertMermaid(code),
    applyScene: scene => bridge.applyScene(scene),
    getApi: () => bridge.getApi()
};
