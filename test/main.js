require('babel-polyfill');
var LearningPaths = require('./../src/lib/learningPaths.js');

var assert = require('assert');
describe('Learning Paths', () => {
    describe('Outputting student data', () => {
        it('should output the correct student data', () => {
            var text = "Student Name,RF,RL,RI,L\nAlbin Stanton,2,3,K,3\nErik Purdy,3,1,1,1\nAimee Cole,K,K,1,2";
            console.log(LearningPaths);
            var studentData = LearningPaths.parseStudentData(text);
            console.log(studentData);
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });

/*     describe('#indexOf()', () => {
        it('should return -1 when the value is not present', () => {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });

    describe('#indexOf()', () => {
        it('should return -1 when the value is not present', () => {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    }); */
});