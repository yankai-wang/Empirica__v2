import {
  usePlayer,
  usePlayers,
  useRound,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React, { useState, useEffect } from "react";
import { JellyBeans } from "./examples/JellyBeans";
import { MineSweeper } from "./examples/MineSweeper";
import { Round } from "./examples/Round"; //round may be keyword in V2? 

export function Stage() {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();

  //console.log('DID THIS STAGE FILE RUN?')
  

  if (player.stage.get("submit")) {
    if (players.length === 1) {
      return <Loading />;
    }

    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player(s).
      </div>
    );
  }
  //console.log(stage.get("task"))
  switch (stage.get("task")) {
    case "jellybeans":
      return <JellyBeans />;
    case "minesweeper":
      return <MineSweeper />;
    case "test":
     return <Round />;
    default:
      return <Round />;
     // return <div>Unknown task</div>;
  }
}