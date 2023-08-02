import React, { useState, useEffect } from "react";

import {SocialInteractions} from "./SocialInteractions";
import {Task} from "./Task";
import {
  Chat,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";
import { JellyBeans } from "../examples/JellyBeans";

//const roundSound = new Audio("./experiment/round-sound.mp3");
//const gameSound = new Audio("./experiment/bell.mp3");

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
  // return different things depending on 

  return (
    <div className="round">
      {player.get("dropcondition") && <Task />}
      {!player.get("dropcondition") && <JellyBeans />}
      {/*game.player.length is a better check for social interaction than 'game.treatment.playerCount > 1' because of the lobby --> ignor settings*/}
      {player.get("treatment").playerCount > 1 ? (
        <SocialInteractions  />
      ) : null}
    </div>
  );
}
