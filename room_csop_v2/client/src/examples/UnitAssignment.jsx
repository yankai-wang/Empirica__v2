import {
  Chat,
  Slider,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
} from "@empirica/core/player/classic/react";
import React from "react";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Author } from "./Author";

export function UnitAssignment() {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();
  const game = useGame();

  function handleSubmit() {
    stage.set("unitAssigned", true);
  }

  return (
    <div className="md:min-w-96 lg:min-w-128 xl:min-w-192 flex flex-col items-center space-y-10">
      <Button handleClick={handleSubmit} primary>
        Submit
      </Button>
    </div>
  );
}

