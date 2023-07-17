import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const round = game.addRound({
    name: "Round 1 - Jelly Beans",
    task: "jellybeans",
  });
  round.addStage({ name: "Answer", duration: 300 });
  round.addStage({ name: "Result", duration: 120 });

  const round2 = game.addRound({
    name: "Round 2 - Room_assignment",
    task: "minesweeper",
  });
  round2.addStage({ name: "Play", duration: 3000 });
});

<<<<<<< HEAD
<<<<<<< HEAD
Empirica.onRoundStart(({ round }) => {
  //Idea 1 we could potentially send a random player to the end of the round 
});




// Empirica.onStageStart(({ game, stage }) => {
Empirica.onStageStart(({ stage }) => {
//roomgame(stage)
// const players = game.get('treatment')['playerCount'];
// console.log('CAN I SEE THIS stage',players)
// console.debug("Round ", stage.name, "game", game.id, " started");
// const team = game.get("team");
// console.log("is it team?", team);

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

const task = stage.get("task");
task.students.forEach((student) => {
  stage.set(`student-${student}-room`, "deck");
  stage.set(`student-${student}-dragger`, null);
});

players.forEach((player) => {
  player.set("satisfied", false);
});

//there is a case where the optimal is found, but not submitted (i.e., they ruin things)
stage.set("optimalFound", false); //the optimal answer wasn't found
stage.set("optimalSubmitted", false);

});

Empirica.onStageEnded(({ game,stage,round }) => {
  /*
  console.debug("Round ", stage.name, "game", game._id, " ended");

  const currentScore = stage.get("score");
  const optimalScore = stage.get("task").optimal;

  if (currentScore === optimalScore) {
    if (stage.name !== "practice") {
      game.set("nOptimalSolutions", game.get("nOptimalSolutions") + 1);
    }
    stage.set("optimalSubmitted", true);
    console.log("You found the optimal");
  }

  //add the round score to the game total cumulative score (only if it is not practice)
  if (stage.name !== "practice") {
    const cumScore = game.get("cumulativeScore") || 0;
    const scoreIncrement = currentScore > 0 ? Math.round(currentScore) : 0;
    game.set("cumulativeScore", Math.round(scoreIncrement + cumScore));
  }

*/
=======
Empirica.onRoundStart(({ round }) => {});
>>>>>>> 987a5f9d (Updating intro branch to main)
=======
Empirica.onRoundStart(({ round }) => {});
>>>>>>> main

Empirica.onStageStart(({ stage }) => {});

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
