import React from "react";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function Introduction({ previous, next }) {
  //console.log('I can see this?')
  const game = useGame();
  const player = usePlayer();
  const players = usePlayers();
  console.log(next);
  console.log(game);
  console.log(player);
  console.log(players);

  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Instruction One
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-500">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam
          laudantium explicabo pariatur iste dolorem animi vitae error totam. At
          sapiente aliquam accusamus facere veritatis.
        </p>
      </div>
      <Button handleClick={previous} autoFocus>
        <p>Previous</p>
      </Button>

      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
