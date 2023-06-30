import React, { useState, useEffect } from "react";
import _ from "lodash";
import styles from "./main.less";
import { IconNames } from "@blueprintjs/icons";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

//import {Centered} from "meteor/empirica:core";
import { exampleTaskData } from "./TaskDetails";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function Thanks({ previous, next }) {
  const player = usePlayer();
  return (
    <Centered>
      <div className="game finished">
        <div className="pt-non-ideal-state">
          <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
            <span className="pt-icon pt-icon-thumbs-up" />
          </div>
          <h4 className="pt-non-ideal-state-title">Finished!</h4>
          <hr />
          <h4 className="pt-non-ideal-state-title">
            Submission code: {player.id}
          </h4>
          <h4 className="pt-non-ideal-state-title">
            Bonus: ${player.get("bonus")}
          </h4>
          <hr />
          <div className="pt-non-ideal-state-description">
            Thank you for participating!
          </div>
        </div>
      </div>
    </Centered>
  );
}
