Zombies
---

*Hunt down all of those lingering modules.*

Identifies all AMD modules that have been defined but are unused within
a given directory.

### Usage

```javascript
var findZombies = require('zombies');

findZombies('./js', function (zombies) {
  // print them out, or destroy them
});
```

### Use cases

1. Fail continuous integration suites if zombie files are introduced
2. Spring cleanup task to eliminate legacy, zombie code
