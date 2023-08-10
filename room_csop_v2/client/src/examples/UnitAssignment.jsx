import React, { useState, useEffect } from "react";

import {Unit} from "./Unit.jsx";
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

export function UnitAssignment () {

  const stage = useStage();
  const player = usePlayer();
  const players=usePlayers()
  const game = useGame();
  const round = useRound();
  const task = stage.get("task");

  function handleSubmit(e) {
    // get the units of all players in an array and if some player is not assigned, return
    if (players.map((player) => player.get("unit")).includes("deck")) {
      alert("Please assign all players to a unit before submitting.");
      e.preventDefault();
      return;
    }

    // if there's empty unit, return
    const curdivision = stage.get("division");
    if (Object.keys(curdivision).map((key) => curdivision[key].length).includes(0)) {
      alert("Please assign at least one student to each unit before submitting.");
      // should we alert them not all students are assigned to at least one unit?
      e.preventDefault();
      return;
    }

    // record the units of all players
    const playerUnits = players.map((player) => (
      {
        [player.id]: player.get("unit")
      }
    ));
    stage.set("playerUnits", playerUnits);
    stage.set("unitAssigned", true);
  }


  function handleAddUnit() {
    const curdivision = stage.get("division");
    const newIndex = Object.keys(curdivision).length;
    
    const newdivision = { ...curdivision, [newIndex]: []};
    stage.set("division", newdivision)
  }

  function handleRemoveUnit() {
    const curdivision = stage.get("division");
    const lastIndex = Object.keys(curdivision).length - 1;
    if (lastIndex > 0) {  
      delete curdivision[lastIndex];
      stage.set("division", curdivision)
      players.forEach((player) => {
        console.log(player.get("unit"), lastIndex)
        if (player.get("unit") == lastIndex) {
          player.set("unit", "deck");
        }
      });
    }
  }

  // function handleRetrieve () {
  //   console.log("retrieve", round.stages, round.get("stages"), game.get("stages"), game.stages, game);

  // }

  return (
    <div className="task" >
      <div className="left">
        <div className="info" style={{ margin: "0 auto", width: "90%" }}>
          <Timer stage={stage} />
        </div>

        <div className="constraints">
          <h5 className="font-sans text-2xl text-gray-700 font-semibold underline">Constraints</h5>
          <ul>
            {task.constraints.map((constraint) => {
              return (
                <li key={constraint._id} >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="font-sans text-xl text-gray-700" style={{ marginRight: "5px" }} />
                      <span style={{ fontSize: "14px", lineHeight: "1.5"  }}>
                      {constraint.pair.join(" and ")} {constraint.text}.</span>
                    </div>
                </li>
              );

            })}
          </ul>
        </div>

        <div className="payoff">
          <h5 className="font-sans text-2xl text-gray-700 font-semibold underline">Payoff</h5>
          <div className="border-2 border-black p-4 inline-block">
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
                    <td key={room}>
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
          <Unit
            unit={"deck"}
            isDeck={true}
          />

          <div className="rooms">
            {Object.keys(stage.get("division")).map((unit) => (
              unit !== "deck" && <Unit
                key={unit}
                unit={unit}
              />
            ))}
          </div>
        </div>

        <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
          <Button handleClick={handleAddUnit} primary className="m-0.5rem">
            Add Unit
          </Button>
        </div>

        <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
          <Button handleClick={handleRemoveUnit} primary className="m-0.5rem">
            Remove Unit
          </Button>
        </div>

        {/* maybe later add sth like this */}
        {/* <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
          <Button handleClick={handleRetrieve} primary className="m-0.5rem">
            Retrieve Arrangement from Previous Round
          </Button>
        </div> */}

        <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
          <Button handleClick={(e) => {handleSubmit(e)}} primary className="m-0.5rem">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
  }

