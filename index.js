const
    _ = require('lodash'),
    fs = require('fs'),
    q = require('q')
    ;

(async() => {
  //const net =require('./net');
  let names = ['a_example.json', 'b_should_be_easy.json', 'c_no_hurry.json', 'd_metropolis.json', 'e_high_bonus.json'];
  names = [names[0]]
  names.map(go);
  function go(name) {
    var STEP = 0;
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

    // let sortedRides = _.sortBy(rides, function (o) {
    //   return o.distance * -1
    // });

    for (let step = 0; step < global.totalSteps; step++) {
      STEP = step;
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
        let ride = rides[auto.ride];
        auto.x = ride.xFinish;
        auto.y = ride.yFinish;
        auto.step -= 1;
        if (!auto.step) {
          ride.finished = 1;
          auto.finishedRides.push(auto.ride);
          auto.ride = -1;
          let reservedRide = _.find(rides, {reserved: autos.indexOf(auto)});
          if (reservedRide) {
            auto.ride = rides.indexOf(reservedRide);
            auto.step = reservedRide.distance + reservedRide.distanceToStart + (reservedRide.startStep - STEP + reservedRide.distanceToStart);
          }
        }
      }
    }

    function setRides() {
      for (let auto of _.filter(autos, {ride: -1})) {
        console.log("==================");

        for (let ride of getAvailableRide()) {
          /*@*/
          //let autoRide = sortedRides.shift();
          let distanceToStart = getDistance(auto.x, auto.y, ride.xStart, ride.yStart);
          let distanceFromStartToFinish = ride.distance;
          let bonus = ride.startStep <= (STEP + distanceToStart) ? global.bonus : 0;////
          ride.distanceToStart = distanceToStart;
          ride.score = distanceFromStartToFinish + bonus;
        }

        let sortedRides = _.sortBy(getAvailableRide(), function (o) {
          return o.score * -1
        });

        let autoRide = sortedRides[0];
        if (autoRide) {
          autoRide.reserved = autos.indexOf(auto);
        }

        let followingRide;
        console.log(getAvailableRide().length);
        for (let ride of getAvailableRide()) {
          let distanceToRide = getDistance(auto.x, auto.y, ride.xStart, ride.yStart);
          let wait = ride.startStep - (STEP + distanceToRide);
          if (wait < 0) {
            wait = 0;
          }
          ride.distanceToStart = distanceToRide + wait;
          let distanceToNext = getDistance(ride.xFinish, ride.yFinish, autoRide.xStart, autoRide.yStart);
          let fullDistance = distanceToRide + wait + ride.distance + distanceToNext;
          if (fullDistance <= autoRide.distanceToStart) {
            followingRide = ride;
            ride.reserved = autos.indexOf(auto);
            break;
          }
        }

        if (followingRide) {
          console.log("auto.ride1",auto.ride);
          console.log("auto",autos.indexOf(auto));
          auto.ride = rides.indexOf(followingRide);
          auto.step = followingRide.distance + followingRide.distanceToStart + (followingRide.startStep - STEP + followingRide.distanceToStart);
        } else if (autoRide) {
          auto.ride = rides.indexOf(autoRide);
          console.log("auto.ride2",auto.ride);
          console.log("auto",autos.indexOf(auto));

          auto.step = autoRide.distance + autoRide.distanceToStart + (autoRide.startStep - STEP + autoRide.distanceToStart);
        }


        // auto.ride = rides.indexOf(autoRide);
        // auto.step = autoRide.distance + autoRide.distanceToStart + (autoRide.startStep - STEP + autoRide.distanceToStart);

        function getAvailableRide() {
          return _.filter(rides, {finished: 0, reserved: -1});
        }

////////////////////////
        /*     for (let i in _.filter(rides, {finished: 0})) {
         let ride = rides[i];

         let distance = getDistance(auto.x, auto.y, ride.xStart, ride.yStart);
         if (distance === ride.startStep) {
         rides[i].finished = 1;
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