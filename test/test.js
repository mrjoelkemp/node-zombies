var getZombies = require('../');
var assert = require('assert');

describe('zombies', function() {
  it('finds the zombies within a directory', function(done) {
    getZombies({
      directory: __dirname + '/example',
      config: __dirname + '/example/config.js',
      buildConfig: __dirname + '/example/build.json',
      exclude: [
        'config.js'
      ],
      success: function(zombies) {
        assert(zombies.length === 3);
        assert(zombies[1].indexOf('z.js') !== -1);
        assert(zombies[2].indexOf('z2.js') !== -1);
        assert(zombies[0].indexOf('z3.js') !== -1);
        done();
      }
    });
  });
});
