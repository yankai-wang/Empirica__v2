import { Chat, useGame } from "@empirica/core/player/classic/react";

import React from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import {Round}  from "./examples/Round"

export function Game() {
  const game = useGame();
  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
        <Profile />
        <div className="h-full flex items-center justify-center">
          <Round />
        </div>
      </div>
      <div className="h-full w-128 border-l flex justify-center items-center">
        <Chat scope={game} attribute="chat" />
      </div>
    </div>
  );
}
