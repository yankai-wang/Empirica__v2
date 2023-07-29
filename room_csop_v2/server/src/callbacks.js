import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import { stepOneData, stepTwoData } from "./constants";
import _ from "lodash";




///FUNCTIONS:

function customShuffle(taskSequence) {
  // Find and remove first and last:
  const practiceTask = taskSequence[0];

  const firstIndex = taskSequence.indexOf(practiceTask);

  if (firstIndex !== -1) {
    taskSequence.splice(firstIndex, 1);
  }

  // Normal shuffle with the remaining elements using ES6:
  for (let i = taskSequence.length - 1; i > 0; --i) {
    const j = Math.floor(Math.random() * (i + 1));

    [taskSequence[i], taskSequence[j]] = [taskSequence[j], taskSequence[i]];
  }

  // Add them back in their new position:
  if (firstIndex !== -1) {
    taskSequence.unshift(practiceTask);
  }

  return taskSequence;
}



Empirica.onGameStart(({ game }) => {
  
  
  console.log("Game Start Ran")
  const players = game.players
  const treatment = game.get('treatment')
 // console.log(players)
  const names = [
    "Blue",
    "Green",
    "Pink",
    "Yellow",
    "Purple",
    "Red",
    "Turqoise",
    "Gold",
    "Grey",
    "Magenta",
  ]; // for the players names to match avatar color
  const avatarNames = [
    "Colton",
    "Aaron",
    "Alex",
    "Tristan",
    "Daniel",
    "Jill",
    "Jimmy",
    "Adam",
    "Flynn",
    "Annalise",
  ]; // to do more go to https://jdenticon.com/#icon-D3
  const nameColor = [
    "#3D50B7",
    "#70A945",
    "#DE8AAB",
    "#A59144",
    "#DER5F4",
    "#EB8TWV",
    "#N0WFA4",
    "#TP3BWU",
    "#QW7MI9",
    "#EB8TWj",
  ]; // similar to the color of the avatar


  /// ADDING IN THE MAIN.jS Code 

  console.log(
    "Game with a treatment: ",
    treatment,
    " will start, with workers",
   // _.pluck(game.players, "id")
  );

  //initiate the cumulative score for this game (because everyone will have the same score, we can save it at the game object
  game.set("cumul=ativeScore", 0); // the total score at the end of the game
  game.set("nOptimalSolutions", 0); // will count how many times they've got the optimal answer
  game.set("justStarted", true); // I use this to play the sound on the UI when the game starts
  game.set("team", game.players.length > 1);
  


  //we don't know the sequence yet
  let taskSequence = game.get('treatment').stepOne ? stepOneData : stepTwoData;

  if (game.get('treatment').shuffleTaskOrder) {
    //TODO: I need to make sure that I keep the first task fixed (if it has training)
    //taskSequence = _.shuffle(taskSequence); //this is full shuffle
    taskSequence = customShuffle(taskSequence); //this is with keeping the first practice round fixed
  }

  //we'll have 1 round, each task is one stage

  const round = game.addRound();

  _.times(taskSequence.length, i => {
    console.log(i === 0 ? "practice" : i)
    console.log(taskSequence[i].difficulty)
    console.log(game.get('treatment').StageDuration)
    const stage = round.addStage({
      name: i === 0 ? "practice" : i,
      displayName: taskSequence[i].difficulty,
      duration: game.get('treatment').StageDuration
    });
    stage.set("task", taskSequence[i]);
  });

 

  players.forEach((player, i) => {
    player.set("name", names[i]);
    player.set("avatar", `/avatars/jdenticon/${avatarNames[i]}`);
    player.set("nameColor", nameColor[i]);
    player.set("cumulativeScore", 0);
    player.set("bonus", 0);
  });
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({stage}) => {
  const players = stage.currentGame.players
  //console.log(stage)
  //console.debug("Round ", stage.name, "game", stage.currentGame.id, " started");
  const team = stage.currentGame.get("team");
  //console.log("is it team?", team);

  //initiate the score for this round (because everyone will have the same score, we can save it at the round object
  stage.set("score", 0);
  stage.set("chat", []); //todo: I need to check if they are in team first
  stage.set("log", [
    {
      verb: "roundStarted",
      roundId:
        stage.name === "practice"
          ? stage.name + " (will not count towards your score)"
          : stage.name,
      at: new Date(),
    },
  ]);
  stage.set("intermediateSolutions", []);

  //Puts the icons on the deck at the beginning of each stage 
  const task = stage.get("task");// Changed this to rounds
  task.students.forEach((student) => {
    stage.set(`student-${student}-room`, "deck");
    stage.set(`student-${student}-dragger`, null);
  });

  // Makes sure each player starts in unsatified
  players.forEach((player) => {
    player.set("satisfied", false);
  });

  //there is a case where the optimal is found, but not submitted (i.e., they ruin things)
  stage.set("optimalFound", false); //the optimal answer wasn't found
  stage.set("optimalSubmitted", false); //the optimal answer wasn't submitted

});

Empirica.onStageEnded(({ stage }) => {
  console.debug("Round ", stage.name, "game", stage.currentGame.id, " ended");

  const currentScore = stage.get("score");
  const optimalScore = stage.get("task").optimal;

  if (currentScore === optimalScore) {
    if (stage.name !== "practice") {
      stage.currentGame.set("nOptimalSolutions", stage.currentGame.get("nOptimalSolutions") + 1);
    }
    stage.set("optimalSubmitted", true);
    console.log("You found the optimal");
  }

  //add the round score to the game total cumulative score (only if it is not practice)
  if (stage.name !== "practice") {
    const cumScore = stage.currentGame.get("cumulativeScore") || 0;
    const scoreIncrement = currentScore > 0 ? Math.round(currentScore) : 0;
    stage.currentGame.set("cumulativeScore", Math.round(scoreIncrement + cumScore));
  }
  
});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => { 
  const players = game.players;
  console.debug("The game", game.id, "has ended");
  //computing the bonus for everyone (in this game, everyone will get the same value)
  const conversionRate = game.get('treatment').conversionRate
    ? game.get('treatment').conversionRate
    : 1;

  const optimalSolutionBonus = game.get('treatment').optimalSolutionBonus
    ? game.get('treatment').optimalSolutionBonus
    : 0;

  const bonus =
    game.get("cumulativeScore") > 0
      ? (
          game.get("cumulativeScore") * conversionRate +
          game.get("nOptimalSolutions") * optimalSolutionBonus
        ).toFixed(2)
      : 0;

  players.forEach((player) => {
    if (player.get("bonus") === 0) {
      //if we never computed their bonus
      player.set("bonus", bonus);
      player.set("cumulativeScore", game.get("cumulativeScore"));
    }
  });});

// Note: this is not the actual number of beans in the pile, it's a guess...


// Empirica.on("player","satisfied",(ctx,{player,satisfied}) => {
//  // console.log("current game" + player.currentGame.players);
//  // console.log('Current Stage' + player.currentStage)
//  console.log("satisfied change detected")
// //  console.log(player.currentGame)
//  if(player.currentGame === undefined)
//  {
//    return
//  }
//   const players = player.currentGame.players;


//   if (satisfied === true) {
//    console.log('The satisfaction is satisfied')
//     //check if everyone is satisfied and if so, submit their answer
//     let allSatisfied = true;
//     players.forEach((player) => {
//       console.log("player" +  player.get("nameColor") + "is satisfied:" + player.get("satisfied"));
//       allSatisfied = player.get("satisfied") && allSatisfied;
//     });
//     console.log(allSatisfied);
//     if (allSatisfied) {
//      console.log('DOES THIS RUN')
//       players.forEach((player) => {
//         // player.stage.set("submit", true);
//         console.log("player" +  player.get("nameColor") + "set satisfied");
//       });
//     }
//     return;
//   }
// });

//THERE IS A MUCH BETTER WAY TO DO THIS CURRENTLY BLANKING


Empirica.on("stage", 'student-A-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-B-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-C-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-D-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-E-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-F-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-G-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-H-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-I-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-J-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-K-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-L-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-M-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-N-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-O-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-P-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-Q-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

Empirica.on("stage", 'student-R-room' ,(ctx,{stage,room}) => 
{
  const task = stage.get("task");
  let assignments = { deck: [] };
  task.rooms.forEach((room) => {
    assignments[room] = [];
  });
  task.students.forEach((student) => {
    const room = stage.get(`student-${student}-room`);
    assignments[room].push(student);
  });

  const violationIds = getViolations(stage, assignments);
  stage.set("violatedConstraints", violationIds);
  const currentScore =
    assignments["deck"].length === 0
    ? getScore(task, assignments, violationIds.length)
      : 0;
  stage.set("score", currentScore || 0);

  if (currentScore === task.optimal) {
    stage.set("optimalFound", true);
  }
  const preIS= stage.get('intermediateSolutions')
  stage.set("intermediateSolutions",preIS.concat( {
    solution: assignments,
    at: new Date(),
    violatedConstraintsIds: violationIds,
    nConstraintsViolated: violationIds.length,
    score: getScore(task, assignments, violationIds.length),
    optimalFound: currentScore === task.optimal,
    completeSolution: assignments["deck"].length === 0,
    completeSolutionScore: currentScore,
  }));
}
)

































function getScore(task, assignments, nViolations) {
  let score = 0;
  Object.keys(assignments).forEach((room) => {
    assignments[room].forEach((student) => {
      score += task.payoff[student][room];
    });
  });
  return score - nViolations * 100;
}

function find_room(assignments, student) {
  return Object.keys(assignments).find((room) =>
    assignments[room].includes(student)
  );
}

function getViolations(stage, assignments) {
  // console.debug("assignments ", assignments);
  const task = stage.get("task");
  const violatedConstraintsIds = [];

  task.constraints.forEach((constraint) => {
    const firstStudentRoom = find_room(assignments, constraint.pair[0]);
    const secondStudentRoom = find_room(assignments, constraint.pair[1]);

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