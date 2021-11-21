/**
 * @author onecool [hmu]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import LiberPrimus from "../lib/LiberPrimus.mjs";
import {LP_INPUT_FORMAT, LP_SPACE_DELIMITER,LP_OUTSPACE_DELIMITER, LP_OUTPUT_FORMAT,LP_OPERATION} from "../lib/LiberPrimus.mjs";

/**
 * Text Transliteration operation
 */
class TextTransliteration extends Operation {

    /**
     * TextTransliteration constructor
     */ 
    constructor() {
        super();

        this.name = "Text Transliteration";
        this.module = "Cicada";
        this.description = "Converts text between different representations. For example, <code>Index : 0 1 2</code> becomes <code>English: F U TH</code>. It supports Runic UTF-8, English, Index.";
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
              value: LP_SPACE_DELIMITER,            
              target: 2                                                                                                                                            
          },                                                                                                                                                                                               
          {                                                                                                                                                                                                
              name: "Output Format",                                                                                                                                                                       
              type: "populateOption", // the argument data type, see the next section for valid types                                                                                                              
              value: LP_OUTPUT_FORMAT, // the default value of the argument      
              target: 3                                                                                           
          },                                                                                                                                                                                               
          {                                                                                                                                                                                                
              name:"Output Space Type",                                                                                                                                                                      
              type:"option",                                                                                                                                                                               
              value: LP_SPACE_DELIMITER,                                     
              target: 4                                                                                                                   
          },
          {
              name: "Remove Line Breaks (\\n)",
              type: "boolean",
              value: true
          },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = a
        return LiberPrimus.runLPConvert(input, args);
    }

    /**
     * Highlight Text Transliteration
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
     * Highlight Text Transliteration in reverse
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

export default TextTransliteration;
