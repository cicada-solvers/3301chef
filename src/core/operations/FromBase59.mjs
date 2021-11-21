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
 * From Base 59 operation
 */
class FromBase59 extends Operation {

    /**
     * FromBase59 constructor
     */
    constructor() {
        super();

        this.name = "From Base 59";
        this.module = "Cicada";
        this.description = "Convert Base 59 to byte array. Not restricted to 59, will override if longer but not shorter.";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "byteArray";
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
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
     /**
      * @param {string} input
      * @param {Object[]} args
      * @returns {byteArray}
      */
     run(input, args) {
         if (input.length < 1) return [];
         const alphabet = Utils.expandAlphRange(args[0]).join("");// returns ["0", "1", "2", ...etc ]
         if(alphabet.length >= 59){
           const BN59 = BigNumber.clone({ ALPHABET: alphabet });

           // Base 59:
          // e.g.   2M -> starts with 0123456, going up to 4 in first position ('tens')
          //        2M -> 0123456789[...M...][....m....]  -> position (0-58) of M is the 'ones' place 
          //        2M -> 4*59 + (10 : count thru all numbers 0-9) + (M's position : 13TH LETTER) = 
          //               4*59 + 10 +  13 = 
          //                259  
          //                259 cannot be directly converted to hex -> !0-255 
          //               1 0000 0011 = 259 = 1 03 hex
          //                1111 1111 = 255 = FF hex 
           const re = new RegExp("[^" + alphabet.replace(/[[\]\\\-^$]/g, "\\$&") + "]", "g");
           input = input.replace(re, "");

           // Read number in using Base59+ alphabet
           const number = new BN59(input, alphabet.length);
           // Copy to new BigNumber object that uses the default alphabet
           const normalized = new BigNumber(number);

           // Convert to hex and add leading 0 if required
           let hex = normalized.toString(16);
           if (hex.length % 2 !== 0) hex = "0" + hex;

           let resultByteArray = Utils.convertToByteArray(hex, "Hex");
           let utfresult = Utils.byteArrayToUtf8(resultByteArray);
           console.log(utfresult);
           return resultByteArray;
         }
         else{
           return "Alphabet must have greater than or equal to 59 characters."
         }
     }

}

export default FromBase59;
