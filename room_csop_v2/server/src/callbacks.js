import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const players=game.players
  console.log(game.get('treatment'))
  console.log("CAN I SEE THIS maybe") 
  const round = game.addRound({
    name: "Round 1 - Jelly Beans",
    task: "jellybeans", 
  });
  round.addStage({ name: "Game", duration: 300 });
  round.addStage({ name: "Result", duration: 120 });

  const round2 = game.addRound({
    name: "Round 2 - Minesweeper",
    task: "minesweeper",
  });
  round2.addStage({ name: "Play", duration: 300 }); 
});

Empirica.onRoundStart(({ round }) => {});




Empirica.onStageStart(({ game, stage }) => {
//roomgame(stage)
const players = game.players;
console.log('CAN I SEE THIS stage',players)
console.debug("Round ", stage.name, "game", game.id, " started");
const team = game.get("team");
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


});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {

  /*const players = game.players;
  console.debug("The game", game._id, "has ended");
  //computing the bonus for everyone (in this game, everyone will get the same value)
  const conversionRate = game.treatment.conversionRate
    ? game.treatment.conversionRate
    : 1;

  const optimalSolutionBonus = game.treatment.optimalSolutionBonus
    ? game.treatment.optimalSolutionBonus
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
  });*/
});

// Note: this is not the actual number of beans in the pile, it's a guess...
/*
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
} */

//helpers 
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
