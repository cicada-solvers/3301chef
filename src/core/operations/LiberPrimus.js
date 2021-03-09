import Utils from "../Utils.js";
import Gematria from "./Gematria.js";

const LiberPrimus = {

    /**
     * @constant
     * @default
     */
    LP_INPUT_FORMAT: ["English", "Index", "Gematria"],
    LP_OPERATION: ["Add", "Subtract"],

    LP_OUTPUT_FORMAT: ["English", "Index", "Gematria"],
    LP_SPACE_DELIMITER: ["SPACE", "DASH(-)", "PERIOD(.)", "none"],
    LP_FREQUENCY: ["26 Letter English(case sensitive)", "26 Letter English(case insensitive)", "Gematria English", "Gematria Runes"],
    LINEBREAK_DELIMITER: " ",
    RUNES_ONLY: true,

    _letterOp: function (input, key, func, nullPreserving, scheme) {
        if (!key || !key.length) key = [0];
        let result = [],
            x = null,
            k = null,
            o = null;

        for (let i = 0; i < input.length; i++) {
            k = key[i % key.length];
            o = input[i];
            x = nullPreserving && (o === 0 || o === k) ? o : func(o, k);
            result.push(x);
            if (scheme !== "Standard" && !(nullPreserving && (o === 0 || o === k))) {
                switch (scheme) {
                    case "Input differential":
                        key[i % key.length] = x;
                        break;
                    case "Output differential":
                        key[i % key.length] = o;
                        break;
                }
            }
        }

        return result;
    },

    _lookup: function(input, outputFormat){
        let returnVal = input;
        if (Gematria[input]){
            returnVal = Gematria[input][outputFormat];
            // if (outputFormat==="index" || outputFormat==="prime"){
            //     returnVal = " " + Gematria[input][outputFormat] + " ";
            // }
        }
        return returnVal;
    },

    _isValid: function(input){
        let isValid = false;
        if (Gematria[input]){
            isValid = true;
        }
        return isValid;
    },

    _massageText: function(input, spaceDelimiter){
        //       input = input.replace(new RegExp(spaceDelimiter, "g"), " "+spaceDelimiter+" ");
        input = input.toUpperCase();

        input = input.replace(/v/gi, "U");
        input = input.replace(/q/gi, "CU");

        input = input.replace(new RegExp(/[.\.,\/ -\"\n\r\t;:<>\?\\\'\[\]\{\}]/, "g"), " $& ");
        input = input.replace(new RegExp(" {2}", "g"), " ");

        return input;

    },

    _convertIndex: function(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter){
        let returnVal = "";
        if (outputFormat === "index"){
            return input;
        }
        input = LiberPrimus._massageText(input, inputSpaceDelimiter);
        let indices = input.split(" ");
        // input = input.replace(new RegExp(inputSpaceDelimiter, "g"), " "+inputSpaceDelimiter+" ");
        // input = input.replace(new RegExp(" {2}", "g"), " ");
        // let indices = input.split(/[.,\/ -\"\n\r\t;:<>\?\\\'\[\]\{\}]/);
        indices.forEach(function(entry){
            let lookup = LiberPrimus._lookup(entry, outputFormat);
            if (entry === inputSpaceDelimiter || lookup === "29") {
                returnVal += outputSpaceDelimiter;
            } else if (lookup===""){
                returnVal += entry;
            } else {
                returnVal += lookup;
            }
            if (outputFormat === "index"){
                returnVal += " ";
            }
        });
        if (outputFormat === "index"){
            //     returnVal = LiberPrimus._massageText(returnVal, outputSpaceDelimiter);
        //    returnVal = returnVal.replace(new RegExp(outputSpaceDelimiter, "g"), " "+outputSpaceDelimiter+" ");
            returnVal = returnVal.replace(new RegExp(" ", "g"), "");  // s p a c e m a g i c
        }
        return returnVal;
    },

    _convertGematria: function(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter){
        let returnVal = "";
        if (outputFormat === "rune"){
            return input;
        }
        for (let i = 0; i < input.length; i++){
            let lookup = LiberPrimus._lookup(input[i], outputFormat);
            if (input[i] === inputSpaceDelimiter) returnVal += outputSpaceDelimiter;
            else if (lookup===""){
                returnVal += input[i];
            } else {
                returnVal += lookup;
            }
            if (outputFormat==="index"){
                returnVal+=" ";
            }
        }
        return returnVal;
    },

    _convertEnglish: function(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter){
        let returnVal = "";
        input = LiberPrimus._massageText(input, inputSpaceDelimiter);
        let words = input.split(inputSpaceDelimiter);
        let outputWords = [];

        words.forEach(function(word){
            if (word !== ""){
                outputWords.push(LiberPrimus._parseEnglishWord(word, outputFormat));
            }
        });

        returnVal = outputWords.join(outputSpaceDelimiter);
        if (outputFormat === "index"){ //format the numbers correctly
            // returnVal = LiberPrimus._massageText(returnVal, outputSpaceDelimiter);;
            returnVal = returnVal.replace(new RegExp(outputSpaceDelimiter, "g"), " "+outputSpaceDelimiter+" ");
            returnVal = returnVal.replace(new RegExp(" {2}", "g"), " ");
        }
        return returnVal;
    },


    //Start recursing, every step check if we branch or take single letter
    //First - need to look 2 letters ahead for ING
    //Second - need to look 1 letter ahead for TH EA EO OE IA IO NG
    //Third - take single english letter and convert to gematria
    _parseEnglishWord: function(word, outputFormat){
        let branchLetters = ["T", "E", "O", "I", "N", "A"];
        let doubleLetters = ["TH", "EA", "EO", "AE","OE", "IA", "IO", "NG"];
        let returnVal = "";
        for (let i = 0; i < word.length; i++){
            let letter = word[i];
            if (branchLetters.indexOf(letter) !== -1){ //Consider looking at the next letters
                if (i+3 <= word.length){ //ING
                    let threegram = word.substring(i, i+3);
                    let twogram = word.substring(i, i+2);
                    if (threegram === "ING"){
                        returnVal += LiberPrimus._lookup(threegram, outputFormat);
                        i+=2;
                    } else if (doubleLetters.indexOf(twogram) !== -1){
                        returnVal += LiberPrimus._lookup(twogram, outputFormat);
                        i+=1;
                    } else {
                        returnVal += LiberPrimus._lookup(letter, outputFormat);
                    }
                } else if (i+2 <= word.length){
                    let twogram = word.substring(i, i+2);
                    if (doubleLetters.indexOf(twogram) !== -1){
                        returnVal += LiberPrimus._lookup(twogram, outputFormat);
                        i+=1;
                    } else {
                        returnVal += LiberPrimus._lookup(letter, outputFormat);
                    }
                } else {
                    returnVal += LiberPrimus._lookup(letter, outputFormat);
                }
            } else {
                returnVal += LiberPrimus._lookup(letter, outputFormat);
            }
            if (outputFormat==="index"){
                returnVal += " ";
            }
        }
        return returnVal;
    },


    _sumGematriaWords: function(input){
        let returnVal = "";
        input = LiberPrimus._massageText(input, "SPACE");
        let words = input.split(" ");
        let outputWords = [];

        words.forEach(function(word){
            if (word !== ""){
                outputWords.push(LiberPrimus._englishToGematriaSum(word));
            }
        });
        returnVal = outputWords.join(" ");
        return returnVal;
    },


    //Takes an english word as input, generates the gematria sum as the output
    _englishToGematriaSum: function(word){
      var re = new RegExp('[a-zA-Z]');
      if(word.match(re)){
        let outputFormat = "prime";
        let branchLetters = ["T", "E", "O", "I", "N", "A"];
        let doubleLetters = ["TH", "EA", "AE", "EO", "OE", "IA", "IO", "NG"];
        let sum = 0;
        for (let i = 0; i < word.length; i++){
            let returnVal = "";
            let letter = word[i];
            if (branchLetters.indexOf(letter) !== -1){ //Consider looking at the next letters
                if (i+3 <= word.length){ //ING
                    let threegram = word.substring(i, i+3);
                    let twogram = word.substring(i, i+2);
                    if (threegram === "ING"){
                        returnVal += LiberPrimus._lookup(threegram, outputFormat);
                        i+=2;
                    } else if (doubleLetters.indexOf(twogram) !== -1){
                        returnVal += LiberPrimus._lookup(twogram, outputFormat);
                        i+=1;
                    } else {
                        returnVal += LiberPrimus._lookup(letter, outputFormat);
                    }
                } else if (i+2 <= word.length){
                    let twogram = word.substring(i, i+2);
                    if (doubleLetters.indexOf(twogram) !== -1){
                        returnVal += LiberPrimus._lookup(twogram, outputFormat);
                        i+=1;
                    } else {
                        returnVal += LiberPrimus._lookup(letter, outputFormat);
                    }
                } else {
                    returnVal += LiberPrimus._lookup(letter, outputFormat);
                }
            } else {
                returnVal += LiberPrimus._lookup(letter, outputFormat);
            }
            sum += parseInt(returnVal);
        }
        return sum;
      }
      return word; //if not letters, just return it
    },

    gematriaSum: function(input, args){
       let returnVal = "";
       returnVal = LiberPrimus._sumGematriaWords(input);
       return returnVal;
    },


    runLPConvert: function(input, args) {
        let inputFormat = Utils.LPformat[args[0]];
        let inputSpaceDelimiter = Utils.spaceDelimiter[args[1]];

        let outputFormat = Utils.LPformat[args[2]];
        let outputSpaceDelimiter = Utils.spaceDelimiter[args[3]];
        let returnVal = "";

        if (outputFormat === "index" && outputSpaceDelimiter !== "-"){
            return "Please use DASH(-) space delimiters when outputting indices";
        }
        if (inputFormat==="letter"){
            returnVal = LiberPrimus._convertEnglish(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter);
        } else if (inputFormat ==="rune"){
            returnVal = LiberPrimus._convertGematria(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter);
        } else if (inputFormat ==="index"){
            returnVal = LiberPrimus._convertIndex(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter);
        }
        return returnVal;
    },

    _mod: function(n, m) {
        return ((n % m) + m) % m;
    },

    _add: function(a, b){
        return a + b;
    },

    _sub: function(a, b){
        return a - b;
    },
    /* Apply running key */
    runApplyKey: function(input, args){
        let inputFormat = Utils.LPformat[args[0]];
        let inputSpaceDelimiter = Utils.spaceDelimiter[args[1]];

        let outputFormat = Utils.LPformat[args[2]];
        let outputSpaceDelimiter = Utils.spaceDelimiter[args[3]];

        let operation = Utils.LPoperation[args[4]];

        let keyFormat = Utils.LPformat[args[5].option];
        let key = args[5].string;



        /*
        Convert everything to same language (index)
        */
        let outFormat = "index";
        let formattedInput = "";
        let formattedKey = "";
        if (inputFormat=== "letter"){
            formattedInput = LiberPrimus._convertEnglish(input, outFormat, inputSpaceDelimiter, "-");
        } else if (inputFormat === "rune"){
            formattedInput = LiberPrimus._convertGematria(input, outFormat, inputSpaceDelimiter, "-");
        } else if (inputFormat === "index"){
            formattedInput = LiberPrimus._convertIndex(input, outFormat, inputSpaceDelimiter, "-");
        }


        if (keyFormat === "letter"){
            formattedKey = LiberPrimus._convertEnglish(key, outFormat, inputSpaceDelimiter, "-");
        } else if (keyFormat === "rune"){
            formattedKey = LiberPrimus._convertGematria(key, outFormat, inputSpaceDelimiter, "-");
        } else if (keyFormat === "index"){
            formattedKey = LiberPrimus._convertIndex(key, outFormat, inputSpaceDelimiter, "-");
        }

        /* Add key + index */
        let returnValIndices = [];
        if (formattedKey.length === 0){
            return "Enter a valid key";
        }

        formattedInput = LiberPrimus._massageText(formattedInput, "-");
        formattedKey = LiberPrimus._massageText(formattedKey, "-");

        formattedInput = formattedInput.split(" ");
        formattedKey = formattedKey.split(" ");
        for (let i = 0; i < formattedInput.length; i){
            if (formattedInput[i] === "-"){
                returnValIndices.push("-");
                i++;
                continue;
            }
            for (let j = 0; j < formattedKey.length; j++){
                if (i >= formattedInput.length){
                    break;
                } else {
                    let keyIndex = formattedKey[j];
                    let validKeyIndex = !isNaN(parseFloat(keyIndex)) && isFinite(keyIndex);

                    let inputIndex = formattedInput[i];
                    let validInputIndex = LiberPrimus._isValid(formattedInput[i]);

                    if (formattedInput[i] === "-" || formattedInput[i] === "29"){
                        returnValIndices.push("-");
                        i++;
                        j--;
                        continue;
                    }

                    if (validInputIndex === false){
                        returnValIndices.push(formattedInput[i]);
                        i++;
                        j--; // keep key in place
                        continue;
                    }

                    if (validKeyIndex === false){
                        continue; //TODO: this is for when the key has characters like \n , . \ / etc. Whether this advances the input or not is up for debate
                    }

                    let indexTotal = 0;
                    if (operation === "_add"){
                        indexTotal = LiberPrimus._add(parseInt(inputIndex), parseInt(keyIndex));
                    } else {
                        indexTotal = LiberPrimus._sub(parseInt(inputIndex), parseInt(keyIndex));
                    }
                    let modIndex = LiberPrimus._mod(indexTotal, 29);
                    returnValIndices.push(modIndex);
                    i++;
                }
            }

        }

        /*
        Put results together with spaces and return in english
        TODO: Add an option to choose output format
        */
        returnValIndices = returnValIndices.join(" ");
        let returnVal = returnValIndices;
        if (outputFormat!=="index"){
            returnVal = LiberPrimus._convertIndex(returnValIndices, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter);
        }
        return returnVal;
    },

    /**
     * Frequency distribution operation.
     *
     * @param {byteArray} input
     * @param {Object[]} args
     * @returns {html}
     */
    frequencyAnalysis: function (input, args) {
        if (!input.length) return "No data";

        let distrib = new Array(256).fill(0),
            percentages = new Array(256),
            len = input.length,
            showZeroes = args[0],
            i;

        // Count bytes
        for (i = 0; i < len; i++) {
            distrib[input[i]]++;
        }

        // Calculate percentages
        let repr = 0;
        for (i = 0; i < 256; i++) {
            if (distrib[i] > 0) repr++;
            percentages[i] = distrib[i] / len * 100;
        }

        // Print
        let output = "<canvas id='chart-area'></canvas><br>" +
            "Total data length: " + len +
            "\nNumber of bytes represented: " + repr +
            "\nNumber of bytes not represented: " + (256-repr) +
            "\n\nByte   Percentage\n" +
            "<script>\
                var canvas = document.getElementById('chart-area'),\
                    parentRect = canvas.parentNode.getBoundingClientRect(),\
                    scores = " + JSON.stringify(percentages) + ";\
                \
                canvas.width = parentRect.width * 0.95;\
                canvas.height = parentRect.height * 0.9;\
                \
                CanvasComponents.drawBarChart(canvas, scores, 'Byte', 'Frequency %', 16, 6);\
            </script>";

        for (i = 0; i < 256; i++) {
            if (distrib[i] || showZeroes) {
                output += " " + Utils.hex(i, 2) + "    (" +
                        Utils.padRight(percentages[i].toFixed(2).replace(".00", "") + "%)", 8) +
                        Array(Math.ceil(percentages[i])+1).join("|") + "\n";
            }
        }

        return output;
    },
};

export default LiberPrimus;
