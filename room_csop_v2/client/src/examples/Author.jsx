import React from "react";

export function Author ({ player, self }) {
  console.log(player.get("avatar"), player.get("nameColor"), player.get("name"));

  return (
    <div className="author">
      <img src={player.get("avatar")} />
      <span className="name" style={{ color: player.get("nameColor") }}>
        {self ? "You" : player.get("name")}
      </span>
    </div>
    );
}
