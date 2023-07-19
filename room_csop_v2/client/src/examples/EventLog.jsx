import React, { useEffect, useRef, useState }  from "react";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";
// import moment from "moment/moment";
import { Author } from "./Author";
// import { TimeSync } from "meteor/mizzao:timesync";

export function EventLog ({ events }) {

  const eventsEl = useRef(null);

  // useEffect seems to be an equivalent of componentDidMount
  useEffect(() => {
    eventsEl.scrollTop = eventsEl.scrollHeight;
    // console.log("time", moment(TimeSync.serverTime(new Date(), 1000)));
  }, []);

  useEffect(() => {
    // console.log(moment(TimeSync.serverTime(null, 1000)).format('HH:mm:ss'));
    eventsEl.scrollTop = eventsEl.scrollHeight;
  }, [events.length]);

  const player = usePlayer();

  //if the one who made the event is the player himself then self will be true
  return (
    <div className="eventlog bp3-card">
      <div className="events" ref={eventsEl}>
        {events.map((event, i) => (
          <Event
            key={i}
            event={event}
            self={event.subject ? player.id === event.subject.id : null}
          />
        ))}
      </div>
    </div>
  );
}

function Event ({ event, self }) {
  const {
    subject,
    roundId,
    verb,
    object,
    target,
    state,
    at,
  } = event;
  let content;
  switch (verb) {
    case "roundStarted":
      content = <div className="content">Round {roundId} started</div>;
      break;
    case "movedStudent":
      content = (
        <div className="content">
          <Author player={subject} self={self} /> moved{" "}
          <div className="object">{object}</div> to{" "}
          <div className="target">Room {target}</div>.
        </div>
      );
      break;
    case "draggingStudent":
      content = (
        <div className="content">
          <Author player={subject} self={self} /> started moving{" "}
          <div className="object">{object}</div>.
        </div>
      );
      break;
    case "releasedStudent":
      content = (
        <div className="content">
          <Author player={subject} self={self} /> released{" "}
          <div className="object">{object}</div> without moving it.
        </div>
      );
      break;
    case "playerSatisfaction":
      content = (
        <div className="content">
          <Author player={subject} self={self} /> {self ? "are" : "is"}{" "}
          <div className="object">{state}</div> with the answer
        </div>
      );
      break;
    default:
      console.error(`Unknown Event: ${verb}`);

      return null;
  }

  return (
    
    <div className="event">
      {/*
        Not sure we even need to show am/pm. I think we need seconds since the
        interactions are quick but to save space we can probably skip am/pm
        for the sake of space. We could maybe also just but the seconds since
        start of round or remaining second before end of round, might be more
        relevant. Might or might not be clear.
      */}
      {/* <div className="timestamp">{moment(at).format("hh:mm:ss a")}</div> */}
      
      {/* <div className="timestamp">{moment(at).format("hh:mm:ss")}</div> */}
      {/* TODO: deal with time */}
      {content}
    </div>
  );
  
}
