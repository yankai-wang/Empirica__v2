import { Chat, useGame, useStage, usePlayers } from "@empirica/core/player/classic/react";

import React from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { SocialInteractions } from "./examples/SocialInteractions";

export function Game() {
  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
        <Profile />
        <div className="h-full flex items-center justify-center">
          <Round />
        </div>
      </div>
      <div className="h-full w-128 border-l flex justify-center items-center">
        {/* <Chat scope={game} attribute="chat" /> */}
        <SocialInteractions />
      </div>
    </div>
  );
}
