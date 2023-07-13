import React, { useState, useEffect } from "react";
import _ from "lodash";
import styles from "./main.less";
import { Avatar } from "../components/Avatar";
//mport { Centered } from "meteor/empirica:core";
import { HTMLTable } from "@blueprintjs/core";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";
//import { Centered } from "meteor/empirica:core";
// //// Avatar stuff //////
// const names = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""); //for the players names (we will call them A, B, C etc)
const names = ["Red", "Yellow", "Gray", "Blue"]; // for the players names to match avatar color
const avatarNames = ["Colton", "Aaron", "Alex", "Tristan"]; // to do more go to https://jdenticon.com/#icon-D3
const nameColor = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc"]; // similar to the color of the avatar

export function TeamDetails({ previous, next }) {
  function renderPlayer(player, self = false) {
    return (
      <div className="player" key={player.avatar}>
        <Avatar player={player} />
        {/* <span className="name" style={{ color: player.get("nameColor") }}> */}
        <span className="name" style={{ color: player.nameColor }}>
          {player.name}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }
  const game = useGame();
  const treatment = game.get("treatment");
  const playersss = usePlayers();

  const player = {
    id: 0,
    name: names[0],
    nameColor: nameColor[0],
    avatar: avatarNames[0],
  };

  const otherPlayers = [
    {
      id: 1,
      name: names[1],
      nameColor: nameColor[1],
      avatar: avatarNames[1],
    },
    {
      id: 2,
      name: names[2],
      nameColor: nameColor[2],
      avatar: avatarNames[2],
    },
  ];
  return (
    <div className="instructions">
      <h1 className={"bp3-heading"}>You will be part of a team</h1>
      <p>
        In this game, you will{" "}
        <strong>
          play together with {treatment.playerCount - 1} other participants
          (your teammates)
        </strong>
        . They are other MTurk workers who are undertaking the same study
        simultaneously. Throughout all the tasks, the team will submit only one
        answer, and therefore,{" "}
        <strong>all members of the team will receive the same score</strong>. To
        help you identify yourself and differentiate each other in the team, we
        will assign a color to you when the game starts (as shown in the
        following example).
      </p>
      <br />
      <div className="social-interactions" style={{ margin: "auto" }}>
        <div className="status">
          <div className="players bp3-card">
            {renderPlayer(player, true)}
            {otherPlayers.map((p) => renderPlayer(p))}
          </div>
          <div className="total-score bp3-card">
            <h6 className={"bp3-heading"}>Total Score</h6>

            <h2 className={"bp3-heading"}>{3400}</h2>
          </div>
        </div>
      </div>

      <br />
      <p>
        Note that the game allows for simultaneous and real-time actions. That
        means that you will be able to drag students to assign them to rooms
        while your teammates are doing the same. However, when any member in the
        team starts dragging a student, that student will be locked (i.e., no
        one else can move it) until it is assigned to a room.{" "}
        <strong>
          The student that is being moved will have the color of the participant
        </strong>
        .
      </p>

      <Button handleClick={previous} autoFocus>
        <p>Previous</p>
      </Button>

      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
