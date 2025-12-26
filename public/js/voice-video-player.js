(function () {
    const STYLE_ID = "voice-video-player-styles";

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = `
            .voice-video-player-modal {
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: "Inter", system-ui, sans-serif;
            }
            .voice-video-player-modal--open {
                display: flex;
            }
            body.voice-video-player-modal-open {
                overflow: hidden;
            }
            .voice-video-player-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(15, 23, 42, 0.65);
                backdrop-filter: blur(12px);
            }
            .voice-video-player-dialog {
                position: relative;
                width: min(95vw, 1180px);
                max-width: 1180px;
                max-height: 90vh;
                background: #fff;
                border-radius: 24px;
                padding: 22px;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
                z-index: 1;
                display: flex;
                flex-direction: column;
                gap: 18px;
                overflow: hidden;
            }
            .voice-video-player-close {
                position: absolute;
                top: 16px;
                right: 16px;
                border: none;
                background: none;
                font-size: 22px;
                cursor: pointer;
                color: #101828;
            }
            .voice-video-player-body {
                display: flex;
                width: 100%;
                gap: 18px;
                flex: 1;
                min-height: 50vh;
            }
            .voice-video-player-video-panel {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .voice-video-player-video-frame {
                flex: 1;
                border-radius: 16px;
                overflow: hidden;
                background: #000;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
            }
            .voice-video-player-video-frame video {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
                background: #000;
            }
            .voice-video-player-subtitle {
                width: 100%;
                min-height: 56px;
                padding: 10px 14px;
                border-radius: 12px;
                background: rgba(15, 23, 42, 0.04);
                color: #0f172a;
                font-size: 14px;
                line-height: 1.4;
                border: 1px solid rgba(15, 23, 42, 0.12);
                resize: vertical;
            }
            .voice-video-player-controls {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .voice-video-player-play-toggle {
                border: 1px solid #d0c3ad;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                background: transparent;
                cursor: pointer;
                font-size: 16px;
                color: #1f2937;
            }
            .voice-video-player-progress {
                flex: 1;
                appearance: none;
                height: 6px;
                border-radius: 6px;
                background: #e5e7eb;
                outline: none;
            }
            .voice-video-player-progress::-webkit-slider-thumb {
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #2a7a57;
                border: 2px solid #fff;
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
            }
            .voice-video-player-progress::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #2a7a57;
                border: 2px solid #fff;
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
            }
            .voice-video-player-time {
                font-size: 12px;
                color: #475467;
                min-width: 120px;
                text-align: right;
            }
            .voice-video-player-transcript-panel {
                width: 350px;
                max-height: 100%;
                background: #fdfbf6;
                border-radius: 18px;
                padding: 8px;
                border: 1px solid rgba(16, 24, 40, 0.08);
                display: flex;
                flex-direction: column;
                gap: 4px;
                overflow: hidden;
            }
            .voice-video-player-transcript-header {
                font-weight: 600;
                color: #0f172a;
                font-size: 14px;
                letter-spacing: 0.02em;
            }
            .voice-video-player-transcript-list {
                flex: 1;
                overflow-y: auto;
                padding-right: 4px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .voice-video-player-transcript-item {
                border-radius: 12px;
                padding: 10px;
                border: 1px solid rgba(15, 23, 42, 0.12);
                background: #fff;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .voice-video-player-transcript-item--active {
                background: rgba(42, 122, 87, 0.12);
                border-color: rgba(42, 122, 87, 0.3);
            }
            .voice-video-player-transcript-item__times {
                display: flex;
                gap: 6px;
                align-items: center;
                font-size: 12px;
                color: #475467;
            }
            .voice-video-player-transcript-time {
                flex: 1;
                border: 1px solid rgba(15, 23, 42, 0.1);
                border-radius: 8px;
                padding: 4px 8px;
                font-size: 12px;
                background: #f9fafb;
                color: #0f172a;
                width:50px;
            }
            .voice-video-player-transcript-time:focus {
                outline: 2px solid rgba(42, 122, 87, 0.4);
            }
            .voice-video-player-transcript-item__content {
                min-height: 40px;
                font-size: 13px;
                line-height: 1.4;
                color: #0f172a;
                border-radius: 8px;
                padding: 6px 8px;
                border: 1px solid rgba(15, 23, 42, 0.1);
                background: #fff;
            }
            .voice-video-player-transcript-item__content:focus {
                border-color: #2a7a57;
                box-shadow: 0 0 0 2px rgba(42, 122, 87, 0.12);
            }
            .voice-video-player-transcript-save {
                border: none;
                outline: none;
                border-radius: 12px;
                padding: 6px 14px;
                background: #2a7a57;
                color: #fff;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                width: auto;
                min-height: 0;
                min-width: 0;
                font-size: 13px;
                align-self: flex-end;
            }
            .voice-video-player-transcript-save:hover {
                background: #1e6848;
            }
            @media (max-width: 1024px) {
                .voice-video-player-body {
                    flex-direction: column;
                }
                .voice-video-player-transcript-panel {
                    width: 100%;
                    max-height: 35vh;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function formatTime(value = 0) {
        if (!Number.isFinite(value) || value < 0) return "00:00";
        const total = Math.floor(value);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function formatVttTime(value = 0) {
        const totalMillis = Math.max(0, Math.floor((Number(value) || 0) * 1000));
        const hours = Math.floor(totalMillis / 3600000);
        const minutes = Math.floor((totalMillis % 3600000) / 60000);
        const seconds = Math.floor((totalMillis % 60000) / 1000);
        const millis = totalMillis % 1000;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
    }

    function parseVttTime(value = "") {
        const normalized = String(value || "").trim().replace(/,/g, ".").replace(/\s+/g, "");
        if (!normalized) return NaN;
        const parts = normalized.split(":");
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let millis = 0;
        if (parts.length === 3) {
            hours = Number(parts[0]);
            minutes = Number(parts[1]);
            const [secondsPart, fraction = ""] = parts[2].split(".");
            seconds = Number(secondsPart);
            millis = Number((fraction + "000").slice(0, 3));
        } else if (parts.length === 2) {
            minutes = Number(parts[0]);
            const [secondsPart, fraction = ""] = parts[1].split(".");
            seconds = Number(secondsPart);
            millis = Number((fraction + "000").slice(0, 3));
        } else {
            return NaN;
        }
        if ([hours, minutes, seconds, millis].some(num => Number.isNaN(num))) {
            return NaN;
        }
        return hours * 3600 + minutes * 60 + seconds + millis / 1000;
    }

    class VoiceVideoPlayerModal {
        constructor() {
            this.sentences = [];
            this.sentenceEntries = [];
            this.onTranscriptChange = null;
            this.onTranscriptSaved = null;
            this._activeSentenceIndex = -1;
            this._handleKeydown = this._handleKeydown.bind(this);
            this.videoBlobUrl = "";
            ensureStyles();
            this._buildDom();
            this._bindEvents();
        }

        _buildDom() {
            this.overlay = document.createElement("div");
            this.overlay.className = "voice-video-player-modal";
            this.overlay.setAttribute("aria-hidden", "true");
            this.overlay.innerHTML = `
                <div class="voice-video-player-backdrop"></div>
                <div class="voice-video-player-dialog" role="dialog" aria-modal="true" aria-label="Lecteur vidéo">
                    <button type="button" class="voice-video-player-close" aria-label="Fermer">×</button>
                    <div class="voice-video-player-body">
                        <div class="voice-video-player-video-panel">
                            <div class="voice-video-player-video-frame">
                                <video playsinline></video>
                            </div>
                            <textarea class="voice-video-player-subtitle" aria-live="polite" rows="3" placeholder="Sous-titre actif"></textarea>
                            <div class="voice-video-player-controls">
                                <button type="button" class="voice-video-player-play-toggle" aria-label="Lecture">▶</button>
                                <input type="range" min="0" max="1" step="0.001" value="0" class="voice-video-player-progress">
                                <span class="voice-video-player-time">00:00 / 00:00</span>
                            </div>
                        </div>
                    <div class="voice-video-player-transcript-panel">
                        <div class="voice-video-player-transcript-header">Transcription vidéo</div>
                        <div class="voice-video-player-transcript-list"></div>
                        <button type="button" class="voice-video-player-transcript-save btn-primary">Sauvegarder</button>
                    </div>
                    </div>
                </div>
            `;
            (document.body || document.documentElement).appendChild(this.overlay);
            this.dialog = this.overlay.querySelector(".voice-video-player-dialog");
            this.closeButton = this.overlay.querySelector(".voice-video-player-close");
            this.videoEl = this.overlay.querySelector("video");
            this.subtitle = this.overlay.querySelector(".voice-video-player-subtitle");
            this.playToggle = this.overlay.querySelector(".voice-video-player-play-toggle");
            this.progress = this.overlay.querySelector(".voice-video-player-progress");
            this.timeLabel = this.overlay.querySelector(".voice-video-player-time");
            this.transcriptList = this.overlay.querySelector(".voice-video-player-transcript-list");
            this.saveButton = this.overlay.querySelector(".voice-video-player-transcript-save");
        }

        _bindEvents() {
            this.overlay.addEventListener("click", event => {
                if (event.target === this.overlay || event.target.classList.contains("voice-video-player-backdrop")) {
                    this.close();
                }
            });
            this.closeButton?.addEventListener("click", () => this.close());
            this.playToggle?.addEventListener("click", () => {
                if (!this.videoEl) return;
                if (this.videoEl.paused) {
                    this.videoEl.play().catch(() => { });
                } else {
                    this.videoEl.pause();
                }
            });
            this.progress?.addEventListener("input", () => {
                if (!this.videoEl || !this.videoEl.duration) return;
                const ratio = Number(this.progress.value) || 0;
                this.videoEl.currentTime = ratio * this.videoEl.duration;
            });
            this.videoEl?.addEventListener("timeupdate", () => {
                this._updateProgress();
                this._refreshActiveNode();
            });
            this.videoEl?.addEventListener("loadedmetadata", () => {
                this._updateProgress(true);
                this._refreshActiveNode();
            });
            this.videoEl?.addEventListener("play", () => this._updatePlayButton());
            this.videoEl?.addEventListener("pause", () => this._updatePlayButton());
            this.videoEl?.addEventListener("ended", () => {
                this._updatePlayButton();
                this._updateProgress(true);
                this._refreshActiveNode();
            });
            this.subtitle?.addEventListener("input", () => this._handleSubtitleInput());
            this.saveButton?.addEventListener("click", () => this._handleSave());
        }

        _handleKeydown(event) {
            if (event.key === "Escape") {
                this.close();
            }
        }

        _handleSubtitleInput() {
            const idx = this._activeSentenceIndex;
            if (idx < 0 || idx >= this.sentences.length) return;
            const value = this.subtitle?.value || "";
            const sentence = this.sentences[idx];
            sentence.text = value;
            const entry = this.sentenceEntries[idx];
            if (entry?.contentEl) {
                entry.contentEl.textContent = value;
            }
            this._notifyTranscriptChange();
        }

        _handleSave() {
            if (!this.onTranscriptSaved) return;
            const snapshot = this.sentences.map(sentence => ({ ...sentence }));
            this.onTranscriptSaved(snapshot);
        }

        _updateProgress(force = false) {
            if (!this.videoEl || !this.progress || !this.timeLabel) return;
            const current = this.videoEl.currentTime || 0;
            const duration = this.videoEl.duration || 0;
            const ratio = duration ? Math.min(1, Math.max(0, current / duration)) : 0;
            if (force || this.progress.value !== String(ratio)) {
                this.progress.value = String(ratio);
            }
            this.timeLabel.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
        }

        _updatePlayButton() {
            if (!this.videoEl || !this.playToggle) return;
            this.playToggle.textContent = this.videoEl.paused ? "▶" : "⏸";
        }

        _refreshActiveNode() {
            if (!this.videoEl || !this.transcriptList) return;
            if (!this.sentences.length) return;
            const currentTime = this.videoEl.currentTime || 0;
            let foundIndex = this.sentences.findIndex(sentence => {
                const start = Number.isFinite(sentence.start) ? sentence.start : 0;
                const end = Number.isFinite(sentence.end) ? sentence.end : Infinity;
                return currentTime >= start && currentTime < end;
            });
            if (foundIndex === -1) {
                foundIndex = this.sentences.length - 1;
            }
            if (this._activeSentenceIndex === foundIndex) return;
            this._activeSentenceIndex = foundIndex;
            this.sentenceEntries.forEach((entry, index) => {
                entry.container.classList.toggle("voice-video-player-transcript-item--active", index === foundIndex);
            });
            if (this.subtitle) {
                this.subtitle.value = this.sentences[foundIndex]?.text || "";
            }
            this.sentenceEntries[foundIndex]?.container?.scrollIntoView({ block: "nearest", inline: "nearest" });
        }

        _renderSentences() {
            if (!this.transcriptList) return;
            this.transcriptList.innerHTML = "";
            this.sentenceEntries = [];
            this.sentences.forEach((sentence, index) => {
                const container = document.createElement("div");
                container.className = "voice-video-player-transcript-item";
                const timesRow = document.createElement("div");
                timesRow.className = "voice-video-player-transcript-item__times";
                const startInput = document.createElement("input");
                startInput.type = "text";
                startInput.className = "voice-video-player-transcript-time";
                startInput.value = formatVttTime(sentence.start);
                const arrow = document.createElement("span");
                arrow.textContent = "→";
                const endInput = document.createElement("input");
                endInput.type = "text";
                endInput.className = "voice-video-player-transcript-time";
                endInput.value = formatVttTime(sentence.end);
                startInput.addEventListener("blur", () => this._handleTimeEdit(index, startInput.value, endInput.value));
                endInput.addEventListener("blur", () => this._handleTimeEdit(index, startInput.value, endInput.value));
                timesRow.append(startInput, arrow, endInput);
                const contentEl = document.createElement("div");
                contentEl.className = "voice-video-player-transcript-item__content";
                contentEl.contentEditable = "true";
                contentEl.spellcheck = false;
                contentEl.textContent = sentence.text || "";
                contentEl.addEventListener("input", () => this._handleTextEdit(index, contentEl.textContent || ""));
                contentEl.addEventListener("click", () => {
                    if (this.videoEl?.duration) {
                        this.videoEl.currentTime = Number(sentence.start || 0);
                    }
                });
                container.append(timesRow, contentEl);
                this.transcriptList.appendChild(container);
                this.sentenceEntries.push({ container, contentEl, startInput, endInput });
            });
            this._refreshActiveNode();
        }

        _handleTextEdit(index, value) {
            const sentence = this.sentences[index];
            if (!sentence) return;
            sentence.text = value;
            if (index === this._activeSentenceIndex && this.subtitle) {
                this.subtitle.value = value;
            }
            this._notifyTranscriptChange();
        }

        _handleTimeEdit(index, startValue, endValue) {
            const sentence = this.sentences[index];
            if (!sentence) return;
            const parsedStart = parseVttTime(startValue);
            const parsedEnd = parseVttTime(endValue);
            const start = Number.isFinite(parsedStart) ? parsedStart : sentence.start;
            let end = Number.isFinite(parsedEnd) ? parsedEnd : sentence.end;
            if (!Number.isFinite(end) || end <= start) {
                end = start + 0.1;
            }
            sentence.start = start;
            sentence.end = end;
            this.sentenceEntries[index]?.startInput && (this.sentenceEntries[index].startInput.value = formatVttTime(start));
            this.sentenceEntries[index]?.endInput && (this.sentenceEntries[index].endInput.value = formatVttTime(end));
            this._notifyTranscriptChange();
        }

        _notifyTranscriptChange() {
            if (!this.onTranscriptChange) return;
            const snapshot = this.sentences.map(sentence => ({ ...sentence }));
            this.onTranscriptChange(snapshot);
        }

        _normalizeSentences(rawSentences = []) {
            const working = Array.isArray(rawSentences) ? rawSentences.slice() : [];
            const normalized = working.map((sentence, index) => {
                const start = Number.isFinite(sentence.start) ? sentence.start : (Number.isFinite(sentence.start_time) ? sentence.start_time : 0);
                const end = Number.isFinite(sentence.end) ? sentence.end : (Number.isFinite(sentence.end_time) ? sentence.end_time : NaN);
                let safeEnd = Number.isFinite(end) ? end : NaN;
                if (!Number.isFinite(safeEnd) || safeEnd <= start) {
                    safeEnd = index < working.length - 1 ? (working[index + 1]?.start || start + 0.4) : start + 3;
                }
                return {
                    id: sentence.id || `sentence-${index}`,
                    text: sentence.text || "",
                    start,
                    end: safeEnd
                };
            });
            if (!normalized.length) {
                normalized.push({ id: "sentence-0", text: "", start: 0, end: 3 });
            }
            this.sentences = normalized;
        }

        _applyVideoBlob(blob) {
            if (!this.videoEl) return;
            if (this.videoBlobUrl) {
                URL.revokeObjectURL(this.videoBlobUrl);
                this.videoBlobUrl = "";
            }
            this.videoBlobUrl = URL.createObjectURL(blob);
            this.videoEl.src = this.videoBlobUrl;
            this.videoEl.load();
            this.progress && (this.progress.value = "0");
            this.timeLabel && (this.timeLabel.textContent = "00:00 / 00:00");
            this._updatePlayButton();
        }

        open(options = {}) {
            const { videoBlob, sentences = [], onTranscriptChange, onTranscriptSaved } = options;
            if (!videoBlob) return;
            this.onTranscriptChange = typeof onTranscriptChange === "function" ? onTranscriptChange : null;
            this.onTranscriptSaved = typeof onTranscriptSaved === "function" ? onTranscriptSaved : null;
            this._normalizeSentences(sentences);
            this._renderSentences();
            this._applyVideoBlob(videoBlob);
            this.subtitle && (this.subtitle.value = this.sentences[0]?.text || "");
            this.overlay.classList.add("voice-video-player-modal--open");
            this.overlay.setAttribute("aria-hidden", "false");
            document.body?.classList.add("voice-video-player-modal-open");
            document.addEventListener("keydown", this._handleKeydown);
            this._activeSentenceIndex = -1;
        }

        close() {
            if (!this.overlay?.classList?.contains("voice-video-player-modal--open")) return;
            this.overlay.classList.remove("voice-video-player-modal--open");
            this.overlay.setAttribute("aria-hidden", "true");
            document.body?.classList.remove("voice-video-player-modal-open");
            document.removeEventListener("keydown", this._handleKeydown);
            if (this.videoEl) {
                this.videoEl.pause();
                this.videoEl.removeAttribute("src");
                this.videoEl.load();
            }
            if (this.videoBlobUrl) {
                URL.revokeObjectURL(this.videoBlobUrl);
                this.videoBlobUrl = "";
            }
            if (this.subtitle) {
                this.subtitle.value = "";
            }
        }
    }

    window.VoiceVideoPlayerModal = VoiceVideoPlayerModal;
})();
