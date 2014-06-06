var getZombies = require('../');

getZombies(__dirname + '/example', function(zombies) {
  console.log(zombies);
  console.log(zombies.indexOf('z.js') !== -1);
});
