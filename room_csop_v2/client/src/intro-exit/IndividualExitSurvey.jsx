import React, { useState, useEffect } from "react";

// import {Centered} from "meteor/empirica:core";

import { Radio, RadioGroup } from "@blueprintjs/core";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function IndividualExitSurvey ({ next }) {
  // static stepName = "ExitSurvey";
  const [state, setState] = useState({
    timeReasonable: "",
    uiProblems: "",
    instructionsClear: "",
    fair: "",
    feedback: "",
    strategyQ1: "",
    strategyQ2: "",
    strategyQ3: "",
    strategyQ4: ""
  });

  function handleChange (event) {
    const el = event.currentTarget;
    // this.setState({ [el.name]: el.value });
    setState((prevState) => ({
      ...prevState,
      [el.name]: el.value,
    }));
  };

  function handleSubmit (event) {
    event.preventDefault();
    player.set("exitSurvey", state);
    next();
  };

  function exitMessage (player, game) {
    return (
      <div>
        {" "}
        <h1> Exit Survey </h1>
        <br />
        <h3>
          Please submit the following code to receive your bonus:{" "}
          <em>{player.id}</em>.
        </h3>
        <p>
          You final{" "}
          <strong>
            bonus for the part of Room Assignment Game{" "}
            <em>is ${player.get("bonus") || 0}</em>
          </strong>{" "}
        </p>
      </div>
    );
  };

  function exitForm () {
    const {
      timeReasonable,
      uiProblems,
      instructionsClear,
      fair,
      feedback,
      strategyQ2,
      strategyQ3,
      strategyQ4
    } = state;

    return (
      <div>
        {" "}
        <p>
          Please answer the following short survey. You do not have to provide
          any information you feel uncomfortable with.
        </p>
        <br />
        <form onSubmit={(e) => handleSubmit(e)}>
          {/*<div className="pt-form-group">*/}
          {/*<div className="pt-form-content">*/}
          {/*<RadioGroup*/}
          {/*name="strategyQ1"*/}
          {/*label="Of the following statements select the one that most accurately describes your general approach to solving these problems?"*/}
          {/*onChange={(e) => handleChange(e)}*/}
          {/*selectedValue={strategyQ1}*/}
          {/*>*/}
          {/*<Radio*/}
          {/*label="I allocated all students to rooms for which they had the highest values, and then tried to resolve conflicts"*/}
          {/*value="optimization-then-constraints"*/}
          {/*/>*/}
          {/*<Radio*/}
          {/*label="I allocated all students with conflicts, and only when all conflicts were resolved did I try moving students to higher-value rooms"*/}
          {/*value="constraints-then-optimization"*/}
          {/*/>*/}
          {/*<Radio*/}
          {/*label="I allocated students to rooms until I ran into a conflict and then tried to resolve it."*/}
          {/*value="constraints-and-optimization-together"*/}
          {/*/>*/}
          {/*</RadioGroup>*/}
          {/*</div>*/}
          {/*</div>*/}

          <div className="pt-form-group">
            <div className="pt-form-content">
              <RadioGroup
                name="strategyQ2"
                label="If you had assigned all students to rooms and had no conflicts, which of the following would you be most likely to do?"
                onChange={(e) => handleChange(e)}
                selectedValue={strategyQ2}
              >
                <Radio
                  label="Submit your solution and move on the next task"
                  value="no-exploration"
                />
                <Radio
                  label="Try to increase your score by moving students around as long as you didn’t generate any new conflicts"
                  value="optimize-while-no-new-conflicts"
                />
                <Radio
                  label="Try to increase your score by moving students around even if it meant generating new conflicts."
                  value="explore-through-conflicts"
                />
              </RadioGroup>
            </div>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <RadioGroup
                name="strategyQ3"
                label="If you had assigned some (but not all) students to rooms and had encountered one or more conflicts, would you:"
                onChange={(e) => handleChange(e)}
                selectedValue={strategyQ3}
              >
                <Radio
                  label="Put off resolving the conflict(s) until all students had been assigned?"
                  value="tolerate-conflict"
                />
                <Radio
                  label="Stop assigning students to rooms until conflict(s) had been resolved?"
                  value="can-not-tolerate-conflict"
                />
                <Radio
                  label="Continue assigning students as long as no more than one conflict were present?"
                  value="little-conflict-tolerance"
                />
              </RadioGroup>
            </div>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <RadioGroup
                name="strategyQ4"
                label="When assigning a student to a room, did you focus more on:"
                onChange={(e) => handleChange(e)}
                selectedValue={strategyQ4}
              >
                <Radio
                  label="Which room had the highest score?"
                  value="optimization"
                />
                <Radio
                  label="Which room(s) would avoid generating conflicts?"
                  value="constraint-satisfaction"
                />
              </RadioGroup>
            </div>
          </div>

          <div className="form-line thirds">
            <div className="pt-form-group">
              <label className="pt-label" htmlFor="age">
                Were the instructions clear?
              </label>
              <div className="pt-form-content">
                <textarea
                  className="pt-input pt-fill"
                  dir="auto"
                  name="instructionsClear"
                  value={instructionsClear}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="pt-form-group">
              <label className="pt-label" htmlFor="age">
                Was the time limit per task reasonable?
              </label>
              <div className="pt-form-content">
                <textarea
                  className="pt-input pt-fill"
                  dir="auto"
                  name="timeReasonable"
                  value={timeReasonable}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="pt-form-group">
              <label className="pt-label" htmlFor="age">
                Did you encounter any problems with the user interface?
              </label>
              <div className="pt-form-content">
                <textarea
                  className="pt-input pt-fill"
                  dir="auto"
                  name="uiProblems"
                  value={uiProblems}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>

          <div className="form-line thirds">
            <div className="pt-form-group">
              <label className="pt-label" htmlFor="age">
                Do you feel the pay was fair?
              </label>
              <div className="pt-form-content">
                <textarea
                  className="pt-input pt-fill"
                  dir="auto"
                  name="fair"
                  value={fair}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="pt-form-group">
              <label className="pt-label" htmlFor="age">
                Feedback, including problems you encountered.
              </label>
              <div className="pt-form-content">
                <textarea
                  className="pt-input pt-fill"
                  dir="auto"
                  name="feedback"
                  value={feedback}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="pt-button pt-intent-primary">
            Submit
            <span className="pt-icon-standard pt-icon-key-enter pt-align-right" />
          </button>
        </form>{" "}
      </div>
    );
  };


  
  // const { player, game } = this.props;
  const player = usePlayer();
  const game = useGame();

  return (
      <div className="exit-survey">
        {exitMessage(player, game)}
        <hr />
        {exitForm()}
      </div>
  )
  
}
