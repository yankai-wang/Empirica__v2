import React from "react";

//Im not sure how to grab the components from treatment my game is null

//import { Centered } from "meteor/empirica:core";
import { Button } from "../components/Button";
import { usePlayer, useGame } from "@empirica/core/player/classic/react";

export function Overview({ next }) {
  //const game=useGame();
  const player = usePlayer();
  const treatment = player.get("treatment");
  //console.log(treatment)
  const social = treatment.playerCount > 1;
  return (
    //<Centered>
    <div className="instructions" style={{ margin: "0 auto", width: "95%" }}>
      <h1 className="bp3-heading" style={{ fontSize: "64px" }}>
        {" "}
        Game Overview{" "}
      </h1>
      <p>
        In this game, you will be{" "}
        <strong>
          asked to solve a sequence of {treatment.nRounds} resource allocation
          tasks
        </strong>
        . In each task, you are going to{" "}
        <strong>assign a group of students into dorm rooms</strong>. You are
        asked to find the room assignment plan that maximizes overall
        satisfaction for the group while respecting certain constraints (e.g.,
        some students can not live together in one room).
      </p>
      <br></br>

      <p>
        You have at most{" "}
        <strong>{Math.ceil(treatment.StageDuration / 60.0)} minutes</strong> to
        work on each task. Completing the entire game may take you as long as{" "}
        {Math.ceil((treatment.StageDuration / 60.0) * 6.0)} minutes.{" "}
        <strong>
          If you do not have at least{" "}
          {Math.ceil((treatment.StageDuration / 60.0) * 6.0)} minutes available
          to work on this HIT please return it now.
        </strong>
      </p>
      <br></br>
      {social ? (
        <div>
          <p>
            <strong>
              You will play this game simultaneously with{" "}
              {treatment.playerCount - 1} other participants in real-time
            </strong>
            . As we will explain in more detail later, in each task, you and
            your teammates will submit a single room assignment plan.
            {/*We will evaluate the quality of your*/}
            {/*plan through score and thus all team members will receive the*/}
            {/*same score in each task.*/}
          </p>
          <p>
            At the end of the game, you will have the opportunity to earn a
            bonus payment and the amount is dependent on your accumulated score
            in all {treatment.nRounds} tasks.{" "}
            <strong> Note that "free riding" is not permitted</strong>.{" "}
            <em style={{ color: "red" }}>
              If we detect that you are inactive during a task, you will not
              receive a bonus for that task.
            </em>
          </p>
          <br></br>
        </div>
      ) : (
        <p>
          In each task, you will submit a single room assignment plan. We will
          evaluate the quality of your plan by scoring it in each task. At the
          end of the game, you will have the opportunity to earn a bonus payment
          and the amount is dependent on your accumulated score in all{" "}
          {treatment.nRounds} tasks.{" "}
          <em style={{ color: "red" }}>
            If we detect that you are inactive during a task, you will not
            receive a bonus for that task.
          </em>
        </p>
      )}

      <p>
        The game <strong>must be played on a desktop or laptop</strong>. There
        is NO mobile support
      </p>

      <p>
        <strong>
          For the best experience, please maximize the window containing this
          task or make it as large as possible.
        </strong>
      </p>
      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
    // </Centered>
  );
}
