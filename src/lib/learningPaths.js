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

        this.parseStudentData = this.parseStudentData.bind(this);
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
    }

    // Helpers
    registerHandlers(buttonId, domainFileId, studentFileId) {
        // Add button click
        var createPath = document.getElementById(buttonId);
        createPath.addEventListener('click', () => {
            this.getLearningPaths();
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
                }
                else this.parsedData[element.dataType] = this.parseStudentData(text);
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

        // Create reference to domain headers in the form of:
        var studentHeader = this.parsedData.studentData[0];
        this.parsedData.studentData.forEach((item, index) => {
            if (index === 0) return;
            allRows.push(this.composeRow(item, studentHeader));
        });
        
        return allRows.join('\n');
    }

    // Start under construction
    composeRow(rowArg, studentHeader) {
        var row = Object.assign({}, rowArg);
        var rowArray = [];
        var objectArray = [];
        var differentials = {};
        var sortedRow = row.scores.sort((a, b) => {
            return a.scoreInt - b.scoreInt;
        });
        var lastElementIndex = this.parsedData.domainData.length - 1;
        var domainMaxLevel = parseInt(this.parsedData.domainData[lastElementIndex][0]);
        var highestStudentLevel = sortedRow[sortedRow.length - 1].scoreInt;
        var diffArray = this.createDiffArray(domainMaxLevel);

        // Create differentials object
        sortedRow.forEach(function(score, index) {
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
/*             if (row.length === 1) {
                var diffs = row.scores.filter((score) => {
                    var diff = differentials[score.domain];
                    if (diff > 1) return score;
                });

                if (diffs.length > 0) {
                    diffs.forEach((diff) => {
                        console.log(diff);
                    });
                }
            } */

            // After first score, check for scores of the same score and 
/*             if (objectArray.length > 0) {
                var lastElement = objectArray[objectArray.length - 1];
                var array = row.scores.filter((score) => {
                    if (score.scoreInt === lastElement.scoreInt) {
                        return score;
                    }
                });

                if (array.length > 0) {
                    console.log("array", array);
                    array.sort((scoreA, scoreB) => {
                        return this.scoreMap[scoreA.scoreString].indexOf(scoreA.domain) - this.scoreMap[scoreB.scoreString].indexOf(scoreB.domain);
                    });
                }
            } */

            var newSort = row.scores.sort((scoreA, scoreB) => {
                return differentials[scoreA.domain] - differentials[scoreB.domain];
            });

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
            if (currentCourse) rowArray.push(`${currentCourse.scoreString}.${currentCourse.domain}`);

            // Decrement diff & increment row score
            if (differentials[currentCourse.domain] >= 0) differentials[currentCourse.domain]--;
            row.scores.forEach((element, index) => {
                if ((element.domain === currentDiff.domain) && row.scores[index].scoreInt !== domainMaxLevel) {
                    row.scores[index].scoreInt++;
                    if (currentCourse.scoreString === "K") row.scores[index].scoreString = "1";
                    else row.scores[index].scoreString = String(row.scores[index].scoreInt);
                }
            });
        }

        // Option: only push score object instead of string, then sort before creating the string array

        objectArray.forEach((currentCourse) => {
            rowArray.push(`${currentCourse.scoreString}.${currentCourse.domain}`);
        });

        return rowArray.join(",");
    }
    // End under construction

    createDiffArray(domainMaxLevel) {
        var diffArray = [];
        while(domainMaxLevel--) {
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