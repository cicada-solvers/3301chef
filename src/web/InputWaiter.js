import Utils from "../core/Utils.js";
import LiberPages from "../core/operations/LiberPages.js";

require("./static/images/cicada/0.jpg");
require("./static/images/cicada/1.jpg");
require("./static/images/cicada/2.jpg");
require("./static/images/cicada/3.jpg");
require("./static/images/cicada/4.jpg");
require("./static/images/cicada/5.jpg");
require("./static/images/cicada/6.jpg");
require("./static/images/cicada/7.jpg");
require("./static/images/cicada/8.jpg");
require("./static/images/cicada/9.jpg");
require("./static/images/cicada/10.jpg");
require("./static/images/cicada/11.jpg");
require("./static/images/cicada/12.jpg");
require("./static/images/cicada/13.jpg");
require("./static/images/cicada/14.jpg");
require("./static/images/cicada/15.jpg");
require("./static/images/cicada/16.jpg");
require("./static/images/cicada/17.jpg");
require("./static/images/cicada/18.jpg");
require("./static/images/cicada/19.jpg");
require("./static/images/cicada/20.jpg");
require("./static/images/cicada/21.jpg");
require("./static/images/cicada/22.jpg");
require("./static/images/cicada/23.jpg");
require("./static/images/cicada/24.jpg");
require("./static/images/cicada/25.jpg");
require("./static/images/cicada/26.jpg");
require("./static/images/cicada/27.jpg");
require("./static/images/cicada/28.jpg");
require("./static/images/cicada/29.jpg");
require("./static/images/cicada/30.jpg");
require("./static/images/cicada/31.jpg");
require("./static/images/cicada/32.jpg");
require("./static/images/cicada/33.jpg");
require("./static/images/cicada/34.jpg");
require("./static/images/cicada/35.jpg");
require("./static/images/cicada/36.jpg");
require("./static/images/cicada/37.jpg");
require("./static/images/cicada/38.jpg");
require("./static/images/cicada/39.jpg");
require("./static/images/cicada/40.jpg");
require("./static/images/cicada/41.jpg");
require("./static/images/cicada/42.jpg");
require("./static/images/cicada/43.jpg");
require("./static/images/cicada/44.jpg");
require("./static/images/cicada/45.jpg");
require("./static/images/cicada/46.jpg");
require("./static/images/cicada/47.jpg");
require("./static/images/cicada/48.jpg");
require("./static/images/cicada/49.jpg");
require("./static/images/cicada/50.jpg");
require("./static/images/cicada/51.jpg");
require("./static/images/cicada/52.jpg");
require("./static/images/cicada/53.jpg");
require("./static/images/cicada/54.jpg");
require("./static/images/cicada/55.jpg");
require("./static/images/cicada/56.jpg");
require("./static/images/cicada/57.jpg");

require("./static/images/cicada/LP1_0.jpg");
require("./static/images/cicada/LP1_1.jpg");
require("./static/images/cicada/LP1_2.jpg");
require("./static/images/cicada/LP1_3.jpg");
require("./static/images/cicada/LP1_4.jpg");
require("./static/images/cicada/LP1_5.jpg");
require("./static/images/cicada/LP1_6.jpg");
require("./static/images/cicada/LP1_7.jpg");
require("./static/images/cicada/LP1_8.jpg");
require("./static/images/cicada/LP1_9.jpg");
require("./static/images/cicada/LP1_10.jpg");
require("./static/images/cicada/LP1_11.jpg");
require("./static/images/cicada/LP1_12.jpg");
require("./static/images/cicada/LP1_13.jpg");
require("./static/images/cicada/LP1_14.jpg");
require("./static/images/cicada/LP1_15.jpg");
require("./static/images/cicada/LP1_16.jpg");

require("./static/images/cicada/gematria.jpg");
require("./static/images/cicada/3301.jpg");
require("./static/images/cicada/1033.jpg");

/**
 * Waiter to handle events related to the input.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 *
 * @constructor
 * @param {App} app - The main view object for CyberChef.
 * @param {Manager} manager - The CyberChef event manager.
 */
const InputWaiter = function(app, manager) {
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
};


/**
 * Gets the user's input from the input textarea.
 *
 * @returns {string}
 */
InputWaiter.prototype.get = function() {
    return document.getElementById("input-text").value;
};


/**
 * Sets the input in the input textarea.
 *
 * @param {string} input
 *
 * @fires Manager#statechange
 */
InputWaiter.prototype.set = function(input) {
    document.getElementById("input-text").value = input;
    window.dispatchEvent(this.manager.statechange);
};


/**
 * Displays information about the input.
 *
 * @param {number} length - The length of the current input string
 * @param {number} lines - The number of the lines in the current input string
 */
InputWaiter.prototype.setInputInfo = function(length, lines) {
    let width = length.toString().length;
    width = width < 2 ? 2 : width;

    const lengthStr = Utils.pad(length.toString(), width, " ").replace(/ /g, "&nbsp;");
    const linesStr  = Utils.pad(lines.toString(), width, " ").replace(/ /g, "&nbsp;");

    document.getElementById("input-info").innerHTML = "length: " + lengthStr + "<br>lines: " + linesStr;
};


/**
 * Handler for input scroll events.
 * Scrolls the highlighter pane to match the input textarea position and updates history state.
 *
 * @param {event} e
 *
 * @fires Manager#statechange
 */
InputWaiter.prototype.inputChange = function(e) {
    // Remove highlighting from input and output panes as the offsets might be different now
    this.manager.highlighter.removeHighlights();

    // Reset recipe progress as any previous processing will be redundant now
    this.app.progress = 0;

    // Update the input metadata info
    const inputText = this.get();
    const lines = inputText.count("\n") + 1;

    this.setInputInfo(inputText.length, lines);


    if (this.badKeys.indexOf(e.keyCode) < 0) {
        // Fire the statechange event as the input has been modified
        window.dispatchEvent(this.manager.statechange);
    }
};


/**
 * Handler for input dragover events.
 * Gives the user a visual cue to show that items can be dropped here.
 *
 * @param {event} e
 */
InputWaiter.prototype.inputDragover = function(e) {
    // This will be set if we're dragging an operation
    if (e.dataTransfer.effectAllowed === "move")
        return false;

    e.stopPropagation();
    e.preventDefault();
    e.target.classList.add("dropping-file");
};


/**
 * Handler for input dragleave events.
 * Removes the visual cue.
 *
 * @param {event} e
 */
InputWaiter.prototype.inputDragleave = function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.classList.remove("dropping-file");
};


/**
 * Handler for input drop events.
 * Loads the dragged data into the input textarea.
 *
 * @param {event} e
 */
InputWaiter.prototype.inputDrop = function(e) {
    // This will be set if we're dragging an operation
    if (e.dataTransfer.effectAllowed === "move")
        return false;

    e.stopPropagation();
    e.preventDefault();

    const el = e.target;
    const file = e.dataTransfer.files[0];
    const text = e.dataTransfer.getData("Text");
    const reader = new FileReader();
    let inputCharcode = "";
    let offset = 0;
    const CHUNK_SIZE = 20480; // 20KB

    const setInput = function() {
        if (inputCharcode.length > 100000 && this.app.autoBake_) {
            this.manager.controls.setAutoBake(false);
            this.app.alert("Turned off Auto Bake as the input is large", "warning", 5000);
        }

        this.set(inputCharcode);
        const recipeConfig = this.app.getRecipeConfig();
        if (!recipeConfig[0] || recipeConfig[0].op !== "From Hex") {
            recipeConfig.unshift({op:"From Hex", args:["Space"]});
            this.app.setRecipeConfig(recipeConfig);
        }

        el.classList.remove("loadingFile");
    }.bind(this);

    const seek = function() {
        if (offset >= file.size) {
            setInput();
            return;
        }
        el.value = "Processing... " + Math.round(offset / file.size * 100) + "%";
        const slice = file.slice(offset, offset + CHUNK_SIZE);
        reader.readAsArrayBuffer(slice);
    };

    reader.onload = function(e) {
        const data = new Uint8Array(reader.result);
        inputCharcode += Utils.toHexFast(data);
        offset += CHUNK_SIZE;
        seek();
    };


    el.classList.remove("dropping-file");

    if (file) {
        el.classList.add("loadingFile");
        seek();
    } else if (text) {
        this.set(text);
    }
};


/**
 * Handler for clear IO events.
 * Resets the input, output and info areas.
 *
 * @fires Manager#statechange
 */
InputWaiter.prototype.clearIoClick = function() {
    this.manager.highlighter.removeHighlights();
    document.getElementById("input-text").value = "";
    document.getElementById("output-text").value = "";
    document.getElementById("input-info").innerHTML = "";
    document.getElementById("output-info").innerHTML = "";
    document.getElementById("input-selection-info").innerHTML = "";
    document.getElementById("output-selection-info").innerHTML = "";
    window.dispatchEvent(this.manager.statechange);
};

InputWaiter.prototype.loadLP = function() {
    const filename = window.prompt("Enter a page number or a range of numbers to load LP text into CyberChef(or 100-116 for LP1):", "57");
    if (filename) {
        document.getElementById("input-text").value = "";
        let filenames = filename.split(",");
        let ranges = [];
        let findRanges = filenames.filter(function(filename){
            return filename.indexOf("-") > -1;//find anything that is a range of values
        }); 
        ranges = ranges.concat(findRanges);
        if (ranges.length > 0){
            ranges.forEach(function(range){
                filenames.splice(filenames.indexOf(range), 1); // remove the range from the complete list of filenames
                let bounds = range.split("-");
                let lowerbound = bounds[0];
                let upperbound = bounds[1];
                for (let i = lowerbound; i <= upperbound; i++){
                    filenames.push("" + i);//push all appropriate pages
                }
            });
        }
        filenames.sort();

        for (let i = 0; i <  filenames.length; i++) {
            let pageNumber = "" + filenames[i];
            if (LiberPages[pageNumber]){
                let cipherArray = LiberPages[pageNumber].ciphertext;
                let cipherText = "";
                cipherArray.forEach(function(sentence){
                    sentence.forEach(function(line){
                        cipherText += line + "\n";
                    });
                    cipherText += " ";
                });
                document.getElementById("input-text").value += cipherText + "\n";
            } else {
                document.getElementById("input-text").value = "Invalid page number entered.";
            }
        }
    }
};


InputWaiter.prototype.openImages = function() {
    const filename = window.prompt("Enter a page number or a range of numbers(0-57) to view LP images.\n\nLP1_0 - LP1_16 for First 16 Pages\n3301 for the 2016 message\ngematria for Gematria Primus\nDisable popup blocker.", "0-2,LP1_0");
    if (filename) {
        let filenames = filename.split(",");
        let ranges = [];
        let findRanges = filenames.filter(function(filename){
            return filename.indexOf("-") > -1;//find anything that is a range of values
        }); 
        ranges = ranges.concat(findRanges);
        if (ranges.length > 0){
            ranges.forEach(function(range){
                filenames.splice(filenames.indexOf(range), 1); // remove the range from the complete list of filenames
                let bounds = range.split("-");
                let lowerbound = bounds[0];
                let upperbound = bounds[1];
                for (let i = lowerbound; i <= upperbound; i++){
                    filenames.push("" + i);//push all appropriate pages
                }
            });
        }
        filenames.sort();


        for (let i = 0; i <  filenames.length; i++) {
            let pageNumber = "" + filenames[i];
            window.open("images/"+pageNumber+".jpg");
        }
    }
};
export default InputWaiter;
