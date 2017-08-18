# Student Course Generator

### Install & run
1. Run git clone
2. npm install
3. npm run build-dev
4. npm run serve-local

### Use
So far, the only code you need to start are these lines, passing the button ID, domain file input ID, and student file input ID.

### JS
```
import LearningPaths from './lib/learningPaths.js';

// Register handlers
LearningPaths.registerHandlers('createPath', 'domainUpload', 'studentsUpload');
```

### HTML
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

### TODO
1. Write methods that allow for tests to run & write tests
2. Implement accurate algorithm (current algorithm performs the same process using a catch up mechanism, but doesn't create the same output)
3. Finish CSS
