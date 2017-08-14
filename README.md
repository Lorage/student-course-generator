# Student Course Generator

### Install & run
1. Run git clone
2. npm install
3. npm run build-dev
4. npm run serve-local

### Use
So far, the only code you need to start are these lines, passing the button ID, domain file input ID, and student file input ID.
```
import LearningPaths from './lib/learningPaths.js';

// Register handlers
LearningPaths.registerHandlers('createPath', 'domainUpload', 'studentsUpload');
```

This creates the click and onload handlers which fire when appropriate, including the file saving mechanics.

### TODO
1. Fill out tests
2. Correct output
3. Finish CSS
