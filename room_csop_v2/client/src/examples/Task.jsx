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
//import { TimeSync } from "meteor/mizzao:timesync";
//import moment from "moment";

//console.log(useStageTimer)
//timed_button=useStageTimer();

//console.log(timed_button)

export function Task () {

  const stage = useStage();
  const player = usePlayer();
  const game = useGame();
  const stagetime= useStageTimer();
  //console.log('THIS WORKED???????')
 // console.log(stage)
  //console.log(stage.scope)
  //console.log(game)
  //console.log(stagetime)


  //This might not be a good method to pass in stagetime
  
  const TimedButton_1 = (props) => {
    const curplayer = props.player
    const onClick = props.onClick
    const activateAt =props.activateAt
    const remainingSeconds = props.remainingSeconds
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
    const remainingSeconds = props.remainingSeconds
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

  function handleSatisfaction(event,satisfied,game,stage,player) {
    
    
    event.preventDefault();
    //if everyone submitted then, there is nothing to handle

    if (player.stage.get('submit')) {
      return;
    }
    console.log(event)
    console.log(satisfied)
    console.log(game.get('treatment'))
    console.log(stage)
    //if it is only one player, and satisfied, we want to lock everything
    if (game.get('treatment').playerCount=== 1 && satisfied) {
      setActivateButton({activeButton : false});
    } else {
      //if they are group (or individual that clicked unsatisfied), we want to momentarily disable the button so they don't spam, but they can change their mind so we unlock it after 1.5 seconds
      setActivateButton(false);
      setTimeout(() => setActivateButton({ activeButton : true }), 800); //preventing spam by a groupƒ
    }


    player.set("satisfied", satisfied);

    // THis looks like its going to log some meta data
    /*stage.append("log", {
      verb: "playerSatisfaction",
      subjectId: player.id,
      state: satisfied ? "satisfied" : "unsatisfied",
      // at: new Date()
      //at: moment(TimeSync.serverTime(null, 1000)),
    }); */
   // console.log("task moment", moment(TimeSync.serverTime(null, 1000)));
  };

  
    //const { game, stage, player } = this.props;
    const task = stage.get("task");
    const violatedConstraints = stage.get("violatedConstraints") || [];
    //console.log('TASK')
    //console.log(task)

    return (
      <div className="task">
        <div className="left">
          <div className="info">
            <Timer stage={stage} />
            <div className="score">
              <h5 className="bp3-heading">Score</h5>

              <h2 className="bp3-heading">{stage.get("score")}</h2>
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
            <h5 className="bp3-heading">Constraints</h5>
            <ul>
              {task.constraints.map((constraint) => {
                const failed = violatedConstraints.includes(constraint._id);
                return (
                  <li key={constraint._id} className={failed ? "failed" : ""}>
                    {failed ? (
                      <span className="bp3-icon-standard bp3-icon-cross" />
                    ) : (
                      <span className="bp3-icon-standard bp3-icon-dot" />
                    )}
                    {constraint.pair.join(" and ")} {constraint.text}.
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="payoff">
            <h5 className="bp3-heading">Payoff</h5>
            <HTMLTable className="bp3-table">
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
              remainingSeconds= {stagetime.remaining}
              onClick={(e) => handleSatisfaction(e, false,game,stage,player)}
            />

            <TimedButton_2
              stage={stage}
              player={player}
              activateAt={game.get('treatment').StageDuration - 5}
              remainingSeconds= {stagetime.remaining}
              onClick={(e) => handleSatisfaction(e, true,game, stage,player)}
            />

            {/* <button
                type="button"
                className={`bp3-button bp3-icon-cross bp3-intent-danger bp3-large ${
                  player.get("satisfied") ? "bp3-minimal" : ""
                }`}
                onClick={this.handleSatisfaction.bind(this, false)}
                disabled={!this.state.activeButton}
              >
                Unsatisfied
              </button>
            <button
              type="button"
              className={`bp3-button bp3-icon-tick bp3-intent-success bp3-large ${
                player.get("satisfied") ? "" : "bp3-minimal"
              }`}
              onClick={this.handleSatisfaction.bind(this, true)}
              disabled={!this.state.activeButton}
            >
              Satisfied
            </button> */}
          </div>
        </div>
      </div>
    );
  }

