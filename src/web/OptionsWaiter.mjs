/**
 * Waiter to handle events related to the CyberChef options.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 *
 * @constructor
 * @param {App} app - The main view object for CyberChef.
 */
const OptionsWaiter = function(app, manager) {
    this.app = app;
    this.manager = manager;
};


/**
 * Loads options and sets values of switches and inputs to match them.
 *
 * @param {Object} options
 */
OptionsWaiter.prototype.load = function(options) {
    for (const option in options) {
        this.app.options[option] = options[option];
    }

    // Set options to match object
    const cboxes = document.querySelectorAll("#options-body input[type=checkbox]");
    let i;
    for (i = 0; i < cboxes.length; i++) {
        cboxes[i].checked = this.app.options[cboxes[i].getAttribute("option")];
    }

    const nboxes = document.querySelectorAll("#options-body input[type=number]");
    for (i = 0; i < nboxes.length; i++) {
        nboxes[i].value = this.app.options[nboxes[i].getAttribute("option")];
        nboxes[i].dispatchEvent(new CustomEvent("change", {bubbles: true}));
    }

    const selects = document.querySelectorAll("#options-body select");
    for (i = 0; i < selects.length; i++) {
        const val = this.app.options[selects[i].getAttribute("option")];
        if (val) {
            selects[i].value = val;
            selects[i].dispatchEvent(new CustomEvent("change", {bubbles: true}));
        } else {
            selects[i].selectedIndex = 0;
        }
    }
};


/**
 * Handler for options click events.
 * Dispays the options pane.
 *
 * @param {event} e
 */
OptionsWaiter.prototype.optionsClick = function(e) {
    e.preventDefault();
    $("#options-modal").modal();
};


/**
 * Handler for reset options click events.
 * Resets options back to their default values.
 */
OptionsWaiter.prototype.resetOptionsClick = function() {
    this.load(this.app.doptions);
};


/**
 * Handler for switch change events.
 * Modifies the option state and saves it to local storage.
 *
 * @param {event} e
 */
OptionsWaiter.prototype.switchChange = function(e) {
    const el = e.target;
    const option = el.getAttribute("option");
    const state = el.checked;

    log.debug(`Setting ${option} to ${state}`);
    this.app.options[option] = state;

    if (this.app.isLocalStorageAvailable())
        localStorage.setItem("options", JSON.stringify(this.app.options));
};


/**
 * Handler for number change events.
 * Modifies the option value and saves it to local storage.
 *
 * @param {event} e
 */
OptionsWaiter.prototype.numberChange = function(e) {
    const el = e.target;
    const option = el.getAttribute("option");
    const val = parseInt(el.value, 10);

    log.debug(`Setting ${option} to ${val}`);
    this.app.options[option] = val;

    if (this.app.isLocalStorageAvailable())
        localStorage.setItem("options", JSON.stringify(this.app.options));
};


/**
 * Handler for select change events.
 * Modifies the option value and saves it to local storage.
 *
 * @param {event} e
 */
OptionsWaiter.prototype.selectChange = function(e) {
    const el = e.target;
    const option = el.getAttribute("option");

    log.debug(`Setting ${option} to ${el.value}`);
    this.app.options[option] = el.value;

    if (this.app.isLocalStorageAvailable())
        localStorage.setItem("options", JSON.stringify(this.app.options));
};


/**
 * Sets or unsets word wrap on the input and output depending on the wordWrap option value.
 */
OptionsWaiter.prototype.setWordWrap = function() {
    document.getElementById("input-text").classList.remove("word-wrap");
    document.getElementById("output-text").classList.remove("word-wrap");
    document.getElementById("output-html").classList.remove("word-wrap");
    document.getElementById("input-highlighter").classList.remove("word-wrap");
    document.getElementById("output-highlighter").classList.remove("word-wrap");

    if (!this.app.options.wordWrap) {
        document.getElementById("input-text").classList.add("word-wrap");
        document.getElementById("output-text").classList.add("word-wrap");
        document.getElementById("output-html").classList.add("word-wrap");
        document.getElementById("input-highlighter").classList.add("word-wrap");
        document.getElementById("output-highlighter").classList.add("word-wrap");
    }
};


/**
 * Changes the theme by setting the class of the <html> element.
 *
 * @param {Event} e
 */
OptionsWaiter.prototype.themeChange = function (e) {
    const themeClass = e.target.value;

    document.querySelector(":root").className = themeClass;
};


/**
 * Changes the console logging level.
 *
 * @param {Event} e
 */
OptionsWaiter.prototype.logLevelChange = function (e) {
    const level = e.target.value;
    log.setLevel(level, false);
    this.manager.worker.setLogLevel();
};

export default OptionsWaiter;
