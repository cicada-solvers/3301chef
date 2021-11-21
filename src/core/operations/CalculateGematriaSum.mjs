/**
 * @author onecool []
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import LiberPrimus from "../lib/LiberPrimus.mjs";
import {LP_INPUT_FORMAT, LP_SPACE_DELIMITER, LP_OUTPUT_FORMAT,LP_OPERATION} from "../lib/LiberPrimus.mjs";

/**
 * Calculate Gematria Sum operation 
 */
class CalculateGematriaSum extends Operation {

    /**
     * CalculateGematriaSum constructor
     */
    constructor() {
        super();

        this.name = "Calculate Gematria Sum";
        this.module = "Cicada";
        this.description = "Converts English text to Gematria Sum using the prime number value associated with the English letter(s). For example <code>FUTH = (2 + 3 + 5) = 10</code>.";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
          {                                                                                                                                                                             
              name: "Input Format",                                                                                                                                                                        
              type: "populateOption", // the argument data type, see the next section for valid types                                                                                                              
              value: LP_INPUT_FORMAT, // the default value of the argument  
              target: 1                                                                                                                   
          },                                                                                                                                                                                               
          {                                                                                                                                                                                                
              name:"Input Space Type",                                                                                                                                                                     
              type:"option",                                                                                                                                                                               
              value: LP_SPACE_DELIMITER                                                                                                                                                        
          },   
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;
        return LiberPrimus.gematriaSum(input, args);
    }

    /**
     * Highlight Calculate Gematria Sum
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlight(pos, args) {
        return pos;
    }

    /**
     * Highlight Calculate Gematria Sum in reverse
     *
     * @param {Object[]} pos
     * @param {number} pos[].start
     * @param {number} pos[].end
     * @param {Object[]} args
     * @returns {Object[]} pos
     */
    highlightReverse(pos, args) {
        return pos;
    }

}

export default CalculateGematriaSum;
