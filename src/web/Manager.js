import WindowWaiter from "./WindowWaiter.js";
import ControlsWaiter from "./ControlsWaiter.js";
import RecipeWaiter from "./RecipeWaiter.js";
import OperationsWaiter from "./OperationsWaiter.js";
import InputWaiter from "./InputWaiter.js";
import OutputWaiter from "./OutputWaiter.js";
import OptionsWaiter from "./OptionsWaiter.js";
import HighlighterWaiter from "./HighlighterWaiter.js";
import SeasonalWaiter from "./SeasonalWaiter.js";


/**
 * This object controls the Waiters responsible for handling events from all areas of the app.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 *
 * @constructor
 * @param {App} app - The main view object for CyberChef.
 */
const Manager = function(app) {
    this.app = app;

    // Define custom events
    /**
     * @event Manager#appstart
     */
    this.appstart = new CustomEvent("appstart", {bubbles: true});
    /**
     * @event Manager#operationadd
     */
    this.operationadd = new CustomEvent("operationadd", {bubbles: true});
    /**
     * @event Manager#operationremove
     */
    this.operationremove = new CustomEvent("operationremove", {bubbles: true});
    /**
     * @event Manager#oplistcreate
     */
    this.oplistcreate = new CustomEvent("oplistcreate", {bubbles: true});
    /**
     * @event Manager#statechange
     */
    this.statechange = new CustomEvent("statechange", {bubbles: true});

    // Define Waiter objects to handle various areas
    this.window      = new WindowWaiter(this.app);
    this.controls    = new ControlsWaiter(this.app, this);
    this.recipe      = new RecipeWaiter(this.app, this);
    this.ops         = new OperationsWaiter(this.app, this);
    this.input       = new InputWaiter(this.app, this);
    this.output      = new OutputWaiter(this.app, this);
    this.options     = new OptionsWaiter(this.app);
    this.highlighter = new HighlighterWaiter(this.app);
    this.seasonal    = new SeasonalWaiter(this.app, this);

    // Object to store dynamic handlers to fire on elements that may not exist yet
    this.dynamicHandlers = {};

    this.initialiseEventListeners();
};


/**
 * Sets up the various components and listeners.
 */
Manager.prototype.setup = function() {
    this.recipe.initialiseOperationDragNDrop();
    this.controls.autoBakeChange();
    this.seasonal.load();
};


/**
 * Main function to handle the creation of the event listeners.
 */
Manager.prototype.initialiseEventListeners = function() {
    // Global
    window.addEventListener("resize", this.window.windowResize.bind(this.window));
    window.addEventListener("blur", this.window.windowBlur.bind(this.window));
    window.addEventListener("focus", this.window.windowFocus.bind(this.window));
    window.addEventListener("statechange", this.app.stateChange.bind(this.app));
    window.addEventListener("popstate", this.app.popState.bind(this.app));

    // Controls
    document.getElementById("bake").addEventListener("click", this.controls.bakeClick.bind(this.controls));
    document.getElementById("auto-bake").addEventListener("change", this.controls.autoBakeChange.bind(this.controls));
    document.getElementById("step").addEventListener("click", this.controls.stepClick.bind(this.controls));
    document.getElementById("clr-recipe").addEventListener("click", this.controls.clearRecipeClick.bind(this.controls));
    document.getElementById("clr-breaks").addEventListener("click", this.controls.clearBreaksClick.bind(this.controls));
    document.getElementById("save").addEventListener("click", this.controls.saveClick.bind(this.controls));
    document.getElementById("save-button").addEventListener("click", this.controls.saveButtonClick.bind(this.controls));
    document.getElementById("save-link-recipe-checkbox").addEventListener("change", this.controls.slrCheckChange.bind(this.controls));
    document.getElementById("save-link-input-checkbox").addEventListener("change", this.controls.sliCheckChange.bind(this.controls));
    document.getElementById("load").addEventListener("click", this.controls.loadClick.bind(this.controls));
    document.getElementById("load-delete-button").addEventListener("click", this.controls.loadDeleteClick.bind(this.controls));
    document.getElementById("load-name").addEventListener("change", this.controls.loadNameChange.bind(this.controls));
    document.getElementById("load-button").addEventListener("click", this.controls.loadButtonClick.bind(this.controls));
    document.getElementById("support").addEventListener("click", this.controls.supportButtonClick.bind(this.controls));
    this.addMultiEventListener("#save-text", "keyup paste", this.controls.saveTextChange, this.controls);

    // Operations
    this.addMultiEventListener("#search", "keyup paste search", this.ops.searchOperations, this.ops);
    this.addDynamicListener(".op-list li.operation", "dblclick", this.ops.operationDblclick, this.ops);
    document.getElementById("edit-favourites").addEventListener("click", this.ops.editFavouritesClick.bind(this.ops));
    document.getElementById("save-favourites").addEventListener("click", this.ops.saveFavouritesClick.bind(this.ops));
    document.getElementById("reset-favourites").addEventListener("click", this.ops.resetFavouritesClick.bind(this.ops));
    this.addDynamicListener(".op-list .op-icon", "mouseover", this.ops.opIconMouseover, this.ops);
    this.addDynamicListener(".op-list .op-icon", "mouseleave", this.ops.opIconMouseleave, this.ops);
    this.addDynamicListener(".op-list", "oplistcreate", this.ops.opListCreate, this.ops);
    this.addDynamicListener("li.operation", "operationadd", this.recipe.opAdd.bind(this.recipe));

    // Recipe
    this.addDynamicListener(".arg", "keyup", this.recipe.ingChange, this.recipe);
    this.addDynamicListener(".arg", "change", this.recipe.ingChange, this.recipe);
    this.addDynamicListener(".disable-icon", "click", this.recipe.disableClick, this.recipe);
    this.addDynamicListener(".breakpoint", "click", this.recipe.breakpointClick, this.recipe);
    this.addDynamicListener("#rec-list li.operation", "dblclick", this.recipe.operationDblclick, this.recipe);
    this.addDynamicListener("#rec-list li.operation > div", "dblclick", this.recipe.operationChildDblclick, this.recipe);
    this.addDynamicListener("#rec-list .input-group .dropdown-menu a", "click", this.recipe.dropdownToggleClick, this.recipe);
    this.addDynamicListener("#rec-list", "operationremove", this.recipe.opRemove.bind(this.recipe));

    // Input
    this.addMultiEventListener("#input-text", "keyup paste", this.input.inputChange, this.input);
    document.getElementById("reset-layout").addEventListener("click", this.app.resetLayout.bind(this.app));
    document.getElementById("clr-io").addEventListener("click", this.input.clearIoClick.bind(this.input));
    document.getElementById("load-lp").addEventListener("click", this.input.loadLP.bind(this.input));
    document.getElementById("open-lp").addEventListener("click", this.input.openImages.bind(this.input));    
    document.getElementById("input-text").addEventListener("dragover", this.input.inputDragover.bind(this.input));
    document.getElementById("input-text").addEventListener("dragleave", this.input.inputDragleave.bind(this.input));
    document.getElementById("input-text").addEventListener("drop", this.input.inputDrop.bind(this.input));
    document.getElementById("input-text").addEventListener("scroll", this.highlighter.inputScroll.bind(this.highlighter));
    document.getElementById("input-text").addEventListener("mouseup", this.highlighter.inputMouseup.bind(this.highlighter));
    document.getElementById("input-text").addEventListener("mousemove", this.highlighter.inputMousemove.bind(this.highlighter));
    this.addMultiEventListener("#input-text", "mousedown dblclick select",  this.highlighter.inputMousedown, this.highlighter);

    // Output
    document.getElementById("save-to-file").addEventListener("click", this.output.saveClick.bind(this.output));
    document.getElementById("switch").addEventListener("click", this.output.switchClick.bind(this.output));
    document.getElementById("undo-switch").addEventListener("click", this.output.undoSwitchClick.bind(this.output));
    document.getElementById("maximise-output").addEventListener("click", this.output.maximiseOutputClick.bind(this.output));
    document.getElementById("output-text").addEventListener("scroll", this.highlighter.outputScroll.bind(this.highlighter));
    document.getElementById("output-text").addEventListener("mouseup", this.highlighter.outputMouseup.bind(this.highlighter));
    document.getElementById("output-text").addEventListener("mousemove", this.highlighter.outputMousemove.bind(this.highlighter));
    document.getElementById("output-html").addEventListener("mouseup", this.highlighter.outputHtmlMouseup.bind(this.highlighter));
    document.getElementById("output-html").addEventListener("mousemove", this.highlighter.outputHtmlMousemove.bind(this.highlighter));
    this.addMultiEventListener("#output-text", "mousedown dblclick select",  this.highlighter.outputMousedown, this.highlighter);
    this.addMultiEventListener("#output-html", "mousedown dblclick select",  this.highlighter.outputHtmlMousedown, this.highlighter);
    this.addDynamicListener(".file-switch", "click", this.output.fileSwitch, this.output);

    // Options
    document.getElementById("options").addEventListener("click", this.options.optionsClick.bind(this.options));
    document.getElementById("reset-options").addEventListener("click", this.options.resetOptionsClick.bind(this.options));
    $(document).on("switchChange.bootstrapSwitch", ".option-item input:checkbox", this.options.switchChange.bind(this.options));
    $(document).on("switchChange.bootstrapSwitch", ".option-item input:checkbox", this.options.setWordWrap.bind(this.options));
    this.addDynamicListener(".option-item input[type=number]", "keyup", this.options.numberChange, this.options);
    this.addDynamicListener(".option-item input[type=number]", "change", this.options.numberChange, this.options);
    this.addDynamicListener(".option-item select", "change", this.options.selectChange, this.options);
    document.getElementById("theme").addEventListener("change", this.options.themeChange.bind(this.options));

    // Misc
    document.getElementById("alert-close").addEventListener("click", this.app.alertCloseClick.bind(this.app));
};


/**
 * Adds an event listener to each element in the specified group.
 *
 * @param {string} selector - A selector string for the element group to add the event to, see
 *   this.getAll()
 * @param {string} eventType - The event to listen for
 * @param {function} callback - The function to execute when the event is triggered
 * @param {Object} [scope=this] - The object to bind to the callback function
 *
 * @example
 * // Calls the clickable function whenever any element with the .clickable class is clicked
 * this.addListeners(".clickable", "click", this.clickable, this);
 */
Manager.prototype.addListeners = function(selector, eventType, callback, scope) {
    scope = scope || this;
    [].forEach.call(document.querySelectorAll(selector), function(el) {
        el.addEventListener(eventType, callback.bind(scope));
    });
};


/**
 * Adds multiple event listeners to the specified element.
 *
 * @param {string} selector - A selector string for the element to add the events to
 * @param {string} eventTypes - A space-separated string of all the event types to listen for
 * @param {function} callback - The function to execute when the events are triggered
 * @param {Object} [scope=this] - The object to bind to the callback function
 *
 * @example
 * // Calls the search function whenever the the keyup, paste or search events are triggered on the
 * // search element
 * this.addMultiEventListener("search", "keyup paste search", this.search, this);
 */
Manager.prototype.addMultiEventListener = function(selector, eventTypes, callback, scope) {
    const evs = eventTypes.split(" ");
    for (let i = 0; i < evs.length; i++) {
        document.querySelector(selector).addEventListener(evs[i], callback.bind(scope));
    }
};


/**
 * Adds multiple event listeners to each element in the specified group.
 *
 * @param {string} selector - A selector string for the element group to add the events to
 * @param {string} eventTypes - A space-separated string of all the event types to listen for
 * @param {function} callback - The function to execute when the events are triggered
 * @param {Object} [scope=this] - The object to bind to the callback function
 *
 * @example
 * // Calls the save function whenever the the keyup or paste events are triggered on any element
 * // with the .saveable class
 * this.addMultiEventListener(".saveable", "keyup paste", this.save, this);
 */
Manager.prototype.addMultiEventListeners = function(selector, eventTypes, callback, scope) {
    const evs = eventTypes.split(" ");
    for (let i = 0; i < evs.length; i++) {
        this.addListeners(selector, evs[i], callback, scope);
    }
};


/**
 * Adds an event listener to the global document object which will listen on dynamic elements which
 * may not exist in the DOM yet.
 *
 * @param {string} selector - A selector string for the element(s) to add the event to
 * @param {string} eventType - The event(s) to listen for
 * @param {function} callback - The function to execute when the event(s) is/are triggered
 * @param {Object} [scope=this] - The object to bind to the callback function
 *
 * @example
 * // Pops up an alert whenever any button is clicked, even if it is added to the DOM after this
 * // listener is created
 * this.addDynamicListener("button", "click", alert, this);
 */
Manager.prototype.addDynamicListener = function(selector, eventType, callback, scope) {
    const eventConfig = {
        selector: selector,
        callback: callback.bind(scope || this)
    };

    if (this.dynamicHandlers.hasOwnProperty(eventType)) {
        // Listener already exists, add new handler to the appropriate list
        this.dynamicHandlers[eventType].push(eventConfig);
    } else {
        this.dynamicHandlers[eventType] = [eventConfig];
        // Set up listener for this new type
        document.addEventListener(eventType, this.dynamicListenerHandler.bind(this));
    }
};


/**
 * Handler for dynamic events. This function is called for any dynamic event and decides which
 * callback(s) to execute based on the type and selector.
 *
 * @param {Event} e - The event to be handled
 */
Manager.prototype.dynamicListenerHandler = function(e) {
    const { type, target } = e;
    const handlers = this.dynamicHandlers[type];
    const matches = target.matches ||
            target.webkitMatchesSelector ||
            target.mozMatchesSelector ||
            target.msMatchesSelector ||
            target.oMatchesSelector;

    for (let i = 0; i < handlers.length; i++) {
        if (matches && matches.call(target, handlers[i].selector)) {
            handlers[i].callback(e);
        }
    }
};

export default Manager;
