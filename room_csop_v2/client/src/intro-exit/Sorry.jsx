import React from "react";

// import {Centered} from "meteor/empirica:core";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function Sorry () {
  const player = usePlayer();

  let msg;
  switch (player.get("ended")) {
    case "no more games":
      msg = "All games you are eligible for have filled up too fast...";
      break;
    case "lobby timed out":
      msg = "There were NOT enough players for the game to start..";
      break;
    // case "playerLobbyTimedOut":
    //   msg = "???";
    //   break;
    // case "playerEndedLobbyWait":
    //   msg =
    //     "You decided to stop waiting, we are sorry it was too long a wait.";
    //   break;
    default:
      msg = "Unfortunately the Game was cancelled...";
      break;
  }

  return (
    // <Centered>
      <div className="score">
        <h1>Sorry!</h1>

        <p>Sorry, you were not able to play today! {msg}</p>

        {/* {player.exitStatus === "gameLobbyTimedOut" ? ( */}
        {player.get("ended") === "lobby timed out" ? (
          <p>
            Please submit <em>{player._id}</em> as the survey code in order to
            receive the $1 base payment for your time today. We will also add
            $0.1 showing-up bonus with the approval of this HIT.
          </p>
        ) : null}

        {/* {player.exitStatus === "gameFull" ? ( */}
        {player.get("ended") === "no more games" ? (
          <p>
            Please submit <em>FZgameFullCSOP213093</em> as the survey code in
            order to receive the $0.1 showing up bonus.
          </p>
        ) : null}

      </div>
    // </Centered>
  );

}
