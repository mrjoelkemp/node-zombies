#!/usr/bin/env node

'use strict';

var findZombies = require('../'),
    directory = process.argv[2];

findZombies(directory, function(zombies) {
  zombies.forEach(function(z) {
    console.log(z);
  });
});
