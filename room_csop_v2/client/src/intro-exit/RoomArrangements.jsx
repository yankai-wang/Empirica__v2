import React from "react";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound
}from "@empirica/core/player/classic/react";
import logo from '../examples/instruction-room-arrangements.svg'
//import { Centered } from "meteor/empirica:core";
export function RoomArrangements({previous,next }) 
  {
    const player =usePlayer()
    const treatment= player.get('treatment')
    return (
        <div className="instructions" style={{ margin: "0 auto", width: "95%" }}>
          <h1 className="bp3-heading" style={{ fontSize: "64px" }}> Task Room Arrangements</h1>
          <p>
            Depending on the number of rooms, number of students, and your
            screen/browser size and resolution, the arrangement of the rooms
            might "look" different on your screen.
          </p>

          <div className="image">
            <img src={logo} alt="Instruction Room Arrangements"/>
          </div>

          <p>
            In all cases and for any arrangement that appears for you, you only
            need to consider the numbers on those rooms when addressing
            constraints in a task. In particular,{" "}
            <strong>
              "neighbor" is defined as rooms with consecutive numbers
            </strong>
            . For example, regardless of the arrangement you have on the screen,
            Room 102 is next door to both Room 101 and Room 103. On the other
            hand, Room 101 is only next door to Room 102.
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

