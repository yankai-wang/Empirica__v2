import React , { useState, useEffect } from "react";
import _ from "lodash";
import { FaCheck, FaTimes, FaStar } from "react-icons/fa";
import {ChatLog} from "./ChatLog";
import { Radio } from "../intro-exit/ExitSurvey";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function LeaderElection () {
  const player = usePlayer();
  const players = usePlayers();
  const game = useGame();
  const stage = useStage();

  function renderPlayer (player, self = false) {
    return (
      <div className="player" key={player.id}>
        <span className="image">
          <span
            className={`satisfied`}
            // className="top--0.6rem right--0.8rem absolute"
          >
            {player.get("voted") && (
              <FaCheck
                style={{
                  color: "green",
                  marginRight: "5px",
                  border: "2px solid green",
                  borderRadius: "50%",
                }}
              />
            )}
            {!player.get("voted") && (
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

  function modeArray(array) {
    if (array.length == 0) return null;
    var modeMap = {},
      maxCount = 1,
      modes = [];
  
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
  
      if (modeMap[el] == null) modeMap[el] = 1;
      else modeMap[el]++;
  
      if (modeMap[el] > maxCount) {
        modes = [el];
        maxCount = modeMap[el];
      } else if (modeMap[el] == maxCount) {
        modes.push(el);
        maxCount = modeMap[el];
      }
    }
    return modes;
  }

 
  const otherPlayers = players.filter(p => p.id !== player.id);
  const messages = stage.get("chat").map(({ text, playerId, mentionedIds }) => ({
    text,
    subject: players.find(p => p.id === playerId),
    mentionedIds
  }));

  const [allVoted, setAllVoted] = useState(false)
  const [voteLeader, setVoteLeader] = useState([])
  const [warning, setWarning] = useState(false)
  
  function handleSubmit(e) {
    player.set("voted", true)
    if (!players.map(p => p.get("voted")).includes(false)) {
      setVoteLeader(modeArray(players.map(p => p.get("vote"))))
      setAllVoted(true)
      if (voteLeader.length === 1) {
      } else {
        players.forEach(p => {
          p.set("voted", false)
          p.set("vote", null)
        })
        setWarning(true)
        setAllVoted(false)
        stage.set("warning", true)
      }
    }
  }

  useEffect(() => {
    if (warning) {
      console.log("warning")
      // alert("There is a tie. Please vote again.")
      setWarning(false)
    }
  }, [warning])

  if (stage.get("warning")) {
    alert("There is a tie. Please vote again.")
    stage.set("warning", false)
  }


  return (
    <div className="round">
      <div className="w-40rem">
        {allVoted ? (
          "The leader is " + voteLeader[0] + ".") : 
          "Please choose one player to be the leader."

          }
        
        {players.map(subject => (
          <div key={subject.id} className="p-0.5rem flex">
            <label className="text-sm font-medium text-gray-700">
            <input
              className="mr-2 shadow-sm sm:text-sm"
              type="radio"
              name={subject.get("name")}
              value={subject.get("name")}
              checked={player.get("vote") === subject.get("name")}
              disabled={player.get("voted")}
              onChange={e => {player.set("vote", e.target.value)}}
            />
            <span className="name" style={{ color: subject.get("nameColor") }}>
              {subject.get("name")}
              {player.id===subject.id ? " (You)" : ""}
            </span>
              <img
                className="h-4rem w-4rem rounded-md shadow bg-white p-1"
                src={`${subject.get("avatar")}`}
                alt="Avatar"
              />
              {game.get("treatment").electPreResult || allVoted ? 
                <div>
                  votes: {players.map(p => p.get("vote")).filter(v => v === subject.get("name")).length}
                  {game.get("treatment").electWho ? 
                    <div>
                      {players.filter(p => p.get("vote") === subject.get("name")).map(
                        p => (
                        <div key={p.id}>
                          <img
                            className="h-1.5rem w-1.5rem rounded-md shadow bg-white p-1"
                            src={`${p.get("avatar")}`}
                            alt="Avatar"
                          />
                          <span className="name" style={{ color: p.get("nameColor") }}>
                            {p.get("name")}
                            {player.id===p.id ? " (You)" : ""}
                          </span>
                        </div>)
                      )}
                    </div> : null
                  }
                </div> : null
              }
              
            </label>

          </div>
        ))}

        {allVoted ? null :
          <button className="btn btn-primary" onClick={(e) => {handleSubmit(e)}}>
            Submit
          </button>
        }
      </div>
    
      {allVoted ? null :
        <div className="social-interactions">
          <div className="status">
            <div className="players">
              {renderPlayer(player, true)}
              {otherPlayers.filter(p => p.get("dropcondition")).map(p => renderPlayer(p))}
            </div>
          </div>
        {game.get("treatment").electChat ? <ChatLog messages={messages} stage={stage} player={player} /> : null}
        </div>
      }
      
    </div>
  );
}
