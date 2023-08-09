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


  function handleSubmit() {
    stage.set("unitAssigned", true);
  }

    const task = stage.get("task");
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
                  {task.rooms.map((unit) => (
                    <th key={unit}>{unit}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {task.students.map((student) => (
                  <tr key={student}>
                    <th>Student {student}</th>
                    {task.rooms.map((unit) => (
                      <td key={unit}>
                        {task.payoff[student][unit]}
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
              unit="deck"
              isDeck
            />

            <div className="rooms">
              {task.rooms.map((unit) => (
                <Unit
                  key={unit}
                  unit={unit}
                />
              ))}
            </div>
          </div>

          <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
            <Button handleClick={handleSubmit} primary>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

