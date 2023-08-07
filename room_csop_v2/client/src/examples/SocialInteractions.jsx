import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import {EventLog} from "./EventLog";
import {ChatLog} from "./ChatLog";
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
  console.log(player.get("avatar"))
  function renderPlayer (player, self = false) {
    return (
      <div className="player" key={player.id}>
        <span className="image">
          <span
            className={`satisfied bp3-tag bp3-round ${
              player.get("satisfied") ? "bp3-intent-success" : "bp3-intent-danger"
            }`}
          >
            {player.get("satisfied") && (
              <FaCheck
                style={{
                  color: "green",
                  marginRight: "5px",
                  border: "2px solid green",
                  borderRadius: "50%",
                }}
              />
            )}
            <span
              className={`bp3-icon-standard ${
                player.get("satisfied") ? "bp3-icon-tick" : "bp3-icon-cross"
              }`}
            />
            {!player.get("satisfied") && (
              <FaTimes
                style={{
                  color: "red",
                  marginRight: "5px",
                  border: "2px solid red",
                  borderRadius: "50%",
                }}
              />
            )}
          </span>
          <img
            className="h-full w-full rounded-md shadow bg-white p-1"
            src={`${player.get("avatar")}`}
            alt="Avatar"
          />
        </span>
        <span className="name" style={{ color: player.get("nameColor") }}>
          {player.get("name")}
          {self ? " (You)" : ""}
        </span>
      </div>
    );
  }

 
  // const otherPlayers = _.reject(players, p => p.id === player.id);
  const otherPlayers = players.filter(p => p.id !== player.id);
  const messages = stage.get("chat").map(({ text, playerId }) => ({
    text,
    subject: players.find(p => p.id === playerId)
  }));
  const events = stage.get("log").map(({ subjectId, ...rest }) => ({
    subject: subjectId && players.find(p => p.id === subjectId),
    ...rest
  }));

  console.log(otherPlayers)
  //HERE IS WHERE WE MAKE THE CHAT LOOK BETTER
  return (
    <div className="social-interactions">
      <div className="status">
        <div className="players bp3-card">
          {renderPlayer(player, true)}
          {otherPlayers.filter(p => p.get("dropcondition")).map(p => renderPlayer(p))}
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
