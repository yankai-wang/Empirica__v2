import React, { useEffect, useRef, useState } from "react";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";
import { Author } from "./Author";
//import { TimeSync } from "meteor/mizzao:timesync";
import moment from "moment";
// import Filter from "bad-words"; TODO: deal with bad words

// var Filter = require("bad-words"),
  // filter = new Filter();

export function ChatLog ({messages}) {
  const [state, setState] = useState({ comment: "", time: 0 });

  function handleChange (e) {
    const el = e.currentTarget;
    // console.log("el", el.value);
    setState({ [el.name]: el.value });
  };

  function handleSubmit (e) {
    e.preventDefault();
    // const text = filter.clean(state.comment.trim());
    const text = state.comment.trim();
    // console.log("submitted", player, stage);


    // console.log("submitted");
    // console.log(filter.clean("Don't be an ash0le"));
    // console.log(moment(TimeSync.serverTime(null, 1000)));
    // console.log(moment(TimeSync.serverTime(new Date(), 1000)).format('HH:mm:ss'));
    // console.log('just timesync', new Date(TimeSync.serverTime(null, 1000)))
    // console.log('server time dif', TimeSync.serverOffset())
    // console.log('is synced?', TimeSync.isSynced())

    // console.log(new Date(Date.now() + TimeSync.serverOffset()));

    if (text !== "") {
      console.log("before append")
      console.log("chat", stage.get("chat"), typeof(stage.get("chat")))
      const pre_chat = stage.get("chat")
      // TODO: set to append
      // stage.append("chat", {
      stage.set("chat", pre_chat.concat({
        text,
        playerId: player.id,
        // at: moment(TimeSync.serverTime(null, 1000)), TODO: deal with time
        at: Date.now(),
      }));
      console.log("before")
      setState({ comment: "", time: 0 });
      console.log("after")
    }
  };

  const { comment } = state;
  const player = usePlayer();
  const stage = useStage();

  // console.log("message", messages);
  // console.log("comment", comment);
  return (
    <div className="chat bp3-card">
      <Messages messages={messages} player={player} />
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

// const chatSound = new Audio("./experiment/unsure.mp3");
function Messages ({ messages, player }) {

  console.log("messages", messages);
  // get a reference to the messages div, so we can scroll it
  const messagesEl = useRef(null);

  // useEffect seems to be an equivalent of componentDidMount
  useEffect(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }, []);
  
  // scroll and play sound when new message is added, detected by change in messages.length
  useEffect(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
    // chatSound.play(); // TODO: deal with sound
  }, [messages.length]);
    
  return (
    <div className="messages" ref={messagesEl}>
      {messages.length === 0 ? (
        <div className="empty">No messages yet...</div>
      ) : null}
      {messages.map((message, i) => (
        <Message
          key={i}
          message={message}
          self={message.subject ? player.id === message.subject.id : null}
        />
      ))}
    </div>
  );
}

function Message ({message, self}) {
  const { text, subject } = message;
  console.log("message", message);
  return (
    <div className="message">
      <Author player={subject} self={self} />
      {text}
    </div>
  );
}
