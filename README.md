# Student Course Generator

### Install & run
1. Run `git clone`
2. `npm install`
3. `npm run build-dev`
4. In a second terminal: `npm run serve-local`
5. Some packages might need to be installed globally, but it should be obvious if that is the case. NPM will tell you what command isn't recognized or which NPM script failed.

### Use
So far, the only code you need to start are these lines: passing the button ID, domain file input ID, and student file input ID.

#### JS
```
import LearningPaths from './lib/learningPaths.js';

// Register handlers
LearningPaths.registerHandlers('createPath', 'domainUpload', 'studentsUpload');
```

#### HTML
```
<div class="body-container">
    <div class="upload-container">
        <h4>Domains Upload</h4>
        <input id="domainUpload" type="file" />
    </div>
    <div class="upload-container">
        <h4>Students Upload</h4>
        <input id="studentsUpload" type="file" />
    </div>
    <div class="button-container">
        <button id="createPath" type="submit">Generate</button>
    </div>
</div>
```

This creates the click and onload handlers which fire when appropriate, including the file saving mechanics.

### Explanation

1. The code takes the two CSVs (domain order and student scores), slices them into arrays an objects, and then uses those to run through the test generation.
2. After registering the load handlers, each row is put through `composeRow()` and has its scores sorted.
3. The heuristic uses the difference between that score and the highest test score to determine the order/importance.


### Algorithm Issues/TODO
The two main issues are as follows:
1. There is no checking to see if that specific score/domain entry exists, so in some cases, you will see 2.L, 5.RF, etc.
2. There is no domain-score order within score sets so far, due to how checking is done for score.
3. 5 courses are required. The lack of score/domain checking means that scores may repeat if a student is maxed on all domains.

### TODO
1. Write methods that allow for tests to run & write tests
2. Implement accurate algorithm (current algorithm performs the same process using a catch up mechanism, but doesn't create the same output)
3. Finish CSS
