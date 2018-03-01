const
    _ = require('lodash'),
    fs = require('fs'),
    q = require('q')
    ;

(async() => {
  //const net =require('./net');
  let names = ['a_example.json', 'b_should_be_easy.json', 'c_no_hurry.json', 'd_metropolis.json', 'e_high_bonus.json'];
  names.map(go);
  function go(name) {
    let {global, rides}=require('./parsed/' + name);
    let autos = [];
    for (let index = 0; index < global.vehicles; index++) {
      autos.push({
        x: 0,
        y: 0,
        ride: -1,
        finishedRides: [],
        availableRides: [],
      })
    }

    for (let i in rides) {
      let ride = rides[i];
      rides[i].distance = getDistance(ride.xStart, ride.yStart, ride.xFinish, ride.yFinish);
    }

    let sortedRides = _.sortBy(rides, function (o) {
      return o.distance * -1
    });

    for (let STEP = 0; STEP < global.totalSteps; STEP++) {
      setRides();
      run();
    }

    writeResults();
    console.log("FINISH " + name);


    function writeResults() {
      let result = [];
      for (let auto of autos) {
        let line = [];
        line.push(auto.finishedRides.length, ...auto.finishedRides)
        result.push(line.join(' '))
      }
      result = result.join('\n');
      fs.writeFileSync('./result/' + name.split('.')[0] + '.out', result);
    }


    function run() {
      for (let auto of _.filter(autos, function (a) {
        return a.ride > -1;
      })) {
        auto.step -= 1;
        if (!auto.step) {
          auto.finishedRides.push(auto.ride);
          auto.ride = -1;
        }
      }
    }

    function setRides() {
      for (let auto of _.filter(autos, {ride: -1})) {
        if (sortedRides.length) {
          let autoRide = sortedRides.shift();
          auto.ride = rides.indexOf(autoRide);
          auto.step = autoRide.distance;
        }


        /*for (let i in _.filter(rides, {inWay: 0})) {
         let ride = rides[i];

         let distance = getDistance(auto.x, auto.y, ride.xStart, ride.yStart);
         if (distance === ride.startStep) {
         rides[i].inWay = 1;
         auto.ride = i;
         }
         }*/
      }
    }
  }


})();


function getDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}