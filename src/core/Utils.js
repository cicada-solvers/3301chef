import CryptoJS from "crypto-js";


/**
 * Utility functions for use in operations, the core framework and the stage.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 *
 * @namespace
 */
const Utils = {

    /**
     * Translates an ordinal into a character.
     *
     * @param {number} o
     * @returns {char}
     *
     * @example
     * // returns 'a'
     * Utils.chr(97);
     */
    chr: function(o) {
        // Detect astral symbols
        // Thanks to @mathiasbynens for this solution
        // https://mathiasbynens.be/notes/javascript-unicode
        if (o > 0xffff) {
            o -= 0x10000;
            const high = String.fromCharCode(o >>> 10 & 0x3ff | 0xd800);
            o = 0xdc00 | o & 0x3ff;
            return high + String.fromCharCode(o);
        }

        return String.fromCharCode(o);
    },


    /**
     * Translates a character into an ordinal.
     *
     * @param {char} c
     * @returns {number}
     *
     * @example
     * // returns 97
     * Utils.ord('a');
     */
    ord: function(c) {
        // Detect astral symbols
        // Thanks to @mathiasbynens for this solution
        // https://mathiasbynens.be/notes/javascript-unicode
        if (c.length === 2) {
            const high = c.charCodeAt(0);
            const low = c.charCodeAt(1);
            if (high >= 0xd800 && high < 0xdc00 &&
                low >= 0xdc00 && low < 0xe000) {
                return (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
            }
        }

        return c.charCodeAt(0);
    },


    /**
     * Adds leading zeros to strings
     *
     * @param {string} str - String to add leading characters to.
     * @param {number} max - Maximum width of the string.
     * @param {char} [chr='0'] - The character to pad with.
     * @returns {string}
     *
     * @example
     * // returns "0a"
     * Utils.padLeft("a", 2);
     *
     * // returns "000a"
     * Utils.padLeft("a", 4);
     *
     * // returns "xxxa"
     * Utils.padLeft("a", 4, "x");
     *
     * // returns "bcabchello"
     * Utils.padLeft("hello", 10, "abc");
     */
    padLeft: function(str, max, chr) {
        chr = chr || "0";
        let startIndex = chr.length - (max - str.length);
        startIndex = startIndex < 0 ? 0 : startIndex;
        return str.length < max ?
            Utils.padLeft(chr.slice(startIndex, chr.length) + str, max, chr) : str;
    },


    /**
     * Adds trailing spaces to strings.
     *
     * @param {string} str - String to add trailing characters to.
     * @param {number} max - Maximum width of the string.
     * @param {char} [chr='0'] - The character to pad with.
     * @returns {string}
     *
     * @example
     * // returns "a   "
     * Utils.padRight("a", 4);
     *
     * // returns "axxx"
     * Utils.padRight("a", 4, "x");
     */
    padRight: function(str, max, chr) {
        chr = chr || " ";
        return str.length < max ?
            Utils.padRight(str + chr.slice(0, max-str.length), max, chr) : str;
    },


    /**
     * Adds trailing bytes to a byteArray.
     *
     * @author tlwr [toby@toby.codes]
     *
     * @param {byteArray} arr - byteArray to add trailing bytes to.
     * @param {number} numBytes - Maximum width of the array.
     * @param {Integer} [padByte=0] - The byte to pad with.
     * @returns {byteArray}
     *
     * @example
     * // returns ["a", 0, 0, 0]
     * Utils.padBytesRight("a", 4);
     *
     * // returns ["a", 1, 1, 1]
     * Utils.padBytesRight("a", 4, 1);
     *
     * // returns ["t", "e", "s", "t", 0, 0, 0, 0]
     * Utils.padBytesRight("test", 8);
     *
     * // returns ["t", "e", "s", "t", 1, 1, 1, 1]
     * Utils.padBytesRight("test", 8, 1);
     */
    padBytesRight: function(arr, numBytes, padByte) {
        padByte = padByte || 0;
        const paddedBytes = new Array(numBytes);
        paddedBytes.fill(padByte);

        Array.prototype.map.call(arr, function(b, i) {
            paddedBytes[i] = b;
        });

        return paddedBytes;
    },


    /**
     * @alias Utils.padLeft
     */
    pad: function(str, max, chr) {
        return Utils.padLeft(str, max, chr);
    },


    /**
     * Truncates a long string to max length and adds suffix.
     *
     * @param {string} str - String to truncate
     * @param {number} max - Maximum length of the final string
     * @param {string} [suffix='...'] - The string to add to the end of the final string
     * @returns {string}
     *
     * @example
     * // returns "A long..."
     * Utils.truncate("A long string", 9);
     *
     * // returns "A long s-"
     * Utils.truncate("A long string", 9, "-");
     */
    truncate: function(str, max, suffix) {
        suffix = suffix || "...";
        if (str.length > max) {
            str = str.slice(0, max - suffix.length) + suffix;
        }
        return str;
    },


    /**
     * Converts a character or number to its hex representation.
     *
     * @param {char|number} c
     * @param {number} [length=2] - The width of the resulting hex number.
     * @returns {string}
     *
     * @example
     * // returns "6e"
     * Utils.hex("n");
     *
     * // returns "6e"
     * Utils.hex(110);
     */
    hex: function(c, length) {
        c = typeof c == "string" ? Utils.ord(c) : c;
        length = length || 2;
        return Utils.pad(c.toString(16), length);
    },


    /**
     * Converts a character or number to its binary representation.
     *
     * @param {char|number} c
     * @param {number} [length=8] - The width of the resulting binary number.
     * @returns {string}
     *
     * @example
     * // returns "01101110"
     * Utils.bin("n");
     *
     * // returns "01101110"
     * Utils.bin(110);
     */
    bin: function(c, length) {
        c = typeof c == "string" ? Utils.ord(c) : c;
        length = length || 8;
        return Utils.pad(c.toString(2), length);
    },


    /**
     * Returns a string with all non-printable chars as dots, optionally preserving whitespace.
     *
     * @param {string} str - The input string to display.
     * @param {boolean} [preserveWs=false] - Whether or not to print whitespace.
     * @returns {string}
     */
    printable: function(str, preserveWs) {
        if (typeof window !== "undefined" && window.app && !window.app.options.treatAsUtf8) {
            str = Utils.byteArrayToChars(Utils.strToByteArray(str));
        }

        const re = /[\0-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
        const wsRe = /[\x09-\x10\x0D\u2028\u2029]/g;

        str = str.replace(re, ".");
        if (!preserveWs) str = str.replace(wsRe, ".");
        return str;
    },


    /**
     * Parse a string entered by a user and replace escaped chars with the bytes they represent.
     *
     * @param {string} str
     * @returns {string}
     *
     * @example
     * // returns "\x00"
     * Utils.parseEscapedChars("\\x00");
     *
     * // returns "\n"
     * Utils.parseEscapedChars("\\n");
     */
    parseEscapedChars: function(str) {
        return str.replace(/(\\)?\\([nrtbf]|x[\da-f]{2})/g, function(m, a, b) {
            if (a === "\\") return "\\"+b;
            switch (b[0]) {
                case "n":
                    return "\n";
                case "r":
                    return "\r";
                case "t":
                    return "\t";
                case "b":
                    return "\b";
                case "f":
                    return "\f";
                case "x":
                    return Utils.chr(parseInt(b.substr(1), 16));
            }
        });
    },


    /**
     * Escape a string containing regex control characters so that it can be safely
     * used in a regex without causing unintended behaviours.
     *
     * @param {string} str
     * @returns {string}
     *
     * @example
     * // returns "\[example\]"
     * Utils.escapeRegex("[example]");
     */
    escapeRegex: function(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },


    /**
     * Expand an alphabet range string into a list of the characters in that range.
     *
     * @param {string} alphStr
     * @returns {char[]}
     *
     * @example
     * // returns ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
     * Utils.expandAlphRange("0-9");
     *
     * // returns ["a", "b", "c", "d", "0", "1", "2", "3", "+", "/"]
     * Utils.expandAlphRange("a-d0-3+/");
     *
     * // returns ["a", "b", "c", "d", "0", "-", "3"]
     * Utils.expandAlphRange("a-d0\\-3")
     */
    expandAlphRange: function(alphStr) {
        const alphArr = [];

        for (let i = 0; i < alphStr.length; i++) {
            if (i < alphStr.length - 2 &&
                alphStr[i+1] === "-" &&
                alphStr[i] !== "\\") {
                let start = Utils.ord(alphStr[i]),
                    end = Utils.ord(alphStr[i+2]);

                for (let j = start; j <= end; j++) {
                    alphArr.push(Utils.chr(j));
                }
                i += 2;
            } else if (i < alphStr.length - 2 &&
                alphStr[i] === "\\" &&
                alphStr[i+1] === "-") {
                alphArr.push("-");
                i++;
            } else {
                alphArr.push(alphStr[i]);
            }
        }
        return alphArr;
    },


    /**
     * Converts a string to a byte array.
     * Treats the string as UTF-8 if any values are over 255.
     *
     * @param {string} str
     * @returns {byteArray}
     *
     * @example
     * // returns [72,101,108,108,111]
     * Utils.strToByteArray("Hello");
     *
     * // returns [228,189,160,229,165,189]
     * Utils.strToByteArray("你好");
     */
    strToByteArray: function(str) {
        const byteArray = new Array(str.length);
        let i = str.length, b;
        while (i--) {
            b = str.charCodeAt(i);
            byteArray[i] = b;
            // If any of the bytes are over 255, read as UTF-8
            if (b > 255) return Utils.strToUtf8ByteArray(str);
        }
        return byteArray;
    },


    /**
     * Converts a string to a UTF-8 byte array.
     *
     * @param {string} str
     * @returns {byteArray}
     *
     * @example
     * // returns [72,101,108,108,111]
     * Utils.strToUtf8ByteArray("Hello");
     *
     * // returns [228,189,160,229,165,189]
     * Utils.strToUtf8ByteArray("你好");
     */
    strToUtf8ByteArray: function(str) {
        let wordArray = CryptoJS.enc.Utf8.parse(str),
            byteArray = Utils.wordArrayToByteArray(wordArray);

        if (typeof window !== "undefined" && str.length !== wordArray.sigBytes) {
            window.app.options.attemptHighlight = false;
        }
        return byteArray;
    },


    /**
     * Converts a string to a unicode charcode array
     *
     * @param {string} str
     * @returns {byteArray}
     *
     * @example
     * // returns [72,101,108,108,111]
     * Utils.strToCharcode("Hello");
     *
     * // returns [20320,22909]
     * Utils.strToCharcode("你好");
     */
    strToCharcode: function(str) {
        const charcode = new Array();

        for (let i = 0; i < str.length; i++) {
            let ord = str.charCodeAt(i);

            // Detect and merge astral symbols
            if (i < str.length - 1 && ord >= 0xd800 && ord < 0xdc00) {
                const low = str[i + 1].charCodeAt(0);
                if (low >= 0xdc00 && low < 0xe000) {
                    ord = Utils.ord(str[i] + str[++i]);
                }
            }

            charcode.push(ord);
        }

        return charcode;
    },


    /**
     * Attempts to convert a byte array to a UTF-8 string.
     *
     * @param {byteArray} byteArray
     * @returns {string}
     *
     * @example
     * // returns "Hello"
     * Utils.byteArrayToUtf8([72,101,108,108,111]);
     *
     * // returns "你好"
     * Utils.byteArrayToUtf8([228,189,160,229,165,189]);
     */
    byteArrayToUtf8: function(byteArray) {
        try {
            // Try to output data as UTF-8 string
            const words = [];
            for (let i = 0; i < byteArray.length; i++) {
                words[i >>> 2] |= byteArray[i] << (24 - (i % 4) * 8);
            }
            let wordArray = new CryptoJS.lib.WordArray.init(words, byteArray.length),
                str = CryptoJS.enc.Utf8.stringify(wordArray);

            if (typeof window !== "undefined" && str.length !== wordArray.sigBytes)
                window.app.options.attemptHighlight = false;
            return str;
        } catch (err) {
            // If it fails, treat it as ANSI
            return Utils.byteArrayToChars(byteArray);
        }
    },


    /**
     * Converts a charcode array to a string.
     *
     * @param {byteArray} byteArray
     * @returns {string}
     *
     * @example
     * // returns "Hello"
     * Utils.byteArrayToChars([72,101,108,108,111]);
     *
     * // returns "你好"
     * Utils.byteArrayToChars([20320,22909]);
     */
    byteArrayToChars: function(byteArray) {
        if (!byteArray) return "";
        let str = "";
        for (let i = 0; i < byteArray.length;) {
            str += String.fromCharCode(byteArray[i++]);
        }
        return str;
    },


    /**
     * Converts a CryptoJS.lib.WordArray to a byteArray.
     *
     * @param {CryptoJS.lib.WordArray} wordArray
     * @returns {byteArray}
     *
     * @example
     * // returns [84, 101, 115, 116]
     * Utils.wordArrayToByteArray(CryptoJS.enc.Hex.parse("54657374"));
     */
    wordArrayToByteArray: function(wordArray) {
        if (wordArray.sigBytes <= 0) return [];

        let words = wordArray.words,
            byteArray = [];

        for (let i = 0; i < wordArray.sigBytes; i++) {
            byteArray.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
        }

        return byteArray;
    },


    /**
     * Base64's the input byte array using the given alphabet, returning a string.
     *
     * @param {byteArray|string} data
     * @param {string} [alphabet]
     * @returns {string}
     *
     * @example
     * // returns "SGVsbG8="
     * Utils.toBase64([72, 101, 108, 108, 111]);
     *
     * // returns "SGVsbG8="
     * Utils.toBase64("Hello");
     */
    toBase64: function(data, alphabet) {
        if (!data) return "";
        if (typeof data == "string") {
            data = Utils.strToByteArray(data);
        }

        alphabet = alphabet ?
            Utils.expandAlphRange(alphabet).join("") :
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        let output = "",
            chr1, chr2, chr3,
            enc1, enc2, enc3, enc4,
            i = 0;

        while (i < data.length) {
            chr1 = data[i++];
            chr2 = data[i++];
            chr3 = data[i++];

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += alphabet.charAt(enc1) + alphabet.charAt(enc2) +
                alphabet.charAt(enc3) + alphabet.charAt(enc4);
        }

        return output;
    },


    /**
     * UnBase64's the input string using the given alphabet, returning a byte array.
     *
     * @param {byteArray} data
     * @param {string} [alphabet]
     * @param {string} [returnType="string"] - Either "string" or "byteArray"
     * @param {boolean} [removeNonAlphChars=true]
     * @returns {byteArray}
     *
     * @example
     * // returns "Hello"
     * Utils.fromBase64("SGVsbG8=");
     *
     * // returns [72, 101, 108, 108, 111]
     * Utils.fromBase64("SGVsbG8=", null, "byteArray");
     */
    fromBase64: function(data, alphabet, returnType, removeNonAlphChars) {
        returnType = returnType || "string";

        if (!data) {
            return returnType === "string" ? "" : [];
        }

        alphabet = alphabet ?
            Utils.expandAlphRange(alphabet).join("") :
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        if (removeNonAlphChars === undefined)
            removeNonAlphChars = true;

        let output = [],
            chr1, chr2, chr3,
            enc1, enc2, enc3, enc4,
            i = 0;

        if (removeNonAlphChars) {
            const re = new RegExp("[^" + alphabet.replace(/[\[\]\\\-^$]/g, "\\$&") + "]", "g");
            data = data.replace(re, "");
        }

        while (i < data.length) {
            enc1 = alphabet.indexOf(data.charAt(i++));
            enc2 = alphabet.indexOf(data.charAt(i++) || "=");
            enc3 = alphabet.indexOf(data.charAt(i++) || "=");
            enc4 = alphabet.indexOf(data.charAt(i++) || "=");

            enc2 = enc2 === -1 ? 64 : enc2;
            enc3 = enc3 === -1 ? 64 : enc3;
            enc4 = enc4 === -1 ? 64 : enc4;

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output.push(chr1);

            if (enc3 !== 64) {
                output.push(chr2);
            }
            if (enc4 !== 64) {
                output.push(chr3);
            }
        }

        return returnType === "string" ? Utils.byteArrayToUtf8(output) : output;
    },


    /**
     * Convert a byte array into a hex string.
     *
     * @param {byteArray} data
     * @param {string} [delim=" "]
     * @param {number} [padding=2]
     * @returns {string}
     *
     * @example
     * // returns "0a 14 1e"
     * Utils.toHex([10,20,30]);
     *
     * // returns "0a:14:1e"
     * Utils.toHex([10,20,30], ":");
     */
    toHex: function(data, delim, padding) {
        if (!data) return "";

        delim = typeof delim == "string" ? delim : " ";
        padding = padding || 2;
        let output = "";

        for (let i = 0; i < data.length; i++) {
            output += Utils.pad(data[i].toString(16), padding) + delim;
        }

        // Add \x or 0x to beginning
        if (delim === "0x") output = "0x" + output;
        if (delim === "\\x") output = "\\x" + output;

        if (delim.length)
            return output.slice(0, -delim.length);
        else
            return output;
    },


    /**
     * Convert a byte array into a hex string as efficiently as possible with no options.
     *
     * @param {byteArray} data
     * @returns {string}
     *
     * @example
     * // returns "0a141e"
     * Utils.toHex([10,20,30]);
     */
    toHexFast: function(data) {
        if (!data) return "";

        const output = [];

        for (let i = 0; i < data.length; i++) {
            output.push((data[i] >>> 4).toString(16));
            output.push((data[i] & 0x0f).toString(16));
        }

        return output.join("");
    },


    /**
     * Convert a hex string into a byte array.
     *
     * @param {string} data
     * @param {string} [delim]
     * @param {number} [byteLen=2]
     * @returns {byteArray}
     *
     * @example
     * // returns [10,20,30]
     * Utils.fromHex("0a 14 1e");
     *
     * // returns [10,20,30]
     * Utils.fromHex("0a:14:1e", "Colon");
     */
    fromHex: function(data, delim, byteLen) {
        delim = delim || (data.indexOf(" ") >= 0 ? "Space" : "None");
        byteLen = byteLen || 2;
        if (delim !== "None") {
            const delimRegex = Utils.regexRep[delim];
            data = data.replace(delimRegex, "");
        }

        const output = [];
        for (let i = 0; i < data.length; i += byteLen) {
            output.push(parseInt(data.substr(i, byteLen), 16));
        }
        return output;
    },


    /**
     * Parses CSV data and returns it as a two dimensional array or strings.
     *
     * @param {string} data
     * @returns {string[][]}
     *
     * @example
     * // returns [["head1", "head2"], ["data1", "data2"]]
     * Utils.parseCSV("head1,head2\ndata1,data2");
     */
    parseCSV: function(data) {

        let b,
            ignoreNext = false,
            inString = false,
            cell = "",
            line = [],
            lines = [];

        for (let i = 0; i < data.length; i++) {
            b = data[i];
            if (ignoreNext) {
                cell += b;
                ignoreNext = false;
            } else if (b === "\\") {
                cell += b;
                ignoreNext = true;
            } else if (b === "\"" && !inString) {
                inString = true;
            } else if (b === "\"" && inString) {
                inString = false;
            } else if (b === "," && !inString) {
                line.push(cell);
                cell = "";
            } else if ((b === "\n" || b === "\r") && !inString) {
                line.push(cell);
                cell = "";
                lines.push(line);
                line = [];
            } else {
                cell += b;
            }
        }

        if (line.length) {
            line.push(cell);
            lines.push(line);
        }

        return lines;
    },


    /**
     * Removes all HTML (or XML) tags from the input string.
     *
     * @param {string} htmlStr
     * @param {boolean} removeScriptAndStyle - Flag to specify whether to remove entire script or style blocks
     * @returns {string}
     *
     * @example
     * // returns "Test"
     * Utils.stripHtmlTags("<div>Test</div>");
     */
    stripHtmlTags: function(htmlStr, removeScriptAndStyle) {
        if (removeScriptAndStyle) {
            htmlStr = htmlStr.replace(/<(script|style)[^>]*>.*<\/(script|style)>/gmi, "");
        }
        return htmlStr.replace(/<[^>]+>/g, "");
    },


    /**
     * Escapes HTML tags in a string to stop them being rendered.
     * https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
     *
     * @param {string} str
     * @returns string
     *
     * @example
     * // return "A &lt;script&gt; tag"
     * Utils.escapeHtml("A <script> tag");
     */
    escapeHtml: function(str) {
        const HTML_CHARS = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;", // &apos; not recommended because it's not in the HTML spec
            "/": "&#x2F;", // forward slash is included as it helps end an HTML entity
            "`": "&#x60;"
        };

        return str.replace(/[&<>"'\/`]/g, function (match) {
            return HTML_CHARS[match];
        });
    },


    /**
     * Unescapes HTML tags in a string to make them render again.
     *
     * @param {string} str
     * @returns string
     *
     * @example
     * // return "A <script> tag"
     * Utils.unescapeHtml("A &lt;script&gt; tag");
     */
    unescapeHtml: function(str) {
        const HTML_CHARS = {
            "&amp;":  "&",
            "&lt;":   "<",
            "&gt;":   ">",
            "&quot;": '"',
            "&#x27;": "'",
            "&#x2F;": "/",
            "&#x60;": "`"
        };

        return str.replace(/&#?x?[a-z0-9]{2,4};/ig, function (match) {
            return HTML_CHARS[match] || match;
        });
    },


    /**
     * Expresses a number of milliseconds in a human readable format.
     *
     * Range                        | Sample Output
     * -----------------------------|-------------------------------
     * 0 to 45 seconds              | a few seconds ago
     * 45 to 90 seconds             | a minute ago
     * 90 seconds to 45 minutes     | 2 minutes ago ... 45 minutes ago
     * 45 to 90 minutes             | an hour ago
     * 90 minutes to 22 hours       | 2 hours ago ... 22 hours ago
     * 22 to 36 hours               | a day ago
     * 36 hours to 25 days          | 2 days ago ... 25 days ago
     * 25 to 45 days                | a month ago
     * 45 to 345 days               | 2 months ago ... 11 months ago
     * 345 to 545 days (1.5 years)  | a year ago
     * 546 days+                    | 2 years ago ... 20 years ago
     *
     * @param {number} ms
     * @returns {string}
     *
     * @example
     * // returns "3 minutes"
     * Utils.fuzzyTime(152435);
     *
     * // returns "5 days"
     * Utils.fuzzyTime(456851321);
     */
    fuzzyTime: function(ms) {
        return moment.duration(ms, "milliseconds").humanize();
    },


    /**
     * Adds the properties of one Object to another.
     *
     * @param {Object} a
     * @param {Object} b
     * @returns {Object}
     */
    extend: function(a, b){
        for (const key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    },


    /**
     * Formats a list of files or directories.
     * A File is an object with a "fileName" and optionally a "contents".
     * If the fileName ends with "/" and the contents is of length 0 then
     * it is considered a directory.
     *
     * @author tlwr [toby@toby.codes]
     *
     * @param {Object[]} files
     * @returns {html}
     */
    displayFilesAsHTML: function(files) {
        /* <NL> and <SP> used to denote newlines and spaces in HTML markup.
         * If a non-html operation is used, all markup will be removed but these
         * whitespace chars will remain for formatting purposes.
         */

        const formatDirectory = function(file) {
            const html = `<div class='panel panel-default' style='white-space: normal;'>
                    <div class='panel-heading' role='tab'>
                        <h4 class='panel-title'>
                            <NL>${Utils.escapeHtml(file.fileName)}
                        </h4>
                    </div>
                </div>`;
            return html;
        };

        const formatFile = function(file, i) {
            const blob = new Blob(
                [new Uint8Array(file.bytes)],
                {type: "octet/stream"}
            );
            const blobUrl = URL.createObjectURL(blob);

            const viewFileElem = `<a href='#collapse${i}'
                class='collapsed'
                data-toggle='collapse'
                aria-expanded='true'
                aria-controls='collapse${i}'
                title="Show/hide contents of '${Utils.escapeHtml(file.fileName)}'">&#x1f441;&#xfe0f;</a>`;

            const downloadFileElem = `<a href='${blobUrl}'
                title='Download ${Utils.escapeHtml(file.fileName)}'
                download='${Utils.escapeHtml(file.fileName)}'>&#x1f4be;</a>`;

            const hexFileData = Utils.toHexFast(new Uint8Array(file.bytes));

            const switchToInputElem = `<a href='#switchFileToInput${i}'
                class='file-switch'
                title='Move file to input as hex'
                fileValue='${hexFileData}'>&#x21e7;</a>`;

            const html = `<div class='panel panel-default' style='white-space: normal;'>
                    <div class='panel-heading' role='tab' id='heading${i}'>
                        <h4 class='panel-title'>
                            <div>
                                ${Utils.escapeHtml(file.fileName)}<NL>
                                ${viewFileElem}<SP>
                                ${downloadFileElem}<SP>
                                ${switchToInputElem}<SP>
                                <span class='pull-right'>
                                    <NL>${file.size.toLocaleString()} bytes
                                </span>
                            </div>
                        </h4>
                    </div>
                    <div id='collapse${i}' class='panel-collapse collapse'
                        role='tabpanel' aria-labelledby='heading${i}'>
                        <div class='panel-body'>
                            <NL><NL><pre><code>${Utils.escapeHtml(file.contents)}</code></pre>
                        </div>
                    </div>
                </div>`;
            return html;
        };

        let html = `<div style='padding: 5px; white-space: normal;'>
                ${files.length} file(s) found<NL>
            </div>`;

        files.forEach(function(file, i) {
            if (typeof file.contents !== "undefined") {
                html += formatFile(file, i);
            } else {
                html += formatDirectory(file);
            }
        });

        return html.replace(/(?:(<pre>(?:\n|.)*<\/pre>)|\s{2,})/g, "$1") // Remove whitespace from markup
            .replace(/<NL>/g, "\n") // Replace <NP> with newlines
            .replace(/<SP>/g, " "); // Replace <SP> with spaces
    },


    /**
     * Parses URI parameters into a JSON object.
     *
     * @param {string} paramStr - The serialised query or hash section of a URI
     * @returns {object}
     *
     * @example
     * // returns {a: 'abc', b: '123'}
     * Utils.parseURIParams("?a=abc&b=123")
     * Utils.parseURIParams("#a=abc&b=123")
     */
    parseURIParams: function(paramStr) {
        if (paramStr === "") return {};

        // Cut off ? or # and split on &
        if (paramStr[0] === "?" ||
            paramStr[0] === "#") {
            paramStr = paramStr.substr(1);
        }

        const params = paramStr.split("&");
        const result = {};

        for (let i = 0; i < params.length; i++) {
            const param = params[i].split("=");
            if (param.length !== 2) {
                result[params[i]] = true;
            } else {
                result[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
            }
        }

        return result;
    },


    /**
     * Actual modulo function, since % is actually the remainder function in JS.
     *
     * @author Matt C [matt@artemisbot.uk]
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    mod: function (x, y) {
        return ((x % y) + y) % y;
    },


    /**
     * Finds the greatest common divisor of two numbers.
     *
     * @author Matt C [matt@artemisbot.uk]
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    gcd: function(x, y) {
        if (!y) {
            return x;
        }
        return Utils.gcd(y, x % y);
    },


    /**
     * Finds the modular inverse of two values.
     *
     * @author Matt C [matt@artemisbot.uk]
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    modInv: function(x, y) {
        x %= y;
        for (let i = 1; i < y; i++) {
            if ((x * i) % 26 === 1) {
                return i;
            }
        }
    },


    /**
     * A mapping of names of delimiter characters to their symbols.
     * @constant
     */
    charRep: {
        "Space":         " ",
        "Comma":         ",",
        "Semi-colon":    ";",
        "Colon":         ":",
        "Line feed":     "\n",
        "CRLF":          "\r\n",
        "Forward slash": "/",
        "Backslash":     "\\",
        "0x":            "0x",
        "\\x":           "\\x",
        "Nothing (separate chars)": "",
        "None":          "",
    },


    /**
     * A mapping of names of delimiter characters to regular expressions which can select them.
     * @constant
     */
    regexRep: {
        "Space":         /\s+/g,
        "Comma":         /,/g,
        "Semi-colon":    /;/g,
        "Colon":         /:/g,
        "Line feed":     /\n/g,
        "CRLF":          /\r\n/g,
        "Forward slash": /\//g,
        "Backslash":     /\\/g,
        "0x":            /0x/g,
        "\\x":           /\\x/g
    },


    /**
     * A mapping of string formats to their classes in the CryptoJS library.
     * @constant
     */
    format: {
        "Hex":     CryptoJS.enc.Hex,
        "Base64":  CryptoJS.enc.Base64,
        "UTF8":    CryptoJS.enc.Utf8,
        "UTF16":   CryptoJS.enc.Utf16,
        "UTF16LE": CryptoJS.enc.Utf16LE,
        "UTF16BE": CryptoJS.enc.Utf16BE,
        "Latin1":  CryptoJS.enc.Latin1,
    },

    LPformat: {
        "English":     "letter",
        "Index":       "index",
        "Prime":       "prime", 
        "Gematria":    "rune"
    },

    spaceDelimiter: {
        "SPACE":     " ",
        "DASH(-)":       "-",
        "PERIOD(.)":       "\.", 
        "none":    ""
    },
    LPoperation: {
        "Add":     "_add",
        "Subtract":       "_sub"
    },
};

export default Utils;


/**
 * Removes all duplicates from an array.
 *
 * @returns {Array}
 *
 * @example
 * // returns [3,6,4,8,2]
 * [3,6,4,8,4,2,3].unique();
 *
 * // returns ["One", "Two", "Three"]
 * ["One", "Two", "Three", "One"].unique();
 */
Array.prototype.unique = function() {
    let u = {}, a = [];
    for (let i = 0, l = this.length; i < l; i++) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
};


/**
 * Returns the largest value in the array.
 *
 * @returns {number}
 *
 * @example
 * // returns 7
 * [4,2,5,3,7].max();
 */
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};


/**
 * Returns the smallest value in the array.
 *
 * @returns {number}
 *
 * @example
 * // returns 2
 * [4,2,5,3,7].min();
 */
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};


/**
 * Sums all the values in an array.
 *
 * @returns {number}
 *
 * @example
 * // returns 21
 * [4,2,5,3,7].sum();
 */
Array.prototype.sum = function() {
    return this.reduce(function (a, b) {
        return a + b;
    }, 0);
};


/**
 * Determine whether two arrays are equal or not.
 *
 * @param {Object[]} other
 * @returns {boolean}
 *
 * @example
 * // returns true
 * [1,2,3].equals([1,2,3]);
 *
 * // returns false
 * [1,2,3].equals([3,2,1]);
 */
Array.prototype.equals = function(other) {
    if (!other) return false;
    let i = this.length;
    if (i !== other.length) return false;
    while (i--) {
        if (this[i] !== other[i]) return false;
    }
    return true;
};


/**
 * Counts the number of times a char appears in a string.
 *
 * @param {char} chr
 * @returns {number}
 *
 * @example
 * // returns 2
 * "Hello".count("l");
 */
String.prototype.count = function(chr) {
    return this.split(chr).length - 1;
};


////////////////////////////////////////////////////////////////////////////////////////////////////
// Library overrides ///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Override for the CryptoJS Hex encoding parser to remove whitespace before attempting to parse
 * the hex string.
 *
 * @param {string} hexStr
 * @returns {CryptoJS.lib.WordArray}
 */
CryptoJS.enc.Hex.parse = function (hexStr) {
    // Remove whitespace
    hexStr = hexStr.replace(/\s/g, "");

    // Shortcut
    const hexStrLength = hexStr.length;

    // Convert
    const words = [];
    for (let i = 0; i < hexStrLength; i += 2) {
        words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
    }

    return new CryptoJS.lib.WordArray.init(words, hexStrLength / 2);
};
