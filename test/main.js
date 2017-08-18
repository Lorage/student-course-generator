require('babel-polyfill');
var LearningPaths = require('./../src/lib/learningPaths.js').default;

var assert = require('assert');
describe('Learning Paths', () => {
    describe('Outputting student data', () => {
        it('should output the correct student data', () => {
            console.log(LearningPaths);
            var inputText = `Albin Stanton,K.RI,1.RI,2.RF,2.RI,3.RF\n
                            Erik Purdy,1.RL,1.RI,2.RI,2.RL,2.L\n
                            Aimee Cole,K.RF,K.RL,1.RF,1.RL,1.RI\n`;
            var studentData = LearningPaths.parseStudentData(inputText);
            var outputText = ``;

            assert.equal(studentData, [1,2,3].indexOf(4));
        });
    });
});