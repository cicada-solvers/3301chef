/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation";
import Utils from "../Utils";
import {HASH_DELIM_OPTIONS} from "../lib/Delim";
import ctphjs from "ctph.js";
import OperationError from "../errors/OperationError";

/**
 * Compare CTPH hashes operation
 */
class CompareCTPHHashes extends Operation {

    /**
     * CompareCTPHHashes constructor
     */
    constructor() {
        super();

        this.name = "Compare CTPH hashes";
        this.module = "Hashing";
        this.description = "Compares two Context Triggered Piecewise Hashing (CTPH) fuzzy hashes to determine the similarity between them on a scale of 0 to 100.";
        this.infoURL = "https://forensicswiki.org/wiki/Context_Triggered_Piecewise_Hashing";
        this.inputType = "string";
        this.outputType = "Number";
        this.args = [
            {
                "name": "Delimiter",
                "type": "option",
                "value": HASH_DELIM_OPTIONS
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {Number}
     */
    run(input, args) {
        const samples = input.split(Utils.charRep(args[0]));
        if (samples.length !== 2) throw new OperationError("Incorrect number of samples.");
        return ctphjs.similarity(samples[0], samples[1]);
    }

}

export default CompareCTPHHashes;
