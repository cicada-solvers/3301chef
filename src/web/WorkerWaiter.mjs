/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import ChefWorker from "worker-loader?inline&fallback=false!../core/ChefWorker";

/**
 * Waiter to handle conversations with the ChefWorker.
 */
class WorkerWaiter {

    /**
     * WorkerWaiter constructor.
     *
     * @param {App} app - The main view object for CyberChef.
     * @param {Manager} manager - The CyberChef event manager.
     */
    constructor(app, manager) {
        this.app = app;
        this.manager = manager;

        this.callbacks = {};
        this.callbackID = 0;
    }


    /**
     * Sets up the ChefWorker and associated listeners.
     */
    registerChefWorker() {
        log.debug("Registering new ChefWorker");
        this.chefWorker = new ChefWorker();
        this.chefWorker.addEventListener("message", this.handleChefMessage.bind(this));
        this.setLogLevel();

        let docURL = document.location.href.split(/[#?]/)[0];
        const index = docURL.lastIndexOf("/");
        if (index > 0) {
            docURL = docURL.substring(0, index);
        }
        this.chefWorker.postMessage({"action": "docURL", "data": docURL});
    }


    /**
     * Handler for messages sent back by the ChefWorker.
     *
     * @param {MessageEvent} e
     */
    handleChefMessage(e) {
        const r = e.data;
        log.debug("Receiving '" + r.action + "' from ChefWorker");

        switch (r.action) {
            case "bakeComplete":
                this.bakingComplete(r.data);
                break;
            case "bakeError":
                this.app.handleError(r.data);
                this.setBakingStatus(false);
                break;
            case "dishReturned":
                this.callbacks[r.data.id](r.data);
                break;
            case "silentBakeComplete":
                break;
            case "workerLoaded":
                this.app.workerLoaded = true;
                log.debug("ChefWorker loaded");
                this.app.loaded();
                break;
            case "statusMessage":
                this.manager.output.setStatusMsg(r.data);
                break;
            case "optionUpdate":
                log.debug(`Setting ${r.data.option} to ${r.data.value}`);
                this.app.options[r.data.option] = r.data.value;
                break;
            case "setRegisters":
                this.manager.recipe.setRegisters(r.data.opIndex, r.data.numPrevRegisters, r.data.registers);
                break;
            case "highlightsCalculated":
                this.manager.highlighter.displayHighlights(r.data.pos, r.data.direction);
                break;
            default:
                log.error("Unrecognised message from ChefWorker", e);
                break;
        }
    }


    /**
     * Updates the UI to show if baking is in process or not.
     *
     * @param {bakingStatus}
     */
    setBakingStatus(bakingStatus) {
        this.app.baking = bakingStatus;

        this.manager.output.toggleLoader(bakingStatus);
    }


    /**
     * Cancels the current bake by terminating the ChefWorker and creating a new one.
     */
    cancelBake() {
        this.chefWorker.terminate();
        this.registerChefWorker();
        this.setBakingStatus(false);
        this.manager.controls.showStaleIndicator();
    }


    /**
     * Handler for completed bakes.
     *
     * @param {Object} response
     */
    bakingComplete(response) {
        this.setBakingStatus(false);

        if (!response) return;

        if (response.error) {
            this.app.handleError(response.error);
        }

        this.app.progress = response.progress;
        this.app.dish = response.dish;
        this.manager.recipe.updateBreakpointIndicator(response.progress);
        this.manager.output.set(response.result, response.type, response.duration);
        log.debug("--- Bake complete ---");
    }


    /**
     * Asks the ChefWorker to bake the current input using the current recipe.
     *
     * @param {string} input
     * @param {Object[]} recipeConfig
     * @param {Object} options
     * @param {number} progress
     * @param {boolean} step
     */
    bake(input, recipeConfig, options, progress, step) {
        this.setBakingStatus(true);

        this.chefWorker.postMessage({
            action: "bake",
            data: {
                input: input,
                recipeConfig: recipeConfig,
                options: options,
                progress: progress,
                step: step
            }
        });
    }


    /**
     * Asks the ChefWorker to run a silent bake, forcing the browser to load and cache all the relevant
     * JavaScript code needed to do a real bake.
     *
     * @param {Object[]} [recipeConfig]
     */
    silentBake(recipeConfig) {
        this.chefWorker.postMessage({
            action: "silentBake",
            data: {
                recipeConfig: recipeConfig
            }
        });
    }


    /**
     * Asks the ChefWorker to calculate highlight offsets if possible.
     *
     * @param {Object[]} recipeConfig
     * @param {string} direction
     * @param {Object} pos - The position object for the highlight.
     * @param {number} pos.start - The start offset.
     * @param {number} pos.end - The end offset.
     */
    highlight(recipeConfig, direction, pos) {
        this.chefWorker.postMessage({
            action: "highlight",
            data: {
                recipeConfig: recipeConfig,
                direction: direction,
                pos: pos
            }
        });
    }


    /**
     * Asks the ChefWorker to return the dish as the specified type
     *
     * @param {Dish} dish
     * @param {string} type
     * @param {Function} callback
     */
    getDishAs(dish, type, callback) {
        const id = this.callbackID++;
        this.callbacks[id] = callback;
        this.chefWorker.postMessage({
            action: "getDishAs",
            data: {
                dish: dish,
                type: type,
                id: id
            }
        });
    }


    /**
     * Sets the console log level in the worker.
     *
     * @param {string} level
     */
    setLogLevel(level) {
        if (!this.chefWorker) return;

        this.chefWorker.postMessage({
            action: "setLogLevel",
            data: log.getLevel()
        });
    }

}


export default WorkerWaiter;
