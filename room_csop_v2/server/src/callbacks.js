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
  );

  //initiate the cumulative score for this game (because everyone will have the same score, we can save it at the game object
  game.set("cumulativeScore", 0); // the total score at the end of the game
  game.set("nOptimalSolutions", 0); // will count how many times they've got the optimal answer
  game.set("justStarted", true); // I use this to play the sound on the UI when the game starts
  game.set("team", game.players.length > 1);

  //we don't know the sequence yet
  let taskSequence = game.treatment.stepOne ? stepOneData : stepTwoData;

  if (game.treatment.shuffleTaskOrder) {
    //TODO: I need to make sure that I keep the first task fixed (if it has training)
    //taskSequence = _.shuffle(taskSequence); //this is full shuffle
    taskSequence = customShuffle(taskSequence); //this is with keeping the first practice round fixed
  }

  //we'll have 1 round, each task is one stage
  _.times(taskSequence.length, i => {
    const stage = round.addStage({
      name: i === 0 ? "practice" : i,
      displayName: taskSequence[i].difficulty,
      durationInSeconds: game.treatment.stageDuration
    });
    stage.set("task", taskSequence[i]);
  });

  /// END OF MAIN.JS CODE 


  players.forEach((player, i) => {
    player.set("name", names[i]);
    player.set("avatar", `https://api.dicebear.com/6.x/identicon/svg?seed=${avatarNames[i]}`);
    player.set("nameColor", nameColor[i]);
    player.set("cumulativeScore", 0);
    player.set("bonus", 0);
  });



  const round = game.addRound({
    name: "Round 1 - Jelly Beans",
    task: "jellybeans",
  });
  round.addStage({ name: "Answer", duration: 300 });
  round.addStage({ name: "Result", duration: 120 });

  const round2 = game.addRound({
    name: "Round 2 - roomassignment ",
    task: "test",
  });
  round2.addStage({ name: "Play", duration: 3000 });




});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({game, stage }) => {
  const players = stage.currentGame.players
  console.debug("Round ", stage.name, "game", stage.currentGame.id, " started");
  const team = stage.currentGame.get("team");
  console.log("is it team?", team);

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

  const task = stage.get("task");// Changed this to rounds
  task.students.forEach((student) => {
    stage.set(`student-${student}-room`, "deck");
    stage.set(`student-${student}-dragger`, null);
  });

  players.forEach((player) => {
    player.set("satisfied", false);
  });

  //there is a case where the optimal is found, but not submitted (i.e., they ruin things)
  stage.set("optimalFound", false); //the optimal answer wasn't found
  stage.set("optimalSubmitted", false); //the optimal answer wasn't submitted

});

Empirica.onStageEnded(({ stage }) => {
  calculateJellyBeansScore(stage);
});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});

// Note: this is not the actual number of beans in the pile, it's a guess...
const jellyBeansCount = 634;

function calculateJellyBeansScore(stage) {
  if (
    stage.get("name") !== "Answer" ||
    stage.round.get("task") !== "jellybeans"
  ) {
    return;
  }

  for (const player of stage.currentGame.players) {
    let roundScore = 0;

    const playerGuess = player.round.get("guess");

    if (playerGuess) {
      const deviation = Math.abs(playerGuess - jellyBeansCount);
      const score = Math.round((1 - deviation / jellyBeansCount) * 10);
      roundScore = Math.max(0, score);
    }

    player.round.set("score", roundScore);

    const totalScore = player.get("score") || 0;
    player.set("score", totalScore + roundScore);
  }
}
