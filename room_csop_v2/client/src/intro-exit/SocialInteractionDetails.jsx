import React, { useState, useEffect } from "react";
import styles from "./main.less";
import { Avatar } from "../components/Avatar";
//mport { Centered } from "meteor/empirica:core";
import { Button } from "../components/Button";
import { FaCheck, FaTimes } from "react-icons/fa";
import "@blueprintjs/core/lib/css/blueprint.css";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";
// const names = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""); //for the players names (we will call them A, B, C etc)
const names = ["Red", "Yellow", "Gray", "Blue"]; // for the players names to match avatar color
const avatarNames = ["Colton", "Aaron", "Alex", "Tristan"]; // to do more go to https://jdenticon.com/#icon-D3
const nameColor = ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc"]; // similar to the color of the avatar

export function SocialInteractionDetails({ previous, next }) {
  const game = useGame();
  const treatment = game.get("treatment");

  const [state, setState] = useState({
    satisfied: false,
  });

  function renderPlayer(player, self = false) {
    return (
      <div className="player" key={player.avatar}>
        <span className="image">
          <span
            className={`satisfied bp3-tag bp3-round ${
              player.satisfied ? "bp3-intent-success" : "bp3-intent-danger"
            }`}
          >
            {player.satisfied && (
              <FaCheck
                style={{
                  color: "green",
                  marginRight: "5px",
                  border: "2px solid green",
                  borderRadius: "50%",
                }}
              />
            )}
            <span
              className={`bp3-icon-standard ${
                player.satisfied ? "bp3-icon-tick" : "bp3-icon-cross"
              }`}
            />
            {!player.satisfied && (
              <FaTimes
                style={{
                  color: "red",
                  marginRight: "5px",
                  border: "2px solid red",
                  borderRadius: "50%",
                }}
              />
            )}
          </span>

          <Avatar player={player} />
        </span>
        {/* <span className="name" style={{ color: player.get("nameColor") }}> */}
        <span className="name" style={{ color: player.nameColor }}>
          {player.name}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }

  function handleSatisfaction(event, satisfied) {
    event.preventDefault();
    console.log("setstate ran");
    setState({ satisfied: satisfied });
  }
  const player = {
    _id: 0,
    name: names[0],
    nameColor: nameColor[0],
    avatar: avatarNames[0],
    satisfied: state.satisfied,
  };

  const otherPlayers = [
    {
      _id: 1,
      name: names[1],
      nameColor: nameColor[1],
      avatar: avatarNames[1],
      satisfied: false,
    },
    {
      _id: 2,
      name: names[2],
      nameColor: nameColor[2],
      avatar: avatarNames[2],
      satisfied: true,
    },
  ];
  return (
    <div className="instructions">
      <h1 className={"bp3-heading"}> Event Logs and In-Game Chat</h1>
      <p>
        We will log every action taken by you or any of your teammates, and this
        log will be shown to you to help you keep track of all the actions that
        have taken place so far.
      </p>

      <p>
        Also, you may communicate with your teammates through the in-game chat.
        This chat room is public so whatever you write will appear to the other{" "}
        {treatment.playerCount - 1} teammates. You can use this in anyway you
        want.
      </p>

      <p>
        Remember, you and your teammates have{" "}
        {Math.ceil(treatment.stageDuration / 60.0)} minutes in each task to find
        a room assignment plan. You will automatically{" "}
        <strong>progress to the next task when the time is up</strong>.
      </p>
      <p>
        However, you can always indicate whether you are satisfied with the
        answer before the timer is up (indicated by the check mark on the
        avatar). Click on the "Satisfied" button in the following example and
        see what happens!
      </p>

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

      <div className="task">
        <div className="board">
          <div className="response">
            <button
              type="button"
              className={`bp3-button bp3-icon-cross bp3-intent-danger bp3-large ${
                state.satisfied ? "bp3-minimal" : ""
              }`}
              onClick={(e) => handleSatisfaction(e, false)}
            >
              Unsatisfied
            </button>
            <button
              type="button"
              className={`bp3-button bp3-icon-tick bp3-intent-success bp3-large ${
                state.satisfied ? "" : "bp3-minimal"
              }`}
              onClick={(e) => handleSatisfaction(e, true)}
            >
              Satisfied
            </button>
          </div>
        </div>
      </div>

      <p>
        <strong>
          If all team members are satisfied with the answer before the timer is
          up, the answer will be submitted and your team will proceed to the
          next task. If the "Satisfied" button is unclickable (i.e., inactive)
          for you for more than 10 seconds, try to refresh the page.
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
