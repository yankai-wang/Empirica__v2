import React from "react";
import { FaStar } from "react-icons/fa";

export function Author ({ player, self, game }) {
  return (
    <div className="flex font-700 mt-0 mb-0.4em ml-0 mr-0.3em">
      {game.get("treatment").leaderStar && player.get("isLeader") && (
        <FaStar
          className=" text-yellow-500 text-1rem"
        />
      )}
      <img src={`${player.get("avatar")}`} className="relative top-0.2em w-1.2em h-1.2em mr-0.3em"/>
      <span className="name" style={{ color: player.get("nameColor") }}>
        {self ? "You" : player.get("name")}
      </span>
    </div>
    );
}
