const
    _ = require('lodash'),
    fs = require('fs'),
    q = require('q')
    ;
(async() => {
  let names = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
  names.map(parse)
  function parse(name) {
    let content = fs.readFileSync('./source/' + name, 'ASCII')
    var global, rides = [];


    content = content.split('\n');
    content.pop();

    let first = content.shift().split(' ');

    global = parseLine(first, {
      rows: 0,
      columns: 0,
      vehicles: 0,
      rides: 0,
      bonus: 0,
      totalSteps: 0

    });
    while (content.length) {
      rides.push(parseLine(content.shift().split(' '), {
        xStart: 0,
        yStart: 0,
        xFinish: 0,
        yFinish: 0,
        startStep: 0,
        finishStep: 0,
        finished: 0,
        reserved: -1,
      }))
    }

    fs.writeFileSync('./parsed/' + name.split('.')[0] + '.json', JSON.stringify({global, rides}));


  }

  function parseLine(array, output) {
    for (let i in output) {
      output[i] = Number(array.shift()) || output[i] ||0;
    }
    return output;
  }
})();