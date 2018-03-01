const
    _ = require('lodash'),
    fs = require('fs'),
    q = require('q'),
    brain = require('brainjs'),
    net = new brain.NeuralNetwork()
    ;
console.log(222);
(async() => {
  let trainingSet = [],
      input = {"A":1};

  //input=require('./parsed/')

  for (let i in input) {
    let item = input[i];
    trainingSet.push({
      input: {
        r: 0.03,
        g: 0.7,
        b: 0.5
      },
      output: {black: 1}
    })
  }


  net.train(trainingSet, {
    errorThresh: 0.005,  // error threshold to reach
    iterations: 20000,   // maximum training iterations
    log: true,           // console.log() progress periodically
    logPeriod: 10,       // number of iterations between logging
    learningRate: 0.3    // learning rate
  });
  fs.writeFileSync('./net.json', JSON.stringify(net.toJSON()))

})();