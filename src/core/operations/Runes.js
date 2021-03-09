const Runes = {

    /**
     * @constant
     * @default
     */
    OUTPUT_FORMAT: ["Gematria", "UTF-8", "UTF-16"],
    OUTPUT_DELIMITER: ", ",
    LINEBREAK_DELIMITER: "",
    RUNES_ONLY: true,

    runRunes: function(input, args) {
        // 
        /**
 * UTF-8 Function
 * @param {string} String to UTF-8
 * @returns {array} UTF-8'd string
 */
        function toUTF8Array(str) {
            let utf8 = [];
            for (let i = 0; i < str.length; i++) {
                let charcode = str.charCodeAt(i);
                if (charcode < 0x80) utf8.push(charcode);
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6),
                        0x80 | (charcode & 0x3f));
                } else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12),
                        0x80 | ((charcode >> 6) & 0x3f),
                        0x80 | (charcode & 0x3f));
                } else {
                    i++;
                    // UTF-16 encodes 0x10000-0x10FFFF by
                    // subtracting 0x10000 and splitting the
                    // 20 bits of 0x0-0xFFFFF into two halves
                    charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                    utf8.push(0xf0 | (charcode >> 18),
                        0x80 | ((charcode >> 12) & 0x3f),
                        0x80 | ((charcode >> 6) & 0x3f),
                        0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        }

        // Gematria Mapping

        let gematria = new Array;
        gematria["ᚩ"] = 0;
        gematria["ᚢ"] = 1;
        gematria["ᚦ"] = 2;
        gematria["ᚩ"] = 3;
        gematria["ᚱ"] = 4;
        gematria["ᚳ"] = 5;
        gematria["ᚷ"] = 6;
        gematria["ᚹ"] = 7;
        gematria["ᚻ"] = 8;
        gematria["ᚾ"] = 9;
        gematria["ᛁ"] = 10;
        gematria["ᛄ"] = 11;
        gematria["ᛇ"] = 12;
        gematria["ᛈ"] = 13;
        gematria["ᛠ"] = 14;
        gematria["ᛋ"] = 15;
        gematria["ᛏ"] = 16;
        gematria["ᛒ"] = 17;
        gematria["ᛖ"] = 18;
        gematria["ᛚ"] = 19;
        gematria["ᛝ"] = 20;
        gematria["ᛟ"] = 21;
        gematria["ᛞ"] = 22;
        gematria["ᚨ"] = 23;
        gematria["ᚣ"] = 24;
        gematria["ᛡ"] = 25;
        gematria["ᛠ"] = 26;


        let output = args[0]; // Output Format Option
        let delimiter = args[1]; // Output Delimiter Option
        let linebreak = args[2];
        let runesonly = args[3];
        let result = "";


        if (output === "Gematria") {
            for (let i = 0, len = input.length; i < len; i++) {
                if (gematria[input[i]] !== undefined) {
                    result += gematria[input[i]] + delimiter;
                } else if (input[i] === linebreak) {
                    result += "\n";
                }
            }
        } else if (output === "UTF-8") {
            let buffer;
            for (let i = 0, len = input.length; i < len; i++) {
                if (gematria[input[i]] !== undefined) {
                    buffer += input[i];
                } else if (input[i] === linebreak) {
                    result += "\n";
                } else if (!runesonly) {
                    buffer += input[i];
                }
            }
            result = toUTF8Array(buffer).join(delimiter);
        } else if (output === "UTF-16") {
            for (let i = 0, len = input.length; i < len; i++) {
                if (gematria[input[i]] !== undefined) {
                    result += input.charCodeAt(i) + delimiter;
                } else if (input[i] === linebreak) {
                    result += "\n";
                } else if (!runesonly) {
                    result += input.charCodeAt(i) + delimiter;
                }
            }
        }
        return result;
    },
};

export default Runes;
