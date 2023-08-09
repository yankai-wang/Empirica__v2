
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


export function Student ({ student }) {
  
  
  
  function handleDragStart (e) {
    //console.log('timeSync',moment(TimeSync.serverTime(null, 1000)))
    const dragger = stage.get(`student-${student}-dragger`); //check if there is already a dragger
    //if so, you can't move it, already someone is moving it!
    if (dragger) {
      // Can't drag
      console.log("dragger");
      e.preventDefault();
      return;
    }

    // check the unit of the player and the student to see if they match
    if (game.get('treatment').dolMove) {
      const playerUnit = player.get("unit");
      const task = stage.get("task");
      if (!stage.get("division")[playerUnit].includes(student)) {
        // pop up a message saying that the student is out of scope
        alert("This student is out of your scope. Please only drag the students assigned to you.");
        e.preventDefault();
        return;
      }
    }

    stage.set(`student-${student}-dragger`, player.id);
    const prelog = stage.get("log");
    stage.set("log", prelog.concat({
      verb: "draggingStudent",
      subjectId: player.id,
      object: student,
      // at: new Date()
     // at: moment(TimeSync.serverTime(null, 1000)),
      
    }));
    e.dataTransfer.setData("text/plain", student);
   // console.log('student moment', moment(TimeSync.serverTime(null, 1000)))
  };

  function handleDragOver(e){
    e.preventDefault();
  };

  function handleDragLeave (e) {
    e.preventDefault();
    console.log("released!");
    stage.set(`student-${student}-dragger`, null);
  };

  function handleDragEnd (e) {
    e.preventDefault();
    stage.set(`student-${student}-dragger`, null);

    //if dropped into non-allowed area
    if (e.dataTransfer.dropEffect === "none") {
      const prelog = stage.get("log");
      stage.set("log", prelog.concat({
        verb: "releasedStudent",
        subjectId: player.id,
        object: student,
      }));
    }
  };

    const stage = useStage();
    const player = usePlayer();
    const players = usePlayers();
    const game = useGame();
    let isDragabble = true; // usually everyone can drag, except if it is colored (i.e., being dragged by someone else)
    const dragger = stage.get(`student-${student}-dragger`);
    const style = {};
    const cursorStyle = { cursor: null };

    if (game.get('treatment').dolHighlight) { // ADD TREATMENT HERE

      // in the nudge treatment, the students are colored according to the division of labor
      // get the divisionColor of the student
      // const divisionColor = game.get(divisionColors)
      // but this can't deal with the case where the student belongs to multiple divisions
      // maybe just highlight students belonging to the player's division?
      // fill the student with the divisionColor
      // style.fill = divisionColor;

      const playerUnit = player.get("unit");
      const task = stage.get("task");
      // console.log('playerUnit', playerUnit, stage.get("division"), stage.get("division")[playerUnit], student)
      if (stage.get("division")[playerUnit].includes(student)) {
        // style.fill = game.get("divisionColor")[playerUnit]
        // set color to nameColor
        // style.fill = player.get("nameColor");
        // set color to dark grey
        style.fill = "#363636";
      }
    } // TREATMENT ENDS HERE


    if (dragger) {
      const playerDragging = players.find((p) => p.id === dragger);
      if (playerDragging) {
        style.fill = playerDragging.get("nameColor");
        isDragabble = playerDragging === player.id; //only one can drag at a time
      }
    } else {
      //if the student is NOT being dragged by anyone, then the cursor will be changed
      cursorStyle.cursor = "move";
    }

    return (
      <div
        draggable={isDragabble}
        onDragStart={(e) => handleDragStart(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDragEnd={(e) => handleDragEnd(e)}
        //onDragExit={this.handleDragLeave}
        className="student"
        style={cursorStyle}
      >
        {/* <span className="icon bp3-icon-standard bp3-icon-person" /> */}
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
            <path
              style={style}
              d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"
            />
          </svg>
        </span>
        <span className="letter">{student}</span>
      </div>
    );
  }

