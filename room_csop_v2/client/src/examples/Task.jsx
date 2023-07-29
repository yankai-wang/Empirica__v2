import React, { useState, useEffect } from "react";

import {Room} from "./Room.jsx";
import {Timer} from "../components/Timer";
import { HTMLTable } from "@blueprintjs/core";
import {
  Chat,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
  useStageTimer 
} from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import "@blueprintjs/core/lib/css/blueprint.css";
import { FaCheck, FaTimes } from "react-icons/fa";
//import { TimeSync } from "meteor/mizzao:timesync";
//import moment from "moment";

//console.log(useStageTimer)
//timed_button=useStageTimer();

//console.log(timed_button)

export function Task () {

  const stage = useStage();
  const player = usePlayer();
  const players=usePlayers()
  const game = useGame();

  let stageTime = useStageTimer();


  //This might not be a good method to pass in stagetime
  
  const TimedButton_1 = (props) => {
    const curplayer = props.player
    const onClick = props.onClick
    const activateAt =props.activateAt
   // const remainingSeconds = props.remainingSeconds
    //const disabled = remainingSeconds > activateAt;
    
    
    return (
      <button
        type="button"
        className={`bp3-button bp3-icon-cross bp3-intent-danger bp3-large ${
          curplayer.get("satisfied") ? "bp3-minimal" : "" //Question not sure if individual player will use with the players state change, will test
        }`}
        onClick={onClick}
      //  disabled={disabled}
      >
        Unsatisfied
      </button>
    );
  };


  const TimedButton_2 = (props) => {
    const curplayer = props.player
    const onClick = props.onClick
    const activateAt =props.activateAt
   // const remainingSeconds = props.remainingSeconds
   // const disabled = remainingSeconds > activateAt;

    return (
      <button
        type="button"
        className={`bp3-button bp3-icon-tick bp3-intent-success bp3-large ${
          curplayer.get("satisfied") ? "" : "bp3-minimal"
        }`}
        onClick={props.onClick}
    //    disabled={disabled}
      >
        Satisfied
      </button>
    );
  };




  
  const [activeButton, setActivateButton] = useState({
    activeButton: false});

  useEffect(() => {
    setTimeout(() => setActivateButton({ activeButton: true}), 5000); //we make the satisfied button active after 5 seconds
    if (player.stage.get('submit') )
    {
      setActivateButton({activeButton: false });
    }
  })

  function handleSatisfaction(event,satisfied) {
    
    event.preventDefault();

    if (player.stage.get('submit')) {
      return;
    }

    if (game.get('treatment').playerCount=== 1 && satisfied) {
      setActivateButton({activeButton : false});
    } else {
      //if they are group (or individual that clicked unsatisfied), we want to momentarily disable the button so they don't spam, but they can change their mind so we unlock it after 1.5 seconds
      setActivateButton(false);
      setTimeout(() => setActivateButton({ activeButton : true }), 800); //preventing spam by a groupƒ
    }

    player.set("satisfied", satisfied);// HERE IS THE WHERE THE EMPIRCIA ON WILL RUN
    // check if everyone is satisfied
    const allSatisfied = players.every(p => p.get("satisfied"));
    if (allSatisfied) {
      // submit all players
      players.forEach(p => p.stage.set("submit", true));
    }
    
    const prelog = stage.get("log");

    stage.set("log", prelog.concat({
      verb: "playerSatisfaction",
      subjectId: player.id,
      state: satisfied ? "satisfied" : "unsatisfied"
    }));
    return 
  };


    const task = stage.get("task");
    const violatedConstraints = stage.get("violatedConstraints") || [];
    return (
      <div className="task" >
        <div className="left">
          <div className="info" style={{ margin: "0 auto", width: "90%" }}>
            <Timer stage={stage} />
            <div className="score">
              <h5 className="font-mono text-3xl text-gray-700 font-semibold">Score</h5>

              <h2 className="font-mono text-3xl text-gray-700 font-semibold">{stage.get("score")}</h2>
            </div>
          </div>

          <div className="constraints">
            {stage.name === "practice" ? (
              <p>
                <strong style={{ color: "blue" }}>
                  This is practice round and the Score will not count
                </strong>
              </p>
            ) : (
              ""
            )}
            <h5 className="font-sans text-2xl text-gray-700 font-semibold underline">Constraints</h5>
            <ul>
              {task.constraints.map((constraint) => {
                const failed = violatedConstraints.includes(constraint._id);
                return (
                  <li key={constraint._id} className={failed ? "failed" : ""}>
                    {failed ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <FaTimes
                          style={{
                            color: "red",
                            marginRight: "5px", /* Adjust this margin as needed */
                            border: "2px solid red",
                            borderRadius: "50%",
                          }}
                        />
                        <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
                        {constraint.pair.join(" and ")} {constraint.text}.</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span className="font-sans text-xl text-gray-700" style={{ marginRight: "5px" }} />
                        <span style={{ fontSize: "14px", lineHeight: "1.5"  }}>
                        {constraint.pair.join(" and ")} {constraint.text}.</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="payoff">
            <h5 className="font-sans text-2xl text-gray-700 font-semibold underline">Payoff</h5>
            <div class="border-2 border-black p-4 inline-block">
            <HTMLTable className="bp3-table" style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <th>Rooms</th>
                  {task.rooms.map((room) => (
                    <th key={room}>{room}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {task.students.map((student) => (
                  <tr key={student}>
                    <th>Student {student}</th>
                    {task.rooms.map((room) => (
                      <td
                        className={
                          stage.get(`student-${student}-room`) === room
                            ? "active"
                            : null
                        }
                        key={room}
                      >
                        {task.payoff[student][room]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
            </div>
          </div>
        </div>

        <div className="board">
          <div className="all-rooms">
            <Room
              room="deck"
              isDeck
            />

            <div className="rooms">
              {task.rooms.map((room) => (
                <Room
                  key={room}
                  room={room}
                />
              ))}
            </div>
          </div>

          <div className="response">
            <TimedButton_1
              stage={stage}
              player={player}
              activateAt={game.get('treatment').StageDuration - 5}
             // remainingSeconds= {stagetime.remaining}
              onClick={(e) => handleSatisfaction(e, false)}
            />

            <TimedButton_2
              stage={stage}
              player={player}
              activateAt={game.get('treatment').StageDuration - 5}
             // remainingSeconds= {stagetime.remaining}
              onClick={(e) => handleSatisfaction(e, true)}
            />

          </div>
        </div>
      </div>
    );
  }

