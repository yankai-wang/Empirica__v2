import React from "react";

export function Avatar({ player }) {
  return (
    <img
      className="h-full w-full rounded-md shadow bg-white p-1"
      src={`https://api.dicebear.com/6.x/identicon/svg?seed=${player.avatar}`}
      alt="Avatar"
    />
  );
}
