/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 */

import Operation from "../Operation";
import Utils from "../Utils";
import OperationError from "../errors/OperationError";
import { Blowfish } from "../vendor/Blowfish";
import { toBase64 } from "../lib/Base64";

/**
 * Lookup table for Blowfish output types.
 */
const BLOWFISH_OUTPUT_TYPE_LOOKUP = {
    Base64: 0, Hex: 1, String: 2, Raw: 3
};

/**
 * Lookup table for Blowfish modes.
 */
const BLOWFISH_MODE_LOOKUP = {
    ECB: 0, CBC: 1, PCBC: 2, CFB: 3, OFB: 4, CTR: 5
};


/**
 * Blowfish Encrypt operation
 */
class BlowfishEncrypt extends Operation {

    /**
     * BlowfishEncrypt constructor
     */
    constructor() {
        super();

        this.name = "Blowfish Encrypt";
        this.module = "Ciphers";
        this.description = "Blowfish is a symmetric-key block cipher designed in 1993 by Bruce Schneier and included in a large number of cipher suites and encryption products. AES now receives more attention.<br><br><b>IV:</b> The Initialization Vector should be 8 bytes long. If not entered, it will default to 8 null bytes.";
        this.infoURL = "https://wikipedia.org/wiki/Blowfish_(cipher)";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Key",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "IV",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Mode",
                "type": "option",
                "value": ["CBC", "PCBC", "CFB", "OFB", "CTR", "ECB"]
            },
            {
                "name": "Input",
                "type": "option",
                "value": ["Raw", "Hex"]
            },
            {
                "name": "Output",
                "type": "option",
                "value": ["Hex", "Base64", "Raw"]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option),
            iv = Utils.convertToByteArray(args[1].string, args[1].option),
            [,, mode, inputType, outputType] = args;

        if (key.length === 0) throw new OperationError("Enter a key");

        input = Utils.convertToByteString(input, inputType);

        Blowfish.setIV(toBase64(iv), 0);

        const enc = Blowfish.encrypt(input, key, {
            outputType: BLOWFISH_OUTPUT_TYPE_LOOKUP[outputType],
            cipherMode: BLOWFISH_MODE_LOOKUP[mode]
        });

        return outputType === "Raw" ? Utils.byteArrayToChars(enc) : enc;
    }

}

export default BlowfishEncrypt;
