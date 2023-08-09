import React, { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Mention, MentionsInput } from "react-mentions";
import Highlighter from "react-highlight-words";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";
import { Author } from "./Author";
import sound from "../experiment/unsure.mp3"
//import { TimeSync } from "meteor/mizzao:timesync";
//import moment from "moment";
// import Filter from "bad-words"; TODO: deal with bad words

// var Filter = require("bad-words"),
  // filter = new Filter();

export function ChatLog ({messages}) {
  const [value, setValue] = useState("");
  const comment = value;
  const player = usePlayer();
  const stage = useStage();
  const game = useGame();
  const players = usePlayers();
  const otherPlayers = players.filter(p => p.id !== player.id);

  // generate a list of users, in which the id is the player's id and the display is the player's nameColor
  const users = otherPlayers.map((player) => ({
    id: player.id,
    display: player.get("name"),
  }));

  function handleSubmit (e) {
    e.preventDefault();
    // const text = filter.clean(state.comment.trim());
    const text = comment.trim();

    // console.log("submitted");
    // console.log(filter.clean("Don't be an ash0le"));
    // console.log(moment(TimeSync.serverTime(null, 1000)));
    // console.log(moment(TimeSync.serverTime(new Date(), 1000)).format('HH:mm:ss'));
    // console.log('just timesync', new Date(TimeSync.serverTime(null, 1000)))
    // console.log('server time dif', TimeSync.serverOffset())
    // console.log('is synced?', TimeSync.isSynced())

    // console.log(new Date(Date.now() + TimeSync.serverOffset()));

    if (text !== "") {
      // get the id of the mentioned players by matching '@[__display__](__id__)'
      const mentionedPlayers = text.match(/@\[.*?\]\(.*?\)/g);
      // extract the unique ids from the matched string
      const mentionedIds = mentionedPlayers
        ? [...new Set(mentionedPlayers.map((s) => s.match(/\(.*?\)/)[0]))]
        : [];
      // remove the parentheses
      const mentionedIdsClean = mentionedIds.map((s) => s.slice(1, -1));

      const pre_chat = stage.get("chat")
      // TODO: set to append
      // stage.append("chat", {
      stage.set("chat", pre_chat.concat({
        text,
        playerId: player.id,
        mentionedIds: mentionedIdsClean,
        // at: moment(TimeSync.serverTime(null, 1000)), TODO: deal with time
        //at: moment(Date.now()),
      }));
      setValue("");
    }
  };

  return (
    <div className="chat bp3-card">
      <Messages messages={messages} player={player} game={game}/>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="bp3-control-group">
          {game.get("treatment").mentionHighlight ? (
            <MentionsInput
              placeholder="Enter chat message. Use @ to mention other players."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-10 w-full"
            >
              <Mention
                data={users}
                markup='@[__display__](__id__)'
                appendSpaceOnAdd={true}
                displayTransform={(id, display) => `@${display}`}
              />
            </MentionsInput> ) : (
            <input  
              type="text"
              className="bp3-input"
              placeholder="Enter chat message"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}

          <button type="submit" className="bp3-button bp3-intent-primary">
            Send
          </button>
        </div>
      </form>
    </div>
  );
  
}

function Messages ({ messages, player, game }) {
  const chatSound = new Audio(sound);
  // get a reference to the messages div, so we can scroll it
  const messagesEl = useRef(null);

  // useEffect seems to be an equivalent of componentDidMount
  useEffect(() => {
    messagesEl.current.scrollTop = messagesEl.current.scrollHeight;
  }, []);
  
  // scroll and play sound when new message is added, detected by change in messages.length
  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    messagesEl.current.scrollTop = messagesEl.current.scrollHeight;
    // play sound only if the message is from the same unit
    if (game.get("treatment").dolMessage && messages.at(-1).subject.get("unit") !== player.get("unit")) {
      return;
    }
    chatSound.play();
  }, [messages.length]);
    
  return (
    <div className="messages" ref={messagesEl}>
      {messages.length === 0 ? (
        <div className="empty">No messages yet...</div>
      ) : null}

      {messages.map((message, i) => (
        game.get("treatment").mentionPrivate ? (
          // if mentionPrivate, only show messages to sender and mentioned players
          (player.id === message.subject.id || message.mentionedIds.includes(player.id)) ? (
            <Message
              key={i}
              message={message}
              self={message.subject ? player.id === message.subject.id : null}
              game={game}
            />
          ) : (
            null
          )
        ) : (
          // if not mentionPrivate, only show messages from players in the same unit, or mentioned information from another unit
          !game.get("treatment").dolMessage || message.subject.get("unit") === player.get("unit") || (game.get("treatment").mentionCrossUnit && message.mentionedIds.includes(player.id)) ? (
            <Message
              key={i}
              message={message}
              self={message.subject ? player.id === message.subject.id : null}
              game={game} 
              /> ) : (
            null )
        )

      ))}
    </div>
  );
}

function Message ({message, self, game}) {
  const { text, subject } = message;
  // replace the '@[__display__](__id__)' format with just @ and the display
  const displayText = text.replace(/@\[.*?\]\(.*?\)/g, (match) => {
    const display = match.match(/@\[(.*?)\]/)[1];
    return `@${display}`;
  });

  return (
    <div className="message">
      {/* {game.get("treatment").leaderStar && subject.get("isLeader") && (
        <FaStar
          className="top--0.25rem right-0.2rem absolute text-yellow-500 text-1.25rem"
        />
      )} */}
      <Author player={subject} self={self} game={game}/>
      {game.get("treatment").mentionHighlight ? (
        <Highlighter
          highlightClassName="highlighted" 
          searchWords={["@[a-z]*"]}
          textToHighlight={displayText}
        /> ) : (
          displayText
      )}
    </div>
  );
}
