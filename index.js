var getRoots = require('app-root'),
    // TODO: Change to actual module when we move it out
    getDriverScripts = require('./getDriverScripts');

/**
 * Computes the set difference between two arrays
 * @param  {Array} a
 * @param  {Array} b
 * @return {Array} A list of values from a that are not in b
 */
function difference(a, b) {
  // Naive n^2
  return a.filter(function(elem) {
    return b.indexOf(elem) === -1;
  });
}

// find roots and find driver scripts and print the set difference
module.exports = function (directory, cb) {
  getRoots(directory, function(roots) {
    console.log('Roots: ', roots)
    getDriverScripts(roots, function(drivers) {
      console.log('Drivers: ', drivers)

      var zombies = difference(roots, drivers);
      console.log('Zombies: ', zombies)
      cb(zombies);
    });
  });
};
