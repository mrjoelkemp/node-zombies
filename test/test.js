var getZombies = require('../');

getZombies(__dirname + '/example', function(zombies) {
  console.log('Found these zombies: ', zombies);

  console.log(zombies.length === 3);
  console.log(zombies[1].indexOf('z.js') !== -1);
  console.log(zombies[2].indexOf('z2.js') !== -1);
  console.log(zombies[0].indexOf('z3.js') !== -1);
});
