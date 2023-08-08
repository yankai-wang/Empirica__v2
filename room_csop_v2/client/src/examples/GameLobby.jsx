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

export function GameLobby() {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();
  const game = useGame();

  //console.log(player.get("avatar"))
  return (
    <Chat player={player} scope={stage} customKey ="Lobby_Chat"/>
  );
}
