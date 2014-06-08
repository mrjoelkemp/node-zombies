var getZombies = require('../');

getZombies(__dirname + '/example', function(zombies) {
  console.log('Found these zombies: ', zombies);

  console.log(zombies.length === 2);
  console.log(zombies[0].indexOf('z.js') !== -1);
  console.log(zombies[1].indexOf('z2.js') !== -1);
});
