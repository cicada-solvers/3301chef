/**
 * @author onecool []
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * Frequency Analysis operation
 */
class FrequencyAnalysis extends Operation {

    /**
     * FrequencyAnalysis constructor 
     */
    constructor() {
        super();

        this.name = "Frequency Analysis";
        this.module = "Cicada";
        this.description = "Display graph of the count of each character occurrence in the input. ";
        this.infoURL = "";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name":"Sort by Key",
                "type":"boolean",
                "value":true
            },
            {
                "name":"Sort by Value",
                "type":"boolean",
                "value":true
            }
            /* Example arguments. See the project wiki for full details.
            {
                name: "First arg",
                type: "string",
                value: "Don't Panic"
            },
            {
                name: "Second arg",
                type: "number",
                value: 42
            }
            */
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        // const [firstArg, secondArg] = args;
        let returnVal = "";
        let totalCharacters = 0;

        const sort = args[0] === undefined ? true : args[0];
        const sortValue = args[0] === undefined ? true : args[0];

        if(input.length===0){
            return "No characters to count";
        }
        let alphabet = {};
        let sortedAlphabet = {};
        for (let i = 0; i < input.length; i++){
            let character = input[i];
            if(input[i] in alphabet){
                let charactercount = parseInt(alphabet[character]);
                alphabet[character] = charactercount + 1;
            }else{
                alphabet[character] = 1;
            }
            totalCharacters++;
        };

        //let alphabetObj = {};
        //alphabet.forEach(function(char){ alphabetObj[char[0]] = char[1];});

        if(sort){
            returnVal = JSON.stringify(alphabet, Object.keys(alphabet).sort()) + "\n\n";
        }else{
            returnVal = JSON.stringify(alphabet) + "\n\n";
        }

        if(sortValue){
            //sortedAlphabet = Object.entries(alphabet)// alphabet.sort(function(char1, char2){return (char1[1] - char2[1])});
           /* sortedAlphabet = Object.entries(alphabet).sort(([,a],[,b]) => a-b).reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
            returnVal += JSON.stringify(sortedAlphabet) + "\n\n";
            sortedAlphabet = Object.fromEntries(Object.entries(alphabet).sort(([,a],[,b]) => a-b));
            returnVal += JSON.stringify(sortedAlphabet) + "\n\n";*/
            sortedAlphabet = Object.entries(alphabet).sort(function(a,b){return b[1]-a[1]});//alphabet[b]-alphabet[a]});
           /* for(let i = 0; i < sortedAlphabet.length;i++){
                sortedAlphabet[i][0] = sortedAlphabet[i];
                sortedAlphabet[i][1] = alphabet[sortedAlphabet[i]];
            }*/
            returnVal += JSON.stringify(sortedAlphabet) + "\n\n";

        }

        returnVal += "Total number of characters : " + totalCharacters + "\n\n";
        let characterList = "";
        for (let [key, value] of Object.entries(alphabet)){
            if (alphabet.hasOwnProperty(key)){
                if(key === "\n"){
                    characterList += "\\n";
                }else{
                    characterList += key +"";
                }
            }
        }
        returnVal += characterList;

        return returnVal;
    }

}

export default FrequencyAnalysis;
