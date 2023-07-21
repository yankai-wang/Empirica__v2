
import React, { useState, useEffect } from "react";
import {Student} from "./Student";
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

export function Room (props)  {
 // state = { hovered: false };
 //console.log('ROOM PROPS')
 //console.log(props)
 const [state, setState] = useState({
  hovered: false,

});

  function handleDragOver(e) {
    //console.log('timeSync',moment(TimeSync.serverTime(null, 1000)))
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setState({ hovered: true });
  };

  function handleDragLeave (e) {
    setState({ hovered: false });
  };

  function handleDrop (props,e) {
    
    const { stage, player, room } = props;
    const student = e.dataTransfer.getData("text/plain");
    stage.set(`student-${student}-dragger`, null); //maybe this fixes the problem of stucked colors
    const currentRoom = stage.get(`student-${student}-room`);

    setState({ hovered: false });

    // Avoid any unwanted drops!
    // We're using the native DnD system, which mean people can drag anything
    // onto these drop zones (e.g. files from their desktop) so we check this
    // is an existing student first.
    if (currentRoom === room) {
      //if they kept the student where it is, log that they stayed in the same place And don't change the answer
      stage.append("log", {
        verb: "releasedStudent",
        subjectId: player._id,
        object: student,
      });
      return;
    }

    stage.set(`student-${student}-room`, room);

    stage.append("log", {
      verb: "movedStudent",
      subjectId: player._id,
      object: student,
      target: room,
      // at: new Date()
     // at: moment(TimeSync.serverTime(null, 1000))
    });
   // console.log('room moment', moment(TimeSync.serverTime(null, 1000)))
  };
    //console.log('RIGHT BEFORE ITERATOR',props)
    const { room, isDeck, stage, ...rest } = props || {};
    //const room = props.room
   // const isDeck = props.isDeck
   // const stage= 
  
    const { hovered } = state;
    const students = [];
    const task = stage.get("task");
    task.students.forEach((student) => {
      if (stage.get(`student-${student}-room`) === room) {
        students.push(student);
      }
    });

    const classNameRoom = isDeck ? "deck bp3-elevation-1" : "room";
    const classNameHovered = hovered ? "bp3-elevation-3" : "";
    return (
      <div
        onDrop={(e) => handleDrop(props, e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        className={`bp3-card ${classNameRoom} ${classNameHovered}`}
      >
        {isDeck ? null : <h6 className="bp3-heading">Room {room}</h6>}
        {students.map((student) => (
          <Student
            onDragStart={(e) => Student.handleDragStart(e,props)}
            key={student}
            student={student}
            room={room}
            stage={stage}
            {...rest}
          />
        ))}
      </div>
    );
  }

