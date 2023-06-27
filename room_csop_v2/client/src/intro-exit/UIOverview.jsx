import React from "react";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound
}from "@empirica/core/player/classic/react";
import singleex from '../experiment/indUIExample.svg'
import groupex from '../experiment/groupUIExample.svg'

//import { Centered } from "meteor/empirica:core";
export function UIOverview ({previous,next}) {
  const player =usePlayer()
  const treatment= player.get('treatment')
  const social = treatment.playerCount >1
    const imagePath =
      treatment.playerCount > 1
        ? groupex
        : singleex;

    console.log("imagePath", imagePath);

    return (
        <div className="instructions"style={{ margin: "0 auto", width: "95%" }}>
          <h1 className="bp3-heading" style={{ fontSize: "64px" }}> Game Interface</h1>
          <p>
            We are almost there! please take a second to familiarize yourself
            with the game User Interface shown here:
          </p>

          <div className="image">
            <img src={imagePath} style={{ border: "2px solid" }} />
          </div>

          <p>
            If the "Satisfied" button for in is unclickable (i.e., inactive) for
            more than 10 seconds, try to refresh the page. Otherwise, you will
            have wait for the time run out. This will not effect your bonus.
          </p>

          <p>
            Now you know where everything goes and ready to take the quiz! Good
            luck.
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

