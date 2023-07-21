import React from "react";

export function Author ({ player, self }) {
  return (
    <div className="author">
      <img src={`https://api.dicebear.com/6.x/identicon/svg?seed=${player.get("avatar")}`} />
      <span className="name" style={{ color: player.get("nameColor") }}>
        {self ? "You" : player.get("name")}
      </span>
    </div>
    );
}
