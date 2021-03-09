/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import LoaderWorker from "worker-loader?inline&fallback=false!./LoaderWorker";
import Utils from "../core/Utils";


/**
 * Waiter to handle events related to the input.
 */
class InputWaiter {

    /**
     * InputWaiter constructor.
     *
     * @param {App} app - The main view object for CyberChef.
     * @param {Manager} manager - The CyberChef event manager.
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;

        // Define keys that don't change the input so we don't have to autobake when they are pressed
        this.badKeys = [
            16, //Shift
            17, //Ctrl
            18, //Alt
            19, //Pause
            20, //Caps
            27, //Esc
            33, 34, 35, 36, //PgUp, PgDn, End, Home
            37, 38, 39, 40, //Directional
            44, //PrntScrn
            91, 92, //Win
            93, //Context
            112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, //F1-12
            144, //Num
            145, //Scroll
        ];

        this.loaderWorker = null;
        this.fileBuffer = null;
    }


    /**
     * Gets the user's input from the input textarea.
     *
     * @returns {string}
     */
    get() {
        return this.fileBuffer || document.getElementById("input-text").value;
    }


    /**
     * Sets the input in the input area.
     *
     * @param {string|File} input
     * @param {boolean} [silent=false] - Suppress statechange event
     *
     * @fires Manager#statechange
     */
    set(input, silent=false) {
        const inputText = document.getElementById("input-text");
        if (input instanceof File) {
            this.setFile(input);
            inputText.value = "";
            this.setInputInfo(input.size, null);
        } else {
            inputText.value = input;
            this.closeFile();
            if (!silent) window.dispatchEvent(this.manager.statechange);
            const lines = input.length < (this.app.options.ioDisplayThreshold * 1024) ?
                input.count("\n") + 1 : null;
            this.setInputInfo(input.length, lines);
        }
    }


    /**
     * Shows file details.
     *
     * @param {File} file
     */
    setFile(file) {
        // Display file overlay in input area with details
        const fileOverlay = document.getElementById("input-file"),
            fileName = document.getElementById("input-file-name"),
            fileSize = document.getElementById("input-file-size"),
            fileType = document.getElementById("input-file-type"),
            fileLoaded = document.getElementById("input-file-loaded");

        this.fileBuffer = new ArrayBuffer();
        fileOverlay.style.display = "block";
        fileName.textContent = file.name;
        fileSize.textContent = file.size.toLocaleString() + " bytes";
        fileType.textContent = file.type || "unknown";
        fileLoaded.textContent = "0%";
    }


    /**
     * Displays information about the input.
     *
     * @param {number} length - The length of the current input string
     * @param {number} lines - The number of the lines in the current input string
     */
    setInputInfo(length, lines) {
        let width = length.toString().length;
        width = width < 2 ? 2 : width;

        const lengthStr = length.toString().padStart(width, " ").replace(/ /g, "&nbsp;");
        let msg = "length: " + lengthStr;

        if (typeof lines === "number") {
            const linesStr = lines.toString().padStart(width, " ").replace(/ /g, "&nbsp;");
            msg += "<br>lines: " + linesStr;
        }

        document.getElementById("input-info").innerHTML = msg;
    }


    /**
     * Handler for input change events.
     *
     * @param {event} e
     *
     * @fires Manager#statechange
     */
    inputChange(e) {
        // Ignore this function if the input is a File
        if (this.fileBuffer) return;

        // Remove highlighting from input and output panes as the offsets might be different now
        this.manager.highlighter.removeHighlights();

        // Reset recipe progress as any previous processing will be redundant now
        this.app.progress = 0;

        // Update the input metadata info
        const inputText = this.get();
        const lines = inputText.length < (this.app.options.ioDisplayThreshold * 1024) ?
            inputText.count("\n") + 1 : null;

        this.setInputInfo(inputText.length, lines);

        if (e && this.badKeys.indexOf(e.keyCode) < 0) {
            // Fire the statechange event as the input has been modified
            window.dispatchEvent(this.manager.statechange);
        }
    }


    /**
     * Handler for input paste events.
     * Checks that the size of the input is below the display limit, otherwise treats it as a file/blob.
     *
     * @param {event} e
     */
    inputPaste(e) {
        const pastedData = e.clipboardData.getData("Text");

        if (pastedData.length < (this.app.options.ioDisplayThreshold * 1024)) {
            this.inputChange(e);
        } else {
            e.preventDefault();
            e.stopPropagation();

            const file = new File([pastedData], "PastedData", {
                type: "text/plain",
                lastModified: Date.now()
            });

            this.loaderWorker = new LoaderWorker();
            this.loaderWorker.addEventListener("message", this.handleLoaderMessage.bind(this));
            this.loaderWorker.postMessage({"file": file});
            this.set(file);
            return false;
        }
    }


    /**
     * Handler for input dragover events.
     * Gives the user a visual cue to show that items can be dropped here.
     *
     * @param {event} e
     */
    inputDragover(e) {
        // This will be set if we're dragging an operation
        if (e.dataTransfer.effectAllowed === "move")
            return false;

        e.stopPropagation();
        e.preventDefault();
        e.target.closest("#input-text,#input-file").classList.add("dropping-file");
    }


    /**
     * Handler for input dragleave events.
     * Removes the visual cue.
     *
     * @param {event} e
     */
    inputDragleave(e) {
        e.stopPropagation();
        e.preventDefault();
        document.getElementById("input-text").classList.remove("dropping-file");
        document.getElementById("input-file").classList.remove("dropping-file");
    }


    /**
     * Handler for input drop events.
     * Loads the dragged data into the input textarea.
     *
     * @param {event} e
     */
    inputDrop(e) {
        // This will be set if we're dragging an operation
        if (e.dataTransfer.effectAllowed === "move")
            return false;

        e.stopPropagation();
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        const text = e.dataTransfer.getData("Text");

        document.getElementById("input-text").classList.remove("dropping-file");
        document.getElementById("input-file").classList.remove("dropping-file");

        if (text) {
            this.closeFile();
            this.set(text);
            return;
        }

        if (file) {
            this.closeFile();
            this.loaderWorker = new LoaderWorker();
            this.loaderWorker.addEventListener("message", this.handleLoaderMessage.bind(this));
            this.loaderWorker.postMessage({"file": file});
            this.set(file);
        }
    }


    /**
     * Handler for messages sent back by the LoaderWorker.
     *
     * @param {MessageEvent} e
     */
    handleLoaderMessage(e) {
        const r = e.data;
        if (r.hasOwnProperty("progress")) {
            const fileLoaded = document.getElementById("input-file-loaded");
            fileLoaded.textContent = r.progress + "%";
        }

        if (r.hasOwnProperty("error")) {
            this.app.alert(r.error, 10000);
        }

        if (r.hasOwnProperty("fileBuffer")) {
            log.debug("Input file loaded");
            this.fileBuffer = r.fileBuffer;
            this.displayFilePreview();
            window.dispatchEvent(this.manager.statechange);
        }
    }


    /**
     * Shows a chunk of the file in the input behind the file overlay.
     */
    displayFilePreview() {
        const inputText = document.getElementById("input-text"),
            fileSlice = this.fileBuffer.slice(0, 4096);

        inputText.style.overflow = "hidden";
        inputText.classList.add("blur");
        inputText.value = Utils.printable(Utils.arrayBufferToStr(fileSlice));
        if (this.fileBuffer.byteLength > 4096) {
            inputText.value += "[truncated]...";
        }
    }


    /**
     * Handler for file close events.
     */
    closeFile() {
        if (this.loaderWorker) this.loaderWorker.terminate();
        this.fileBuffer = null;
        document.getElementById("input-file").style.display = "none";
        const inputText = document.getElementById("input-text");
        inputText.style.overflow = "auto";
        inputText.classList.remove("blur");
    }


    /**
     * Handler for clear IO events.
     * Resets the input, output and info areas.
     *
     * @fires Manager#statechange
     */
    clearIoClick() {
        this.closeFile();
        this.manager.output.closeFile();
        this.manager.highlighter.removeHighlights();
        document.getElementById("input-text").value = "";
        document.getElementById("output-text").value = "";
        document.getElementById("input-info").innerHTML = "";
        document.getElementById("output-info").innerHTML = "";
        document.getElementById("input-selection-info").innerHTML = "";
        document.getElementById("output-selection-info").innerHTML = "";
        window.dispatchEvent(this.manager.statechange);
    }

}

export default InputWaiter;
