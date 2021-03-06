var saveAs;
if (process.env.NODE_ENV !== "testing") {
    saveAs = require('filesaver.js').saveAs;
}

// Learning Paths library
class LearningPaths {
    constructor() {
        this.domainReader;
        this.studentsReader;
        this.scoreMap = {};
        // Raw file data
        this.rawData = {
            domainData: null,
            studentData: null,
        };
        // Parsed line-by-line data
        this.parsedData = {
            domainData: null,
            studentData: null,
        };
        this.domainDictionary = {};
    }

    // Main method
    getLearningPaths() {
        // Check for missing data
        if (this.rawData.studentData === null || this.rawData.domainData === null) {
            return new Error("Student or Domain data missing! Upload new data to proceed.");
        }

        // Built result and trigger file save
        var result = this.buildResultString();
        this.saveFile(result);

        return result;
    }

    // Helpers
    registerHandlers(buttonId, domainFileId, studentFileId) {
        // Add button click
        var createPath = document.getElementById(buttonId);
        createPath.addEventListener('click', () => {
            var paths = this.getLearningPaths();
            if (paths.message) {
                window.alert(paths.message);
            }
        });

        // Add domain file input onchange listener to change current data
        var dataTypes = [
            {
                dataType: 'domainData',
                elementId: domainFileId
            }, 
            {
                dataType: 'studentData',
                elementId: studentFileId
            }
        ];

        this.createReaderBoilerplate(dataTypes);
    }

    createReaderBoilerplate(listenerArray) {
        listenerArray.forEach((element) => {
            var reader = new FileReader();
            var node = document.getElementById(element.elementId);

            reader.onload = () => {
                var text = reader.result.trim();
                node.innerText = text;
                this.rawData[element.dataType] = text;
                if (element.dataType === "domainData") {
                    this.parsedData[element.dataType] = this.parseByLine(text);
                    this.domainDictionary = this.parseIntoDictionary(text);
                } else this.parsedData[element.dataType] = this.parseStudentData(text);
            };

            // Create file read trigger
            node.addEventListener('change', (changeData) => {
                reader.readAsText(changeData.target.files[0]);
            });
        });
    }

    // Split student data into detailed array of objects
    parseStudentData(text) {
        // Create K - X scoreMap based on max domain level
        this.createScoreMap(null, true);

        var studentArray = [];
        var baseStudentArray = this.parseByLine(text);
        var lineArray = text.split("\n");
        lineArray.forEach((item, index) => {
            var splitString = item.split(",");
            var scores = splitString.slice(1);
            var newItem = {
                name: splitString[0],
                scores: []
            };

            scores.forEach((item, index) => {
                newItem.scores.push({
                    domain: baseStudentArray[0][index+1],
                    scoreInt: this.scoreMap[item],
                    scoreString: item
                });
            });

            studentArray.push(newItem);
        });

        // Return all rows except the header row
        return studentArray.splice(1);
    }

    parseByLine(string) {
        var itemArray = [];
        var lineArray = string.split("\n");
        
        lineArray.forEach((item, index) => {
            itemArray.push(item.split(","));
        });

        return itemArray;
    }

    parseIntoDictionary(string) {
        var resultDictionary = {};
        var lineArray = this.parseByLine(string);

        lineArray.forEach((arr) => {
            var key = arr[0];
            var domainArray = arr.slice(1);
            resultDictionary[key] = domainArray;
        });

        return resultDictionary;
    }
 
    buildResultString() {
        var allRows = [];
        var studentHeader = this.parsedData.studentData[0];
        this.parsedData.studentData.forEach((item, index) => {
            allRows.push(this.composeRow(item, studentHeader));
        });
        
        return allRows.join('\n');
    }

    // Start under construction
    composeRow(rowArg, studentHeader) {
        var row = JSON.parse(JSON.stringify(rowArg));
        var rowArray = [];
        var differentials = {};

        // Sort scores ascending
        row.scores.sort((a, b) => {
            return a.scoreInt - b.scoreInt;
        });

        var lastElementIndex = this.parsedData.domainData.length - 1;
        var domainMaxLevel = parseInt(this.parsedData.domainData[lastElementIndex][0]);
        var highestStudentLevel = row.scores[row.scores.length - 1].scoreInt;
        var diffArray = this.createDiffArray(domainMaxLevel);

        // Create differentials object
        row.scores.forEach(function(score, index) {
            differentials[score.domain] = highestStudentLevel - score.scoreInt; 
        });

        // Push student name
        if (rowArray.length === 0) {
            rowArray.push(row.name);
        } 

        // Iterates to 5 to ensure 5 courses
        for (var i = 0; i < 5; i++) {
            var currentDiff = {
                diff: 0
            };

            //Generate the diff array instead, based on max
            diffArray.forEach((prosDiff) => {
                for (var item in differentials) {
                    var existCheck = row.scores.find((score) => {
                        if (score.domain === item) return true;
                    });

                    if ((prosDiff === differentials[item]) && existCheck) {
                        currentDiff = {
                            diff: differentials[item],
                            domain: item
                        };
                    } else break;
                }
            });
            
            // Check both old scores and new scores
            var currentCourse = row.scores.find((item) => {
                if (item.domain === currentDiff.domain) return item;
            });

            // Push new value
            // TODO: Add domain/score checking to make sure currentCourse.domain exists on score level
            if (!currentCourse) return;
            rowArray.push(`${currentCourse.scoreString}.${currentCourse.domain}`);

            // Decrement diff & increment row score
            if (differentials[currentCourse.domain] >= 1) differentials[currentCourse.domain]--;
            var newRow = row.scores.find((score)=>{
                if ((score.domain === currentDiff.domain) && score.scoreInt !== domainMaxLevel) return score;
            });

            if (newRow) {
                // Appropriately set next iteration/domain
                var newScore = newRow.scoreInt;

                if (newRow.scoreString === "0") newRow.scoreString = "K";
                for (var int = newScore; int < domainMaxLevel; ++int) {
                    var check = this.parsedData.domainData[int].includes(newRow.domain);
                    if (check) {
                        int++;
                        newRow.scoreInt = int;
                        break;
                    }
                }

                if (newRow.scoreString === "K") newRow.scoreString = "1";
                else newRow.scoreString = String(newRow.scoreInt);
            }
        }

        return rowArray.join(",");
    }

    createDiffArray(domainMaxLevel) {
        var diffArray = [];
        while (domainMaxLevel--) {
            diffArray.push(domainMaxLevel);
        }

        return diffArray;
    }

    createScoreMap(maxLevels, useDomainData) {
        if (useDomainData) {
            var lastElementIndex = this.parsedData.domainData.length - 1;
            var domainMaxLevel = parseInt(this.parsedData.domainData[lastElementIndex][0]);
            for (var i = 0; i < domainMaxLevel + 1; i++) {
                if (i === 0) this.scoreMap["K"] = 0;
                else {
                    this.scoreMap[i.toString()] = i;
                }
            }

            return;
        }

        for (var i = 0; i < maxLevels + 1; i++) {
            if (i === 0) this.scoreMap["K"] = 0;
            else {
                this.scoreMap[i.toString()] = i;
            }
        }
    }

    saveFile(content) {
        var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "learning_paths.csv");
    }
}

export default new LearningPaths;