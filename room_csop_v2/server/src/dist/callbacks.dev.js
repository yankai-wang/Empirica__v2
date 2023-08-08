"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Empirica = void 0;

var _classic = require("@empirica/core/admin/classic");

var _constants = require("./constants");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Empirica = new _classic.ClassicListenersCollector();
exports.Empirica = Empirica;

///FUNCTIONS:
function customShuffle(taskSequence) {
  // Find and remove first and last:
  var practiceTask = taskSequence[0];
  var firstIndex = taskSequence.indexOf(practiceTask);

  if (firstIndex !== -1) {
    taskSequence.splice(firstIndex, 1);
  } // Normal shuffle with the remaining elements using ES6:


  for (var i = taskSequence.length - 1; i > 0; --i) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [taskSequence[j], taskSequence[i]];
    taskSequence[i] = _ref[0];
    taskSequence[j] = _ref[1];
  } // Add them back in their new position:


  if (firstIndex !== -1) {
    taskSequence.unshift(practiceTask);
  }

  return taskSequence;
}

function custom_ordering(add_drop_list, length_stage, player_count) {
  var game_drop_array = [];

  for (var i = 0; i < add_drop_list.length; i++) {
    var booleanArray = Array(player_count).fill(true);
    var k = 0;

    if (add_drop_list[i] >= player_count) {
      throw "You are dropping too many players";
    }

    while (k < add_drop_list[i]) {
      var rand_loc = Math.floor(Math.random() * player_count);

      if (booleanArray[rand_loc] != false) {
        booleanArray[rand_loc] = false;
        k++;
      }
    } //console.log(booleanArray)


    game_drop_array.push(booleanArray);
  }

  return game_drop_array;
}

Empirica.onGameStart(function (_ref2) {
  var game = _ref2.game;
  console.log("Game Start Ran");
  var players = game.players;
  var treatment = game.get('treatment'); // console.log(players)

  var names = ["Blue", "Green", "Pink", "Yellow", "Purple", "Red", "Turqoise", "Gold", "Grey", "Magenta"]; // for the players names to match avatar color

  var avatarNames = ["Colton", "Aaron", "Alex", "Tristan", "Daniel", "Jill", "Jimmy", "Adam", "Flynn", "Annalise"]; // to do more go to https://jdenticon.com/#icon-D3

  var nameColor = ["#3D50B7", "#70A945", "#DE8AAB", "#A59144", "#DER5F4", "#EB8TWV", "#N0WFA4", "#TP3BWU", "#QW7MI9", "#EB8TWj"]; // similar to the color of the avatar
  /// ADDING IN THE MAIN.jS Code 

  console.log("Game with a treatment: ", treatment, " will start, with workers" // _.pluck(game.players, "id")
  ); //initiate the cumulative score for this game (because everyone will have the same score, we can save it at the game object

  game.set("cumul=ativeScore", 0); // the total score at the end of the game

  game.set("nOptimalSolutions", 0); // will count how many times they've got the optimal answer

  game.set("justStarted", true); // I use this to play the sound on the UI when the game starts

  game.set("team", game.players.length > 1); //we don't know the sequence yet

  var taskSequence = game.get('treatment').stepOne ? _constants.stepOneData : _constants.stepTwoData;

  if (game.get('treatment').shuffleTaskOrder) {
    //TODO: I need to make sure that I keep the first task fixed (if it has training)
    //taskSequence = _.shuffle(taskSequence); //this is full shuffle
    taskSequence = customShuffle(taskSequence); //this is with keeping the first practice round fixed
  } //we'll have 1 round, each task is one stage


  var round = game.addRound();
  console.log('GAME STARTED');
  var drop_array = custom_ordering(treatment['AddDropList'], taskSequence.length, players.length);

  _lodash["default"].times(taskSequence.length, function (i) {
    console.log(i === 0 ? "practice" : i);
    console.log(taskSequence[i].difficulty);
    console.log(game.get('treatment').StageDuration);
    var stage = round.addStage({
      name: i === 0 ? "practice" : i,
      displayName: taskSequence[i].difficulty,
      duration: game.get('treatment').StageDuration
    });
    stage.set("task", taskSequence[i]);
    console.log(drop_array[i]);
    stage.set('DropList', drop_array[i]);
  }); //const starting_pos=[true,false,true]


  players.forEach(function (player, i) {
    player.set("name", names[i]);
    player.set("avatar", "/avatars/jdenticon/".concat(avatarNames[i]));
    player.set("nameColor", nameColor[i]);
    player.set("cumulativeScore", 0);
    player.set("bonus", 0); // player.set('jefftestcondition', starting_pos[i]);
  });
});
Empirica.onRoundStart(function (_ref3) {
  var round = _ref3.round;
});
Empirica.onStageStart(function (_ref4) {
  var stage = _ref4.stage;
  var players = stage.currentGame.players; //console.log(players)
  //console.log("Round ", stage.name, "game", stage.currentGame.id, " started");

  var team = stage.currentGame.get("team");
  var player_drops = stage.get('DropList');
  console.log(player_drops); //console.log("is it team?", team);
  //initiate the score for this round (because everyone will have the same score, we can save it at the round object

  stage.set("score", 0);
  stage.set("chat", []); //todo: I need to check if they are in team first

  stage.set("log", [{
    verb: "roundStarted",
    roundId: stage.name === "practice" ? stage.name + " (will not count towards your score)" : stage.name,
    at: new Date()
  }]);
  stage.set("intermediateSolutions", []); //Puts the icons on the deck at the beginning of each stage 

  var task = stage.get("task");
  task.students.forEach(function (student) {
    stage.set("student-".concat(student, "-room"), "deck");
    stage.set("student-".concat(student, "-dragger"), null);
  }); //Determines which player(s) are going to get dropped this round

  players.forEach(function (player, i) {
    console.log(player_drops[i]);
    player.set("dropcondition", player_drops[i]);
  }); // Makes sure each player starts in unsatified

  players.forEach(function (player) {
    player.set("satisfied", false);
  }); //there is a case where the optimal is found, but not submitted (i.e., they ruin things)

  stage.set("optimalFound", false); //the optimal answer wasn't found

  stage.set("optimalSubmitted", false); //the optimal answer wasn't submitted
});
Empirica.onStageEnded(function (_ref5) {
  var stage = _ref5.stage;
  console.debug("Round ", stage.name, "game", stage.currentGame.id, " ended");
  var currentScore = stage.get("score");
  var optimalScore = stage.get("task").optimal;

  if (currentScore === optimalScore) {
    if (stage.name !== "practice") {
      stage.currentGame.set("nOptimalSolutions", stage.currentGame.get("nOptimalSolutions") + 1);
    }

    stage.set("optimalSubmitted", true);
    console.log("You found the optimal");
  } //add the round score to the game total cumulative score (only if it is not practice)


  if (stage.name !== "practice") {
    var cumScore = stage.currentGame.get("cumulativeScore") || 0;
    var scoreIncrement = currentScore > 0 ? Math.round(currentScore) : 0;
    stage.currentGame.set("cumulativeScore", Math.round(scoreIncrement + cumScore));
  }
});
Empirica.onRoundEnded(function (_ref6) {
  var round = _ref6.round;
});
Empirica.onGameEnded(function (_ref7) {
  var game = _ref7.game;
  var players = game.players;
  console.debug("The game", game.id, "has ended"); //computing the bonus for everyone (in this game, everyone will get the same value)

  var conversionRate = game.get('treatment').conversionRate ? game.get('treatment').conversionRate : 1;
  var optimalSolutionBonus = game.get('treatment').optimalSolutionBonus ? game.get('treatment').optimalSolutionBonus : 0;
  var bonus = game.get("cumulativeScore") > 0 ? (game.get("cumulativeScore") * conversionRate + game.get("nOptimalSolutions") * optimalSolutionBonus).toFixed(2) : 0;
  players.forEach(function (player) {
    if (player.get("bonus") === 0) {
      //if we never computed their bonus
      player.set("bonus", bonus);
      player.set("cumulativeScore", game.get("cumulativeScore"));
    }
  });
}); // Note: this is not the actual number of beans in the pile, it's a guess...

Empirica.on("stage", "studentMoved", function (ctx, _ref8) {
  var stage = _ref8.stage,
      studentMoved = _ref8.studentMoved;
  if (!studentMoved) return; // const task = stage.get("task");
  // let assignments = { deck: [] };
  // task.rooms.forEach((room) => {
  //   assignments[room] = [];
  // });
  // //find the rooms for each player
  // task.students.forEach((student) => {
  //   const room = stage.get(`student-${student}-room`);
  //   assignments[room].push(student);
  // });

  var task = studentMoved.task,
      assignments = studentMoved.assignments,
      preIS = studentMoved.preIS; // console.log("assignments", assignments);
  //get score if there are no violations, otherwise, the score is 0

  var violationIds = getViolations(stage, assignments, task);
  stage.set("violatedConstraints", violationIds);
  var currentScore = assignments["deck"].length === 0 ? getScore(task, assignments, violationIds.length) : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  } // const preIS= stage.get('intermediateSolutions')


  stage.set("intermediateSolutions", preIS.concat({
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore
  }));
  stage.set("studentMoved", null);
});

function getScore(task, assignments, nViolations) {
  var score = 0;
  Object.keys(assignments).forEach(function (room) {
    assignments[room].forEach(function (student) {
      score += task.payoff[student][room];
    });
  });
  return score - nViolations * 100;
}

function find_room(assignments, student) {
  return Object.keys(assignments).find(function (room) {
    return assignments[room].includes(student);
  });
}

function getViolations(stage, assignments, task) {
  // console.debug("assignments ", assignments);
  // const task = stage.get("task");
  var violatedConstraintsIds = [];
  task.constraints.forEach(function (constraint) {
    var firstStudentRoom = find_room(assignments, constraint.pair[0]);
    var secondStudentRoom = find_room(assignments, constraint.pair[1]);

    if (firstStudentRoom !== "deck" && secondStudentRoom !== "deck") {
      switch (constraint.type) {
        case 0:
          //they are not in the same room, when they should've
          if (firstStudentRoom !== secondStudentRoom) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "they are not in the same room, when they should've"
            // );
            violatedConstraintsIds.push(constraint._id);
          }

          break;

        case 1:
          //they are in the same room, when they shouldn't
          if (firstStudentRoom === secondStudentRoom) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "they are in the same room, when they shouldn't"
            // );
            violatedConstraintsIds.push(constraint._id);
          }

          break;

        case 2:
          //if they are not neighbors, when they should've been
          if (Math.abs(firstStudentRoom - secondStudentRoom) !== 1) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "they are not neighbors, when they should've been"
            // );
            violatedConstraintsIds.push(constraint._id);
          }

          break;

        case 3:
          if (Math.abs(firstStudentRoom - secondStudentRoom) < 2) {
            // console.debug(
            //   constraint.pair.join(" and "),
            //   "can't live in the same room or be neighbors, so why are they?"
            // );
            violatedConstraintsIds.push(constraint._id);
          }

          break;
      }
    }
  });
  return violatedConstraintsIds;
}