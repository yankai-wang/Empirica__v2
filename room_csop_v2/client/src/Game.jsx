import { Chat, useGame, useStage, usePlayers } from "@empirica/core/player/classic/react";

import React from "react";
import { Profile } from "./Profile";
import { Stage } from "./Stage";
import { ChatLog } from "./examples/ChatLog";

export function Game() {
  const game = useGame();
  const stage = useStage();
  const players = usePlayers();
  console.log("chat", stage.get("chat"), typeof(stage.get("chat")));
  // console.log("game.players", game.players, game.get("players"), usePlayers())
  // console.log("game",game, game.treatment, game.currentRound, game.get("treatment"))
  const messages = stage.get("chat").map(({ text, playerId }) => ({
    text,
    subject: players.find(p => p.id === playerId)
  }));
  // console.log("messages", messages)
  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
        <Profile />
        <div className="h-full flex items-center justify-center">
          <Stage />
        </div>
      </div>
      <div className="h-full w-128 border-l flex justify-center items-center">
        {/* <Chat scope={game} attribute="chat" /> */}
        <ChatLog messages={messages}/>
      </div>
    </div>
  );
}
