
//import { TimeSync } from "meteor/mizzao:timesync";
//import moment from "moment";
import React, { useState, useEffect } from "react";
import {
  Chat,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";


export function UnitStudent ({ student }) {
  
  function handleDragStart (e) {
    e.dataTransfer.setData("text/plain", student);
  };

    const stage = useStage();
    const player = usePlayer();
    const players = usePlayers();
    const game = useGame();

    return (
      <div
        draggable={true}
        onDragStart={(e) => handleDragStart(e)}
        className="student"
        style={{ cursor: "move" }}
      >
        {/* <span className="icon bp3-icon-standard bp3-icon-person" /> */}
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
            <path
              d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"
            />
          </svg>
        </span>
        <span className="letter">{student}</span>
      </div>
    );
  }

