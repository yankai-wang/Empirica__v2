import React from "react";
import {EventLog} from "./EventLog";
import {ChatLog} from "./ChatLog";
import { Avatar } from "../components/Avatar";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function SocialInteractions () {
  const player = usePlayer();
  const players = usePlayers();
  const game = useGame();
  const stage = useStage();

  function renderPlayer (player, self = false) {
    return (
      <div className="player" key={player.id}>
        <span className="image">
          <span
            className={`satisfied bp3-tag bp3-round ${
              player.get("satisfied") ? "bp3-intent-success" : "bp3-intent-danger"
            }`}
          >
            <span
              className={`bp3-icon-standard ${
                player.get("satisfied") ? "bp3-icon-tick" : "bp3-icon-cross"
              }`}
            />
          </span>

          {/* <img src={player.get("avatar")} /> */}
          <Avatar player={player} />
        </span>
        {/* <span className="name" style={{ color: player.get("nameColor") }}> */}
        <span className="name" style={{ color: player.get("nameColor") }}>
          {player.get("name")}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }

 
  // const otherPlayers = _.reject(players, p => p.id === player.id);
  const otherPlayers = players.filter(p => p.id !== player.id);
  //console.log("otherPlayers", otherPlayers);
  //console.log("chat", stage.get("chat"));
  // console.log("log", stage.get("log"));
  const messages = stage.get("chat").map(({ text, playerId }) => ({
    text,
    subject: players.find(p => p.id === playerId)
  }));
  const events = stage.get("log").map(({ subjectId, ...rest }) => ({
    subject: subjectId && players.find(p => p.id === subjectId),
    ...rest
  }));

  return (
    <div className="social-interactions">
      <div className="status">
        <div className="players bp3-card">
          {renderPlayer(player, true)}
          {otherPlayers.map(p => renderPlayer(p))}
        </div>

        <div className="total-score bp3-card">
          <h6 className='bp3-heading'>Total Score</h6>

          <h2 className='bp3-heading'>{game.get("cumulativeScore") || 0}</h2>
        </div>
      </div>

      <EventLog events={events} stage={stage} player={player} />
      <ChatLog messages={messages} stage={stage} player={player} />
    </div>
  );
}
