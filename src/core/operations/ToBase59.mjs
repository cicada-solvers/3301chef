/**
 * @author onecool [realonecool@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import BigNumber from "bignumber.js";
import Utils from "../Utils.mjs";
import {toHexFast} from "../lib/Hex.mjs";
/**
 * To Base 59 operation
 */
class ToBase59 extends Operation {

    /**
     * ToBase59 constructor
     */
    constructor() {
        super();

        this.name = "To Base 59";
        this.module = "Cicada";
        this.description = "Convert string to base 59";
        this.infoURL = "";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [
          {
            //Base 59 missing fyz 
              name: "Alphabet",
              type: "string",
              value: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdeghijklmnopqrstuvwx"
          }
        ];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;

        input = new Uint8Array(input);
        if (input.length < 1) return "";

        const alphabet = Utils.expandAlphRange(args[0]).join("");
        const BN59 = BigNumber.clone({ ALPHABET: alphabet });

        input = toHexFast(input).toUpperCase();

        // Read number in as hex using normal alphabet
        const normalized = new BigNumber(input, 16);
        // Copy to BigNumber clone that uses the specified Base62 alphabet
        const number = new BN59(normalized);

        return number.toString(59);    }

}

export default ToBase59;
