/**
 * @author tlwr [toby@toby.codes]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */

import Operation from "../Operation";
import Utils from "../Utils";
import OperationError from "../errors/OperationError";
import {ALPHABET_OPTIONS} from "../lib/Base58";

/**
 * From Base58 operation
 */
class FromBase58 extends Operation {

    /**
     * FromBase58 constructor
     */
    constructor() {
        super();

        this.name = "From Base58";
        this.module = "Default";
        this.description = "Base58 (similar to Base64) is a notation for encoding arbitrary byte data. It differs from Base64 by removing easily misread characters (i.e. l, I, 0 and O) to improve human readability.<br><br>This operation decodes data from an ASCII string (with an alphabet of your choosing, presets included) back into its raw form.<br><br>e.g. <code>StV1DL6CwTryKyV</code> becomes <code>hello world</code><br><br>Base58 is commonly used in cryptocurrencies (Bitcoin, Ripple, etc).";
        this.infoURL = "https://wikipedia.org/wiki/Base58";
        this.inputType = "string";
        this.outputType = "byteArray";
        this.args = [
            {
                "name": "Alphabet",
                "type": "editableOption",
                "value": ALPHABET_OPTIONS
            },
            {
                "name": "Remove non-alphabet chars",
                "type": "boolean",
                "value": true
            }
        ];
        this.patterns = [
            {
                match: "^[1-9A-HJ-NP-Za-km-z]{20,}$",
                flags: "",
                args: ["123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", false]
            },
            {
                match: "^[1-9A-HJ-NP-Za-km-z]{20,}$",
                flags: "",
                args: ["rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz", false]
            },
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {byteArray}
     */
    run(input, args) {
        let alphabet = args[0] || ALPHABET_OPTIONS[0].value;
        const removeNonAlphaChars = args[1] === undefined ? true : args[1],
            result = [0];

        alphabet = Utils.expandAlphRange(alphabet).join("");

        if (alphabet.length !== 58 ||
            [].unique.call(alphabet).length !== 58) {
            throw new OperationError("Alphabet must be of length 58");
        }

        if (input.length === 0) return [];

        [].forEach.call(input, function(c, charIndex) {
            const index = alphabet.indexOf(c);

            if (index === -1) {
                if (removeNonAlphaChars) {
                    return;
                } else {
                    throw new OperationError(`Char '${c}' at position ${charIndex} not in alphabet`);
                }
            }

            let carry = result[0] * 58 + index;
            result[0] = carry & 0xFF;
            carry = carry >> 8;

            for (let i = 1; i < result.length; i++) {
                carry += result[i] * 58;
                result[i] = carry & 0xFF;
                carry = carry >> 8;
            }

            while (carry > 0) {
                result.push(carry & 0xFF);
                carry = carry >> 8;
            }
        });

        return result.reverse();
    }

}

export default FromBase58;
