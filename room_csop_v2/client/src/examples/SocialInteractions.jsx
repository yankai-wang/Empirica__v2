import React from "react";
import { FaCheck, FaTimes, FaStar } from "react-icons/fa";
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
  // console.log(player.get("avatar"))
  function renderPlayer (player, self = false) {
    return (
      <div className="player" key={player.id}>
        <span className="image">
          <span
            className={`satisfied`}
            // className="top--0.6rem right--0.8rem absolute"
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
            {game.get("treatment").leaderStar && player.get("isLeader") && (
              <FaStar
                className="top--0.25rem right-5.2rem absolute text-yellow-500 text-1.25rem"
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
  const messages = stage.get("chat").map(({ text, playerId, mentionedIds }) => ({
    text,
    subject: players.find(p => p.id === playerId),
    mentionedIds
  }));
  const events = stage.get("log").map(({ subjectId, ...rest }) => ({
    subject: subjectId && players.find(p => p.id === subjectId),
    ...rest
  }));

  //HERE IS WHERE WE MAKE THE CHAT LOOK BETTER
  return (
    <div className="social-interactions">
      <div className="status">
        <div className="players">
          {renderPlayer(player, true)}
          {otherPlayers.filter(p => p.get("dropcondition")).map(p => renderPlayer(p))}
        </div>

        <div className="total-score">
          <h6 className='bp3-heading'>Total Score</h6>

          <h2 className='bp3-heading'>{game.get("cumulativeScore") || 0}</h2>
        </div>
      
      </div>
      <EventLog events={events} stage={stage} player={player} />
      <ChatLog messages={messages} stage={stage} player={player} />
    </div>
  );
}
