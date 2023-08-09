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
    eventsEl.current.scrollTop = eventsEl.current.scrollHeight;
    // console.log("time", moment(TimeSync.serverTime(new Date(), 1000)));
  }, []);

  useEffect(() => {
    // console.log(moment(TimeSync.serverTime(null, 1000)).format('HH:mm:ss'));
    eventsEl.current.scrollTop = eventsEl.current.scrollHeight;
  }, [events.length]);

  const player = usePlayer();
  const game = useGame();

  //if the one who made the event is the player himself then self will be true
  return (
    <div className="eventlog bp3-card">
      <div className="events" ref={eventsEl}>
        {events.map((event, i) => (
          <Event
            key={i}
            event={event}
            self={event.subject ? player.id === event.subject.id : null}
            game={game}
          />
        ))}
      </div>
    </div>
  );
}

function Event ({ event, self, game }) {
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
      content = <div className="inline-block">Round {roundId} started</div>;
      break;
    case "movedStudent":
      content = (
        <div className="inline-block">
          <Author player={subject} self={self} game={game}/> moved{" "}
          <div className="inline-block font-800">{object}</div> to{" "}
          <div className="inline-block font-800">Room {target}</div>.
        </div>
      );
      break;
    case "draggingStudent":
      content = (
        <div className="inline-block">
          <Author player={subject} self={self} game={game}/> started moving{" "}
          <div className="inline-block font-800">{object}</div>.
        </div>
      );
      break;
    case "releasedStudent":
      content = (
        <div className="inline-block">
          <Author player={subject} self={self} game={game}/> released{" "}
          <div className="inline-block font-800">{object}</div> without moving it.
        </div>
      );
      break;
    case "playerSatisfaction":
      content = (
        <div className="inline-block">
          <Author player={subject} self={self} game={game}/> {self ? "are" : "is"}{" "}
          <div className="inline-block font-800">{state}</div> with the answer
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
