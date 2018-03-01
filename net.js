const
    brain = require('brainjs'),
    net = new brain.NeuralNetwork()
    ;

(async() => {
  module.exports = net.fromJSON(require('./net.json'));
  //net.run([1, 0])
})();