/**
 * @author onecool []
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import LiberPrimus from "../lib/LiberPrimus.mjs";
import {LP_INPUT_FORMAT, LP_SPACE_DELIMITER, LP_OUTSPACE_DELIMITER, LP_OUTPUT_FORMAT, LP_OPERATION} from "../lib/LiberPrimus.mjs";
/**
 * LP Apply Key operation 
 */
class LPApplyKey extends Operation {

    /**
     * LPApplyKey constructor
     */
    constructor() {
        super();

        this.name = "LP Apply Key";
        this.module = "Cicada";
        this.description = "Takes input string (English, Index, Runic), key string (English, Index, Runic), and applies character-by-character add/subtract operations. For example <code> FUTH - FUTH = (0 1 2) - (0 1 2) = (0 0 0) = FFF</code>";
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
              name:"Input Space Delimiter",                                                                                                                                                                     
              type:"option",                                                                                                                                                                               
              value: LP_SPACE_DELIMITER                     
          },                                                                                                                                                                                               
          {                                                                                                                                                                                                
              name: "Output Format",                                                                                                                                                                       
              type: "populateOption",                                                                                                               
              value: LP_OUTPUT_FORMAT,
              target: 3
          },                                                                                                                                                                                               
          {                                                                                                                                                                                                
              name:"Output Space Delimiter",                                                                                                                                                                      
              type:"option",                                                                                                                                                                               
              value: LP_SPACE_DELIMITER                                      
          },                                                                                                                                                                                               
          {                                                                                                                                                                                                
              name: "Decrypt Operation",                                                                                                                                                                           
              type: "option",                                                                                                                                                                              
              value: LP_OPERATION
          },                                                                                                                                                                                               
          {                                                                                                                                                                                                
              name: "Key",                                                                                                                                                                                 
              type: "toggleString",                                                                                                                                                                        
              value: ""           ,
              toggleValues: ["rune", "index", "letter"]                                                                                                                                                                        
          }                 
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;
        return LiberPrimus.runApplyKey(input, args);
    }

    /**
     * Highlight LP Apply Key
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
     * Highlight LP Apply Key in reverse
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

export default LPApplyKey;
