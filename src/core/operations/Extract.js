/**
 * Identifier extraction operations.
 *
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2016
 * @license Apache-2.0
 *
 * @namespace
 */
const Extract = {

    /**
     * Runs search operations across the input data using regular expressions.
     *
     * @private
     * @param {string} input
     * @param {RegExp} searchRegex
     * @param {RegExp} removeRegex - A regular expression defining results to remove from the
     *      final list
     * @param {boolean} includeTotal - Whether or not to include the total number of results
     * @returns {string}
     */
    _search: function(input, searchRegex, removeRegex, includeTotal) {
        let output = "",
            total = 0,
            match;

        while ((match = searchRegex.exec(input))) {
            if (removeRegex && removeRegex.test(match[0]))
                continue;
            total++;
            output += match[0] + "\n";
        }

        if (includeTotal)
            output = "Total found: " + total + "\n\n" + output;

        return output;
    },


    /**
     * @constant
     * @default
     */
    MIN_STRING_LEN: 3,
    /**
     * @constant
     * @default
     */
    DISPLAY_TOTAL: false,

    /**
     * Strings operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runStrings: function(input, args) {
        let minLen = args[0] || Extract.MIN_STRING_LEN,
            displayTotal = args[1],
            strings = "[A-Z\\d/\\-:.,_$%'\"()<>= !\\[\\]{}@]",
            regex = new RegExp(strings + "{" + minLen + ",}", "ig");

        return Extract._search(input, regex, null, displayTotal);
    },


    /**
     * @constant
     * @default
     */
    INCLUDE_IPV4: true,
    /**
     * @constant
     * @default
     */
    INCLUDE_IPV6: false,
    /**
     * @constant
     * @default
     */
    REMOVE_LOCAL: false,

    /**
     * Extract IP addresses operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runIp: function(input, args) {
        let includeIpv4  = args[0],
            includeIpv6  = args[1],
            removeLocal  = args[2],
            displayTotal = args[3],
            ipv4 = "(?:(?:\\d|[01]?\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d|\\d)(?:\\/\\d{1,2})?",
            ipv6 = "((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|(?![\\dA-F])))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})",
            ips  = "";

        if (includeIpv4 && includeIpv6) {
            ips = ipv4 + "|" + ipv6;
        } else if (includeIpv4) {
            ips = ipv4;
        } else if (includeIpv6) {
            ips = ipv6;
        }

        if (ips) {
            const regex = new RegExp(ips, "ig");

            if (removeLocal) {
                let ten = "10\\..+",
                    oneninetwo = "192\\.168\\..+",
                    oneseventwo = "172\\.(?:1[6-9]|2\\d|3[01])\\..+",
                    onetwoseven = "127\\..+",
                    removeRegex = new RegExp("^(?:" + ten + "|" + oneninetwo +
                        "|" + oneseventwo + "|" + onetwoseven + ")");

                return Extract._search(input, regex, removeRegex, displayTotal);
            } else {
                return Extract._search(input, regex, null, displayTotal);
            }
        } else {
            return "";
        }
    },


    /**
     * Extract email addresses operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runEmail: function(input, args) {
        let displayTotal = args[0],
            regex = /\w[-.\w]*@[-\w]+(?:\.[-\w]+)*\.[A-Z]{2,4}/ig;

        return Extract._search(input, regex, null, displayTotal);
    },


    /**
     * Extract MAC addresses operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runMac: function(input, args) {
        let displayTotal = args[0],
            regex = /[A-F\d]{2}(?:[:-][A-F\d]{2}){5}/ig;

        return Extract._search(input, regex, null, displayTotal);
    },


    /**
     * Extract URLs operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runUrls: function(input, args) {
        let displayTotal = args[0],
            protocol = "[A-Z]+://",
            hostname = "[-\\w]+(?:\\.\\w[-\\w]*)+",
            port = ":\\d+",
            path = "/[^.!,?;\"'<>()\\[\\]{}\\s\\x7F-\\xFF]*";

        path += "(?:[.!,?]+[^.!,?;\"'<>()\\[\\]{}\\s\\x7F-\\xFF]+)*";
        const regex = new RegExp(protocol + hostname + "(?:" + port +
            ")?(?:" + path + ")?", "ig");
        return Extract._search(input, regex, null, displayTotal);
    },


    /**
     * Extract domains operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runDomains: function(input, args) {
        let displayTotal = args[0],
            protocol = "https?://",
            hostname = "[-\\w\\.]+",
            tld = "\\.(?:com|net|org|biz|info|co|uk|onion|int|mobi|name|edu|gov|mil|eu|ac|ae|af|de|ca|ch|cn|cy|es|gb|hk|il|in|io|tv|me|nl|no|nz|ro|ru|tr|us|az|ir|kz|uz|pk)+",
            regex = new RegExp("(?:" + protocol + ")?" + hostname + tld, "ig");

        return Extract._search(input, regex, null, displayTotal);
    },


    /**
     * @constant
     * @default
     */
    INCLUDE_WIN_PATH: true,
    /**
     * @constant
     * @default
     */
    INCLUDE_UNIX_PATH: true,

    /**
     * Extract file paths operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runFilePaths: function(input, args) {
        let includeWinPath = args[0],
            includeUnixPath = args[1],
            displayTotal = args[2],
            winDrive = "[A-Z]:\\\\",
            winName = "[A-Z\\d][A-Z\\d\\- '_\\(\\)]{0,61}",
            winExt = "[A-Z\\d]{1,6}",
            winPath = winDrive + "(?:" + winName + "\\\\?)*" + winName +
                "(?:\\." + winExt + ")?",
            unixPath = "(?:/[A-Z\\d.][A-Z\\d\\-.]{0,61})+",
            filePaths = "";

        if (includeWinPath && includeUnixPath) {
            filePaths = winPath + "|" + unixPath;
        } else if (includeWinPath) {
            filePaths = winPath;
        } else if (includeUnixPath) {
            filePaths = unixPath;
        }

        if (filePaths) {
            const regex = new RegExp(filePaths, "ig");
            return Extract._search(input, regex, null, displayTotal);
        } else {
            return "";
        }
    },


    /**
     * Extract dates operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runDates: function(input, args) {
        let displayTotal = args[0],
            date1 = "(?:19|20)\\d\\d[- /.](?:0[1-9]|1[012])[- /.](?:0[1-9]|[12][0-9]|3[01])", // yyyy-mm-dd
            date2 = "(?:0[1-9]|[12][0-9]|3[01])[- /.](?:0[1-9]|1[012])[- /.](?:19|20)\\d\\d", // dd/mm/yyyy
            date3 = "(?:0[1-9]|1[012])[- /.](?:0[1-9]|[12][0-9]|3[01])[- /.](?:19|20)\\d\\d", // mm/dd/yyyy
            regex = new RegExp(date1 + "|" + date2 + "|" + date3, "ig");

        return Extract._search(input, regex, null, displayTotal);
    },


    /**
     * Extract all identifiers operation.
     *
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    runAllIdents: function(input, args) {
        let output = "";
        output += "IP addresses\n";
        output += Extract.runIp(input, [true, true, false]);

        output += "\nEmail addresses\n";
        output += Extract.runEmail(input, []);

        output += "\nMAC addresses\n";
        output += Extract.runMac(input, []);

        output += "\nURLs\n";
        output += Extract.runUrls(input, []);

        output += "\nDomain names\n";
        output += Extract.runDomains(input, []);

        output += "\nFile paths\n";
        output += Extract.runFilePaths(input, [true, true]);

        output += "\nDates\n";
        output += Extract.runDates(input, []);
        return output;
    },

};

export default Extract;
