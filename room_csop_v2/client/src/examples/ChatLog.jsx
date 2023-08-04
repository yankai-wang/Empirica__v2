import React, { useEffect, useRef, useState } from "react";
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
  const [state, setState] = useState({ comment: "", time: 0 });
  const { comment } = state;
  const player = usePlayer();
  const stage = useStage();
  const game = useGame();

  function handleChange (e) {
    console.log("handleChange");
    const el = e.currentTarget;
    setState({ [el.name]: el.value });
  };

  function handleSubmit (e) {
    console.log("handleSubmit");
    e.preventDefault();
    // const text = filter.clean(state.comment.trim());
    const text = state.comment.trim();

    // console.log("submitted");
    // console.log(filter.clean("Don't be an ash0le"));
    // console.log(moment(TimeSync.serverTime(null, 1000)));
    // console.log(moment(TimeSync.serverTime(new Date(), 1000)).format('HH:mm:ss'));
    // console.log('just timesync', new Date(TimeSync.serverTime(null, 1000)))
    // console.log('server time dif', TimeSync.serverOffset())
    // console.log('is synced?', TimeSync.isSynced())

    // console.log(new Date(Date.now() + TimeSync.serverOffset()));

    if (text !== "") {
      const pre_chat = stage.get("chat")
      // TODO: set to append
      // stage.append("chat", {
      stage.set("chat", pre_chat.concat({
        text,
        playerId: player.id,
        // at: moment(TimeSync.serverTime(null, 1000)), TODO: deal with time
        //at: moment(Date.now()),
      }));
      setState({ comment: "", time: 0 });
    //  console.log("set state", stage.get("chat"))
    }
  };


  //console.log("not here?")

  return (
    <div className="chat bp3-card">
      <Messages messages={messages} player={player} game={game}/>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="bp3-control-group">
          <input
            name="comment"
            type="text"
            className="bp3-input bp3-fill"
            placeholder="Enter chat message"
            value={comment}
            onChange={(e) => handleChange(e)}
            autoComplete="off"
          />
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

  const scrollToBottom = () => {
    messagesEl.current?.scrollIntoView({ behavior: "smooth" })
  }

  // useEffect seems to be an equivalent of componentDidMount
  useEffect(() => {
    // messagesEl.scrollTop = messagesEl.scrollHeight;
    // messagesEl.current?.scrollIntoView({ behavior: "smooth" })
    scrollToBottom()
  }, []);
  
  // scroll and play sound when new message is added, detected by change in messages.length
  useEffect(() => {
    // messagesEl.scrollTop = messagesEl.scrollHeight;
    // messagesEl.current?.scrollIntoView({ behavior: "smooth" })
    scrollToBottom()
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
        // only show messages from players in the same unit
        game.get("treatment").dolMessage && message.subject.get("unit") !== player.get("unit") ? (
          null ) : (
        <Message
          key={i}
          message={message}
          self={message.subject ? player.id === message.subject.id : null}
        />
        )
      ))}
    </div>
  );
}

function Message ({message, self}) {
  const { text, subject } = message;
 // console.log("message", message);
  return (
    <div className="message">
      <Author player={subject} self={self} />
      {text}
    </div>
  );
}
