
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
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

export function Unit({ unit, isDeck }) {
  return (
    <div>
    {isDeck ? null : <h2 className="font-800 text-1.5rem text-center text-black">Unit {unit}</h2>}
      <StudentUnit unit={unit} isDeck={isDeck}/>
      <PlayerUnit unit={unit} isDeck={isDeck}/>
    </div>
  );
}




function PlayerUnit ({ unit, isDeck })  {
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
    const subject_id = e.dataTransfer.getData("subject");
    const subject = players.find((p) => p.id === subject_id);
    const oriUnit = e.dataTransfer.getData("oriUnit");

    setState({ hovered: false });

    subject.set("unit", unit);

  };

  const stage = useStage();
  const player = usePlayer();
  const game = useGame();
  const players = usePlayers();

  const { hovered } = state;
  const subjects = players.filter((p) => p.get("unit") === unit);

  const classNameRoom = isDeck ? "deck bp3-elevation-1" : "room";
  const classNameHovered = hovered ? "bp3-elevation-3" : "";
  return (
    <div
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      className={`bp3-card ${classNameRoom} ${classNameHovered}`}
    >
      {isDeck ? null : <h6 className="bp3-heading">Player</h6>}
      {subjects.map((subject) => (
        <UnitPlayer
          onDragStart={(e) => UnitPlayer.handleDragStart(e)}
          subject={subject}
          unit={unit}
          key={subject.id}
        />
      ))}
    </div>
  );
  }

function StudentUnit ({ unit, isDeck })  {
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
    const oriUnit = e.dataTransfer.getData("oriUnit");

    setState({ hovered: false });

    const curdivision = stage.get("division");

    const newdivision = oriUnit === "deck" ?
      { ...curdivision, [unit]: curdivision[unit].concat(student)} :
      unit === "deck" ?
        { ...curdivision, [oriUnit]: curdivision[oriUnit].filter((s) => s !== student)} :
        { ...curdivision, [unit]: curdivision[unit].concat(student), [oriUnit]: curdivision[oriUnit].filter((s) => s !== student)};
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
      {isDeck ? null : <h6 className="bp3-heading">Student</h6>}
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








function UnitStudent ({ student, unit }) {

  function handleDragStart (e) {
    e.dataTransfer.setData("text/plain", student);
    e.dataTransfer.setData("oriUnit", unit);
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



function UnitPlayer ({ unit, subject }) {

  function handleDragStart (e) {
    e.dataTransfer.setData("subject", subject.id);
    e.dataTransfer.setData("oriUnit", unit);
  };

    const stage = useStage();
    const player = usePlayer();
    const players = usePlayers();
    const game = useGame();

    return (
      <div
        draggable={true}
        onDragStart={(e) => handleDragStart(e)}
        className="m-1rem text-center"
        style={{ cursor: "move" }}
      >
        <div className="flex">
          <span className="icon bp3-icon-standard bp3-icon-person" />
          {game.get("treatment").leaderStar && subject.get("isLeader") && (
            <FaStar
              className=" text-yellow-500 text-1rem"
            />
          )}
          <span className="icon">
              <img src={`${subject.get("avatar")}`} 
              className="h-5rem w-5rem rounded-md shadow bg-white p-0.25rem "/>
          </span>
        </div>
        <span className="text-center" style={{ color: subject.get("nameColor") }}>
          {subject.get("name")}
          {player.id === subject.id ? " (You)" : ""}
        </span>
      </div>
    );
  }