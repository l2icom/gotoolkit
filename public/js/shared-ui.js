(() => {
    const SHARE_MENU_TEMPLATE = `
        <div class="context-menu share-menu" id="shareMenu" role="dialog" aria-live="polite">
            <div class="menu-panel">
                <div class="menu-header">Lien de la capsule</div>
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

    hydrateSharedUI();
    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", hydrateSharedUI);
    }

    window.GoToolkitSharedUI = window.GoToolkitSharedUI || {
        renderShareMenu,
        renderToast
    };
})();
