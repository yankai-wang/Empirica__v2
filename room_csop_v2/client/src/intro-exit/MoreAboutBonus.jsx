import React from "react";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound
}from "@empirica/core/player/classic/react";
//import {Centered} from "meteor/empirica:core";

export function MoreAboutBonus ({previous,next }) {
  const player =usePlayer()
  const treatment= player.get('treatment')
  const social = treatment.playerCount >1
    return (
        <div className="instructions" style={{ margin: "0 auto", width: "95%" }}>
          <h1 className="bp3-heading" style={{ fontSize: "64px" }}> Scores and Bonuses</h1>

          <p>
            In each task, we use "score" to evaluate the quality of the room
            assignment plan that {social ? "your team" : "you"} came up with.{" "}
            <strong style={{ color: "red" }}>
              {" "}
              Your score starts counting only when you have a complete
              assignment
            </strong>{" "}
            (that is, each student has been assigned to a room).
          </p>

          <p>The score of your assignment is calculated as:</p>

          <div style={{ textAlign: "center" }}>
            <p>
              <strong style={{ color: "blue" }}>
                S = The sum of students' ratings of their assigned rooms - 100 *
                the number of violated constraints
              </strong>
            </p>
          </div>

          <p>
            That means,{" "}
            <strong>
              for each constraint you violate, you get 100 points deducted.
            </strong>
          </p>

          {social ? (
            <p>
              As a team, <strong>you will submit ONE answer per task</strong>{" "}
              and therefore{" "}
              <strong>
                all team members will have the same score on each task
              </strong>.
            </p>
          ) : null}

          <p>
            You will get a base pay of <strong>$2</strong> for participating. There are two parts of the bonus that you will have opportunity to
            earn in each task:
          </p>

          <p>
            1. <strong>"performance-based bonus":</strong> When your score is
            positive, no matter whether your answer is the BEST possible
            assignment or not. The exchange rate is{" "}
            <strong style={{ color: "red" }}>
              {/* {Math.round(1 / treatment.conversionRate)}  */}400
              game points = $1 bonus
            </strong>.
          </p>

          <p>
            2. <strong>"optimal assignment bonus" </strong>: When your answer is
            the BEST possible assignment, you get{" "}
            <strong style={{ color: "red" }}>
              an additional bonus of 
              {/* ${treatment.optimalSolutionBonus} */} $2
               in that
              task
            </strong>.
          </p>

          <p>
            Therefore,&nbsp;
            <strong>
              big part of the bonus is for finding the BEST possible
              assignment{" "}
            </strong>{" "}
            (i.e., "optimal assignment bonus", which can be up to $5 total).
            Also,&nbsp;
            <strong>
              you can earn more game points (i.e., more performance-based
              bonuses) from the difficult tasks{" "}
            </strong>{" "}
            compared to the easier ones (more students/rooms means more possible
            bonus).
          </p>

          {social ? (
            <div style={{ textAlign: "center" }}>
              <p>
                <strong>
                  Together with your teammates, you should try to find a
                  complete room assignment with a score that is as high as
                  possible to earn more bonus in each task!
                </strong>
              </p>
            </div>
          ) : null}

          <p>
            <strong>
              {social ? "Remember, free riding is not permitted." : ""} If we
              detect that you are inactive during a task, you will not receive a
              bonus for that task.
            </strong>
          </p>

          <Button handleClick={previous} autoFocus>
        <p>Previous</p>
      </Button>
      
          <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
        </div>
    );
  }

