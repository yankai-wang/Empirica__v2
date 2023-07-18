import React from "react";

//import SocialInteractions from "./SocialInteractions.jsx";
import Task from "./Task";
import {
  Chat,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

const roundSound = new Audio("experiment/round-sound.mp3");
const gameSound = new Audio("experiment/bell.mp3");

export function Round() {
  /* componentDidMount() {
    const { game } = this.props;
    if (game.get("justStarted")) {
      //play the bell sound only once when the game starts
      gameSound.play();
      game.set("justStarted", false);
    } else {
      roundSound.play();
    }
  } */
  const stage = useStage();
  const player = usePlayer();
  const game = useGame();

  return (
    <div className="round">
      <Task />
      {/*game.player.length is a better check for social interaction than 'game.treatment.playerCount > 1' because of the lobby --> ignor settings*/}
      {game.players.length > 1 ? (
      //  <SocialInteractions game={game} stage={stage} player={player} />
      <div hi />
      ) : null}
    </div>
  );
}
