import Utils from "../Utils.mjs";
import {Gematria} from "./Gematria.mjs";


export const LP_INPUT_FORMAT = [{name:"Index", value:"index"}, {name:"English", value:"letter"}, {name:"Gematria Rune", value:"rune"}, {name:"Gematria Prime", value:"prime"}];
//export const LP_OPERATION = [{name:"Add", value:"add"},{name:"Subtract", value:"sub"}];
export const LP_OUTPUT_FORMAT = [{name:"English", value:"letter"}, {name:"Index", value:"index"}, {name:"Gematria Rune", value:"rune"}, {name:"Gematria Prime", value:"prime"}];
//export const LP_SPACE_DELIMITER = [{name:"Space", value:"space"}, {name:"Dash", value:"dash"},{name:"Period", value:"period"}, {name:"None", value:"none"}];
export const LP_OUTSPACE_DELIMITER = [{name:"Space", value:"space"}, {name:"Dash", value:"dash"},{name:"Period", value:"period"}, {name:"None", value:"none"}];
export const LP_SPACE_DELIMITER = ["Space", "Dash", "Period"];
export const LP_OPERATION = ["Add","Subtract"];

export const LP_FREQUENCY = ["26 Letter English(case sensitive)", "26 Letter English(case insensitive)", "Gematria English", "Gematria Runes"];

const LiberPrimus = {

    /**
     * @constant
     * @default
     */


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
        let returnVal = "";
        if (Gematria[input] === undefined){
          returnVal = input;//'notfound';
            // if (outputFormat==="index" || outputFormat==="prime"){
            //     returnVal = " " + Gematria[input][outputFormat] + " ";
            // }
        }else{
          returnVal = Gematria[input][outputFormat];
        }
        return returnVal;
    },

    _isValid: function(input){
        let isValid = true;
        if (Gematria[input] === undefined){
            isValid = false;
        }
        return isValid;
    },

    _removeDoubleSpaces: function(input){
        return input.replace(new RegExp(" {2}", "g"), " ");;
    },
    _removeLineBreaks: function(input){
        //       input = input.replace(new RegExp(spaceDelimiter, "g"), " "+spaceDelimiter+" ");
        //input = input.replace(new RegExp("\n", "g"), " $& ");
        input = input.replace(/\n|\r/g, "");
        return input;
    },
    _padSpaceDelimiters: function(input, inputSpaceDelimiter){
        //       input = input.replace(new RegExp(spaceDelimiter, "g"), " "+spaceDelimiter+" ");
        input = input.replace(/\-|\./gi, " $& ");
        return input;
    },
    _padLineBreaks: function(input){
        //       input = input.replace(new RegExp(spaceDelimiter, "g"), " "+spaceDelimiter+" ");
        //input = input.replace(new RegExp("\n", "g"), " $& ");
        input = input.replace(new RegExp("\n", "g"), " $& ");
        return input;
    },
    // Convert text to uppercase, make letter replacements 
    // because 'Q' and 'V' do not exist in Gematria alphabet 
    _parseEnglishToFutharkEnglish: function(input, spaceDelimiter){
        //       input = input.replace(new RegExp(spaceDelimiter, "g"), " "+spaceDelimiter+" ");
        input = input.toUpperCase();
        input = input.replace(/v/gi, "U");
        input = input.replace(/q/gi, "CU");
        return input;
    },

    /*
     given input string of indices   
      (0-28) [space between numbers] [- between words ]
      */
    _convertIndex: function(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter){
        let returnVal = "";
        if (outputFormat === "index"){
            return input;
        }
        input = LiberPrimus._padLineBreaks(input, inputSpaceDelimiter);
        input = LiberPrimus._padSpaceDelimiters(input);
        input = LiberPrimus._removeDoubleSpaces(input, inputSpaceDelimiter);

        let indices = input.split(" ");
        // input = input.replace(new RegExp(inputSpaceDelimiter, "g"), " "+inputSpaceDelimiter+" ");
        // input = input.replace(new RegExp(" {2}", "g"), " ");
        // let indices = input.split(/[.,\/ -\"\n\r\t;:<>\?\\\'\[\]\{\}]/);
        indices.forEach(function(entry){
            let lookup = LiberPrimus._lookup(entry, outputFormat);
            if (entry === inputSpaceDelimiter || lookup === "29") {
              returnVal += outputSpaceDelimiter;
            } else if(lookup === entry){
              returnVal += entry;
            }else{
              returnVal += lookup;
            }
            if (outputFormat === "index" || outputFormat === "prime"){
              returnVal += " ";
            }
        });
        if (outputFormat === "index"|| outputFormat === "prime"){
          returnVal = LiberPrimus._padSpaceDelimiters(returnVal);
          returnVal = LiberPrimus._removeDoubleSpaces(returnVal, inputSpaceDelimiter);
        }
        return returnVal;
    },

    /* Input: Runic utf8 characters
      Output: English, Runic, or Index 
       space characters replaced with new space delimiter. If output is Index, spaces are '-' since a ' ' appears between each number 
      */
    _convertGematria: function(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter){
        let returnVal = "";
        if (outputFormat === "rune"){
            return input;
        }
        for (let i = 0; i < input.length; i++){
            let lookup = LiberPrimus._lookup(input[i], outputFormat);
            if (input[i] === inputSpaceDelimiter || lookup === "29") {
              returnVal += outputSpaceDelimiter;
            } else if(lookup === input[i]){
              returnVal += input[i];
            }else{
              returnVal += lookup;
            }
            if (outputFormat === "index"){
              returnVal += " ";
            }
        }
        return returnVal;
    },

    _convertEnglish: function(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter){
        let returnVal = "";
        // Don't just return english - need to convert to 'futhark english'
        input = LiberPrimus._parseEnglishToFutharkEnglish(input, inputSpaceDelimiter);
        input = LiberPrimus._removeDoubleSpaces(input, inputSpaceDelimiter);
        let words = input.split(inputSpaceDelimiter);
        let outputWords = [];

        words.forEach(function(word){
        //  console.log(":::::::::"+word);
          if(/\r|\n/.exec(word)){
            let newWord = word.replace(/\n|\r/g,"");
            console.log("Word in the input contain a newline ("+word+"). Newline character will be moved to beginning of word.");
            let parsedWord = LiberPrimus._parseEnglishWord(newWord, outputFormat);
            outputWords.push("\r" + parsedWord);
            //outputWords.push();
          }else if (word !== ""){
                outputWords.push(LiberPrimus._parseEnglishWord(word, outputFormat));
            }
            

        });

        returnVal = outputWords.join(outputSpaceDelimiter);
        if (outputFormat === "index" || outputFormat ==="prime"){ //format the numbers correctly
            // returnVal = LiberPrimus._massageText(returnVal, outputSpaceDelimiter);;
            returnVal = LiberPrimus._padLineBreaks(returnVal, inputSpaceDelimiter);
            returnVal = LiberPrimus._padSpaceDelimiters(returnVal, inputSpaceDelimiter);
            returnVal = LiberPrimus._removeDoubleSpaces(returnVal, inputSpaceDelimiter);
        }
        return returnVal;
    },


    //Start parsing word, every step check if we branch or take single letter
    //First - need to look 2 letters ahead for ING
    //Second - need to look 1 letter ahead for TH EA EO OE IA IO NG
    //Third - take single english letter and convert
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
                        // let checkGematria = LiberPrimus._lookup(threegram, outputFormat);
                        // if(checkGematria === "nindexOfotfound"){
                        // 
                        // }
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
            if (returnVal === "29") {
              returnVal += " ";
            }
            if (outputFormat==="index" || outputFormat==="prime"){
              returnVal += " "; // Put sp
            }
        }
        
        return returnVal;
    },

/*
**
**    Functions for summing in 3301 Gematria
**
**/

    _getGematriaSum: function (input, inputSpaceDelimiter, inputFormat){
        let returnVal = "";
        
        input = LiberPrimus._parseEnglishToFutharkEnglish(input, inputSpaceDelimiter);
        input = LiberPrimus._removeDoubleSpaces(input, inputSpaceDelimiter);

        let words = input.split(inputSpaceDelimiter);
        let outputWords = [];

        if(words === undefined){
            return;
        }
        if (inputFormat==="letter"){
            for(let i = 0; i < words.length; i++){
                let word = words[i];
                if (word !== ""){
                    outputWords.push(LiberPrimus._getGematriaSumOfEnglishWord(word));
                }
            }
        } else if (inputFormat ==="rune"){
            for(let i = 0; i < words.length; i++){
                let word = words[i];
                if (word !== ""){
                    outputWords.push(LiberPrimus._getGematriaSumOfRuneWord(word));
                }
            }
        } else if (inputFormat ==="index"){
            for(let i = 0; i < words.length; i++){
                let word = words[i];
                if (word !== ""){
                    let indices = word.split(" ");
                    let sum = 0;
                    if(indices !== undefined){
                        for(let j = 0; j < indices.length; j++){
                            let test = LiberPrimus._getGematriaSumOfIndex(indices[j]);
                            if(test){
                                sum += test;
                            }
                            console.log(test);
                        }
                        outputWords.push(sum);
                    }
                }
            }
        }
        returnVal = outputWords.join(" ");
        return returnVal;
    },
    
    _getGematriaSumOfRuneWord: function (word) {
        let sum = 0;
        for (let i = 0; i < word.length; i++){
            let letter = word[i];
            let lookup = LiberPrimus._lookup(letter, "prime");
            if(sum !== undefined){
                sum += parseInt(lookup);  
            }
          }
        return sum;
    },
    _getGematriaSumOfIndex: function(index){
      let lookup = LiberPrimus._lookup(index, "prime");
      let sum = parseInt(lookup);
      return sum;
    },
    //Takes an english word as input, generates the gematria sum as the output
    _getGematriaSumOfEnglishWord: function(word){
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
                        returnVal += parseInt(LiberPrimus._lookup(threegram, outputFormat));
                        i+=2;
                    } else if (doubleLetters.indexOf(twogram) !== -1){
                        returnVal += parseInt(LiberPrimus._lookup(twogram, outputFormat));
                        i+=1;
                    } else {
                        returnVal += parseInt(LiberPrimus._lookup(letter, outputFormat));
                    }
                } else if (i+2 <= word.length){
                    let twogram = word.substring(i, i+2);
                    if (doubleLetters.indexOf(twogram) !== -1){
                        returnVal += parseInt(LiberPrimus._lookup(twogram, outputFormat));
                        i+=1;
                    } else {
                        returnVal += parseInt(LiberPrimus._lookup(letter, outputFormat));
                    }
                } else {
                    returnVal += parseInt(LiberPrimus._lookup(letter, outputFormat));
                }
            } else {
                returnVal += parseInt(LiberPrimus._lookup(letter, outputFormat));
            }
            sum += parseInt(returnVal);
        }
        return sum;
      }
      return word; //if not letters, just return it
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
    
    
    gematriaSum: function(input, args){
      let inputFormat = Utils.LPformat(args[0]);
      let inputSpaceDelimiter = Utils.spaceDelimiter(args[1]);
      let returnVal = "";
      input = LiberPrimus._removeLineBreaks(input);
      input = LiberPrimus._padLineBreaks(input, inputSpaceDelimiter);
      input = LiberPrimus._padSpaceDelimiters(input, inputSpaceDelimiter);
      input = LiberPrimus._removeDoubleSpaces(input, inputSpaceDelimiter);
      if (inputFormat === "index" && inputSpaceDelimiter !== "-"){
          console.log("When using 'index', output space delimiter between words must be '-' (For example, F UTH => 0 - 1 2). Change delimiter to remove this warning.\n");
          inputSpaceDelimiter = "-";
      }else if (inputFormat === "letter"){
        console.log("When calculating Gematria Sum over English Letters, be aware the letters are changed to the Gematria alphabet first. For example, (EOEOEO) -> 123 rather than (67+7+67+7+67+7). \n\n");
      }
      returnVal = LiberPrimus._getGematriaSum(input, inputSpaceDelimiter, inputFormat);

       return returnVal;
    },

    /*
    **
    **
    **
    **
    ** Apply running key */
    runApplyKey: function(input, args){
        let inputFormat = Utils.LPformat(args[0]);
        let inputSpaceDelimiter = Utils.spaceDelimiter(args[1]);

        let outputFormat = Utils.LPformat(args[2]);
        let outputSpaceDelimiter = Utils.spaceDelimiter(args[3]);


        let operation = Utils.LPoperation(args[4]);
        let key = args[5].string;
        let keyFormat = args[5].option;
        /*
        Convert everything to same language (index)
        */
        let outFormat = "index";
        let formattedInput = "";
        let formattedKey = "";
        input = LiberPrimus._removeLineBreaks(input);
        input = LiberPrimus._padLineBreaks(input, inputSpaceDelimiter);
        input = LiberPrimus._padSpaceDelimiters(input, inputSpaceDelimiter);
        input = LiberPrimus._removeDoubleSpaces(input, inputSpaceDelimiter);

        if (inputFormat === "letter"){
            input = LiberPrimus._parseEnglishToFutharkEnglish(input);
            formattedInput = LiberPrimus._convertEnglish(input, outFormat, inputSpaceDelimiter, "-");
        } else if (inputFormat === "rune"){
            formattedInput = LiberPrimus._convertGematria(input, outFormat, inputSpaceDelimiter, "-");
        } else if (inputFormat === "index"){
            formattedInput = LiberPrimus._convertIndex(input, outFormat, inputSpaceDelimiter, "-");
        }

        key = LiberPrimus._removeLineBreaks(key);
        key = LiberPrimus._padLineBreaks(key, inputSpaceDelimiter);        
        if (keyFormat === "letter"){
            key = LiberPrimus._parseEnglishToFutharkEnglish(key);
            formattedKey = LiberPrimus._convertEnglish(key, outFormat, inputSpaceDelimiter, "-");
        } else if (keyFormat === "rune"){
            formattedKey = LiberPrimus._convertGematria(key, outFormat, inputSpaceDelimiter, "-");
        } else if (keyFormat === "index"){
            key = LiberPrimus._padSpaceDelimiters(key, "-");
            key = LiberPrimus._removeDoubleSpaces(key, "-");
            formattedKey = LiberPrimus._convertIndex(key, outFormat, inputSpaceDelimiter, "-");
            
        }

        /* Add key + index */
        let returnValIndices = [];
        if (formattedKey.length === 0){
            return "Enter a valid key";
        }

        formattedInput = LiberPrimus._removeDoubleSpaces(formattedInput, "-");
        formattedKey = LiberPrimus._removeDoubleSpaces(formattedKey, "-");

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
                        returnValIndices.push(keyIndex);
                        continue; //TODO: this is for when the key has characters like \n , . \ / etc. 
                    }

                    let indexTotal = 0;
                    if (operation === "_add"){
                        indexTotal = LiberPrimus._add(parseInt(inputIndex), parseInt(keyIndex));
                    } else if (operation === "_sub"){
                        indexTotal = LiberPrimus._sub(parseInt(inputIndex), parseInt(keyIndex));
                    }
                    let modIndex = LiberPrimus._mod(indexTotal, 29);
                    returnValIndices.push(modIndex);
                    i++;
                }
            }

        }


        /* 
        Convert the computed array of (input +/- key) to the desired output format
        */
        returnValIndices = returnValIndices.join(" ");
        let returnVal = returnValIndices;
        if (outputFormat==="letter"){
            returnVal = LiberPrimus._convertIndex(returnValIndices, outputFormat, "-", outputSpaceDelimiter);
        }else if (outputFormat==="rune"){
            returnVal = LiberPrimus._convertIndex(returnValIndices, outputFormat, "-", outputSpaceDelimiter);
        }else if (outputFormat==="prime"){
          returnVal = LiberPrimus._convertIndex(returnValIndices, outputFormat, "-", outputSpaceDelimiter);
        } //otherwise it is already 'index', so continue
        return returnVal;
    },

    
        runLPConvert: function(input, args) {
            let inputFormat = Utils.LPformat(args[0]);
            let inputSpaceDelimiter = Utils.spaceDelimiter(args[1]);
            if(inputSpaceDelimiter === undefined){
              inputSpaceDelimiter = "-";
            }
            let outputFormat = Utils.LPformat(args[2]);
            let outputSpaceDelimiter = Utils.spaceDelimiter(args[3]);
            if(outputSpaceDelimiter === undefined){
              outputSpaceDelimiter = " ";
            }
            let removeLineBreaks = args[4];
            console.log("" + inputFormat + inputSpaceDelimiter + outputFormat + outputSpaceDelimiter);
            let returnVal = "";

            if (outputFormat === "index" && outputSpaceDelimiter !== "-"){
                returnVal = "When using 'index', output space delimiter between words must be '-' (For example, F UTH => 0 - 1 2). Change delimiter to remove this warning.\n";
                outputSpaceDelimiter = "-";
            }
            if (inputFormat==="letter"){
                returnVal += LiberPrimus._convertEnglish(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter);
            } else if (inputFormat ==="rune"){
                returnVal += LiberPrimus._convertGematria(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter);
            } else if (inputFormat ==="index"){
                returnVal += LiberPrimus._convertIndex(input, outputFormat, inputSpaceDelimiter, outputSpaceDelimiter);
            }
            if(removeLineBreaks){
              returnVal = LiberPrimus._removeLineBreaks(returnVal);
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
                output += " " + Utils.hex[i, 2] + "    (" +
                        Utils.padRight[percentages[i].toFixed(2).replace(".00", "") + "%)", 8] +
                        Array(Math.ceil(percentages[i])+1).join("|") + "\n";
            }
        }

        return output;
    },
};

export default LiberPrimus;
