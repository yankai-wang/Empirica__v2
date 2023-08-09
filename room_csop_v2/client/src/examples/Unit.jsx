
import React, { useState, useEffect } from "react";
import {UnitStudent} from "./UnitStudent";
import {
  Chat,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

//import { TimeSync } from "meteor/mizzao:timesync";
//import moment from "moment";

export function Unit ({ unit, isDeck })  {
 const [state, setState] = useState({
  hovered: false,

});

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setState({ hovered: true });
  };

  function handleDragLeave (e) {
    setState({ hovered: false });
  };

  function handleDrop (e) {
    const student = e.dataTransfer.getData("text/plain");

    setState({ hovered: false });

    const curdivision = stage.get("division");

    if (curdivision[unit].includes(student)) {
      return;
    }
    const newdivision = { ...curdivision, unit: curdivision[unit].concat(student)};
    stage.set("division", newdivision)

  };
    const stage = useStage();
    const player = usePlayer();
    const game = useGame();
  
    const { hovered } = state;
    const students = [];
    const task = stage.get("task");
    task.students.forEach((student) => {
      if (stage.get("division")[unit].includes(student)) {
        students.push(student);
      }
    });

    const classNameRoom = isDeck ? "deck bp3-elevation-1" : "room";
    const classNameHovered = hovered ? "bp3-elevation-3" : "";
    return (
      <div
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        className={`bp3-card ${classNameRoom} ${classNameHovered}`}
      >
        {isDeck ? null : <h6 className="bp3-heading">Room {unit}</h6>}
        {students.map((student) => (
          <UnitStudent
            onDragStart={(e) => UnitStudent.handleDragStart(e)}
            key={student}
            student={student}
            unit={unit}
          />
        ))}
      </div>
    );
  }

