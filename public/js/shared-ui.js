(() => {
    const SHARE_MENU_TEMPLATE = `
        <div class="context-menu share-menu" id="shareMenu" role="dialog" aria-live="polite">
            <div class="menu-panel">
                <div class="menu-header">Lien de partage</div>
                <div class="share-link-line">
                    <input id="shareLinkField" class="share-link-field" type="text" readonly placeholder="Créer un lien">
                </div>
                <div class="share-actions">
                    <button id="shareUpdateBtn" type="button" class="btn-primary">⟳ Actualiser</button>
                    <button id="shareCreateBtn" type="button" class="btn">☍ Créer</button>
                </div>
                <p class="share-menu-status" id="shareMenuStatus"></p>
            </div>
        </div>`;

    function resolveElement(selectorOrElement) {
        if (!selectorOrElement) {
            return null;
        }
        if (typeof selectorOrElement === "string") {
            return document.querySelector(selectorOrElement);
        }
        return selectorOrElement instanceof Element ? selectorOrElement : null;
    }

    function renderShareMenu(slot) {
        const slotElement = resolveElement(slot);
        if (!slotElement || slotElement.dataset.shareMenuRendered === "true") {
            return document.getElementById("shareMenu");
        }
        slotElement.innerHTML = SHARE_MENU_TEMPLATE.trim();
        slotElement.dataset.shareMenuRendered = "true";
        return slotElement.querySelector("#shareMenu");
    }

    function renderToast(id, options = {}) {
        const existing = document.getElementById(id);
        if (existing) {
            return existing;
        }
        const slotSelector = options.slotSelector || `[data-toast-slot="${id}"]`;
        const slot = resolveElement(slotSelector);
        const toast = document.createElement("div");
        toast.id = id;
        toast.className = options.className || "toast";
        toast.setAttribute("role", options.role || "status");
        toast.setAttribute("aria-live", options.ariaLive || "polite");
        if (options.ariaAtomic !== false) {
            toast.setAttribute("aria-atomic", "true");
        }
        if (slot) {
            slot.replaceWith(toast);
        } else if (options.appendTo) {
            options.appendTo.appendChild(toast);
        } else {
            document.body.appendChild(toast);
        }
        return toast;
    }

    function hydrateShareMenus() {
        const slots = Array.from(document.querySelectorAll("[data-share-menu-slot]"));
        slots.forEach(slot => renderShareMenu(slot));
    }

    function hydrateToastSlots() {
        const slots = Array.from(document.querySelectorAll("[data-toast-slot]"));
        slots.forEach(slot => {
            const slotId = slot.dataset.toastSlot;
            if (!slotId) {
                return;
            }
            const options = {
                slotSelector: `[data-toast-slot="${slotId}"]`,
                className: slot.dataset.toastClass || slot.className || "toast",
                role: slot.dataset.toastRole,
                ariaLive: slot.dataset.toastAriaLive,
                ariaAtomic: slot.dataset.toastAriaAtomic === "false" ? false : slot.dataset.toastAriaAtomic === "true" ? true : undefined
            };
            renderToast(slotId, options);
        });
    }

    function hydrateSharedUI() {
        hydrateShareMenus();
        hydrateToastSlots();
    }

    const ACTION_COUNTDOWN_FRAMES = ["◴", "◷", "◶", "◵"];

    function normalizeActionCountdownTargets(targets) {
        if (!targets) {
            return [];
        }
        const entries = Array.isArray(targets) ? targets : [targets];
        const normalized = [];
        entries.forEach(entry => {
            if (!entry) {
                return;
            }
            if (entry instanceof Element) {
                normalized.push({ element: entry, defaultLabel: entry.textContent || "" });
                return;
            }
            const element = entry.element || entry.button;
            if (!(element instanceof Element)) {
                return;
            }
            const label =
                typeof entry.defaultLabel === "string"
                    ? entry.defaultLabel
                    : element.textContent || "";
            normalized.push({ element, defaultLabel: label });
        });
        return normalized;
    }

    function resolveCountdownDuration(value, fallback) {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
            return Math.max(1, Math.round(numeric));
        }
        return fallback;
    }

    function createActionCountdown(targets, options = {}) {
        const resolvedTargets = normalizeActionCountdownTargets(targets);
        if (!resolvedTargets.length) {
            return {
                start() { /* noop */ },
                stop() { /* noop */ },
                isActive() { return false; }
            };
        }
        const frames =
            Array.isArray(options.frames) && options.frames.length
                ? options.frames.slice()
                : ACTION_COUNTDOWN_FRAMES.slice();
        const labelFormatter =
            typeof options.labelFormatter === "function"
                ? options.labelFormatter
                : function (frame, seconds) {
                      const padded = seconds < 10 ? "0" + seconds : String(seconds);
                      return frame + " " + padded + "s";
                  };
        let globalDefaultLabel =
            typeof options.defaultLabel === "string" ? options.defaultLabel : null;
        resolvedTargets.forEach(target => {
            if (globalDefaultLabel !== null) {
                target.defaultLabel = globalDefaultLabel;
            } else if (typeof target.defaultLabel !== "string") {
                target.defaultLabel = target.element.textContent || "";
            }
        });
        let timerId = null;
        let duration = resolveCountdownDuration(options.duration, 30);
        let remaining = duration;

        function applyLabel(label) {
            resolvedTargets.forEach(target => {
                if (!target.element) return;
                target.element.textContent = label;
            });
        }

        function restoreLabels() {
            resolvedTargets.forEach(target => {
                if (!target.element) return;
                if (typeof target.defaultLabel === "string") {
                    target.element.textContent = target.defaultLabel;
                }
            });
        }

        function tick() {
            if (!resolvedTargets.length) {
                return;
            }
            if (remaining < 0) {
                remaining = duration;
            }
            const frame = frames[Math.abs(remaining) % frames.length];
            const label = labelFormatter(frame, Math.max(0, remaining));
            applyLabel(label);
            remaining -= 1;
        }

        function stop(restore) {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            }
            if (restore === false) {
                return;
            }
            restoreLabels();
        }

        function start(value) {
            stop(false);
            duration = resolveCountdownDuration(value, duration);
            remaining = duration;
            tick();
            timerId = setInterval(tick, 1000);
        }

        return {
            start,
            stop,
            isActive: function () {
                return Boolean(timerId);
            }
        };
    }

    hydrateSharedUI();
    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", hydrateSharedUI);
    }

    window.GoToolkitSharedUI = window.GoToolkitSharedUI || {};
    window.GoToolkitSharedUI.renderShareMenu =
        window.GoToolkitSharedUI.renderShareMenu || renderShareMenu;
    window.GoToolkitSharedUI.renderToast =
        window.GoToolkitSharedUI.renderToast || renderToast;
    window.GoToolkitSharedUI.createActionCountdown =
        window.GoToolkitSharedUI.createActionCountdown || createActionCountdown;
})();
