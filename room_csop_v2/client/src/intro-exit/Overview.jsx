import React from "react";


//Im not sure how to grab the components from treatment my game is null 

//import { Centered } from "meteor/empirica:core";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound
}from "@empirica/core/player/classic/react";

export function Overview({ next }) {
  const player = usePlayer();
  const players = usePlayers();
  const stage = useStage();
  const game = useGame();
  const round =useRound();;
   // console.log(Game)
    //console.log(players.length)
    console.log(player)
    console.log(players)
    console.log(game)
    console.log(round)
    const social = player.length > 1;
    return (
      //<Centered>
        <div className="instructions">
          <h1 className={"bp3-heading"}> Game Overview </h1>
          <p>
            In this game, you will be{" "}
            <strong>
              asked to solve a sequence of {5} resource
              allocation tasks
            </strong>
            . In each task, you are going to{" "}
            <strong>assign a group of students into dorm rooms</strong>. You are
            asked to find the room assignment plan that maximizes overall
            satisfaction for the group while respecting certain constraints
            (e.g., some students can not live together in one room).
          </p>

          <p>
            You have at most{" "}
            <strong>{Math.ceil(300 / 60.0)} minutes</strong>{" "}
            to work on each task. Completing the entire game may take you as
            long as {Math.ceil((300 / 60.0) * 6.0)} minutes.{" "}
            <strong>
              If you do not have at least{" "}
              {Math.ceil((300 / 60.0) * 6.0)} minutes
              available to work on this HIT please return it now.
            </strong>
          </p>

          {social ? (
            <div>
              <p>
                <strong>
                  You will play this game simultaneously with{" "}
                  {2 - 1} other participants in real-time
                </strong>
                . As we will explain in more detail later, in each task, you and
                your teammates will submit a single room assignment plan.
                {/*We will evaluate the quality of your*/}
                {/*plan through score and thus all team members will receive the*/}
                {/*same score in each task.*/}
              </p>
              <p>
                At the end of the game, you will have the opportunity to earn a
                bonus payment and the amount is dependent on your accumulated
                score in all {5} tasks.{" "}
                <strong> Note that "free riding" is not permitted</strong>.{" "}
                <em style={{ color: "red" }}>
                  If we detect that you are inactive during a task, you will not
                  receive a bonus for that task.
                </em>
              </p>
            </div>
          ) : (
            <p>
              In each task, you will submit a single room assignment plan. We
              will evaluate the quality of your plan by scoring it in each task.
              At the end of the game, you will have the opportunity to earn a
              bonus payment and the amount is dependent on your accumulated
              score in all {5} tasks.{" "}
              <em style={{ color: "red" }}>
                If we detect that you are inactive during a task, you will not
                receive a bonus for that task.
              </em>
            </p>
          )}

          <p>
            The game <strong>must be played on a desktop or laptop</strong>.
            There is NO mobile support
          </p>

          <p>
            <strong>
              For the best experience, please maximize the window containing
              this task or make it as large as possible.
            </strong>
          </p>
      
          <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
          
          
        </div>
    // </Centered>
    );
  }
