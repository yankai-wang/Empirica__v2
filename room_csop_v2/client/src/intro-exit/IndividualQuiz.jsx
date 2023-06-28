import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import { Centered, AlertToaster } from "meteor/empirica:core";
import { Alert } from "../components/Alert";
import { Checkbox } from "@blueprintjs/core";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function IndividualQuiz({ previous, next }) {
  const player = usePlayer();
  //console.log("QUIZ");
  const [state, setState] = useState({
    violatedConstraints: "",
    largeError: "",
    mc_1_101: false,
    mc_1_102: false,
    mc_1_103: false,
    mc_1_104: false,
    mc_1_105: false,
    mc_2_101: false,
    mc_2_102: false,
    mc_2_103: false,
    mc_2_104: false,
    mc_2_105: false,
  });

  function handleChange(e) {
    console.log("handlechange");
    const el = e.currentTarget;
    //this.setState({ [el.name]: el.value.trim().toLowerCase() });
    setState((prevState) => ({
      ...prevState,
      [el.name]: el.value.trim().toLowerCase(),
    }));
    // console.log(state);
  }

  function handleEnabledChange(e) {
    const el = e.currentTarget;
    console.log("HandleEnablesChangeRan");
    console.log(el);
    //this.setState({ [el.name]: !this.state[el.name] });
    setState((prevState) => ({
      ...prevState,
      [el.name]: !state[el.name],
    }));
    // console.log(state);
  }

  function handleSubmit(event) {
    console.log("DID THIS EVEN RUNNNN AHHHH");
    event.preventDefault();
    //it should be this.state.nParticipants !== "3" but we don't have "treatment" in QUIZ
    if (
      state.violatedConstraints !== "100" ||
      state.largeError !== "0" ||
      state.mc_1_101 ||
      !state.mc_1_102 || //only this one is correct
      state.mc_1_103 ||
      state.mc_1_104 ||
      state.mc_1_105 ||
      state.mc_2_101 ||
      !state.mc_2_102 || //this one is correct
      state.mc_2_103 ||
      !state.mc_2_104 || //this one is correct
      state.mc_2_105
    ) {
      //I need to put an alert here
      alert(
        "Sorry, you have one or more mistakes. Please ensure that you answer the questions correctly, or go back to the insturctions"
      );
    } else {
      next();
    }
  }

  //const { hasPrev, onPrev } = this.props;
  //const { violatedConstraints, largeError } = state;
  return (
    <div className="quiz" style={{ margin: "0 auto", width: "90%" }}>
      <h1 className="bp3-heading" style={{ fontSize: "64px" }}>
        {" "}
        Quiz{" "}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="bp3-form-group">
          <label className="bp3-label" htmlFor="number-of-participants">
            If you end up NOT assigning all students to room (i.e., at least one
            student remained in the deck) then the score for that task will be:
          </label>
          <div className="bp3-form-content">
            <input
              id="nParticipants"
              className="bp3-input"
              type="number"
              min="-10"
              max="10"
              step="1"
              dir="auto"
              name="largeError"
              value={state.largeError}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>

        <div className="bp3-form-group">
          <label className="bp3-label" htmlFor="number-of-participants">
            For each unsatisfied (i.e., violated) constraint, how many points
            will be deducted from you?
          </label>
          <div className="bp3-form-content">
            <input
              id="violatedConstraints"
              className="bp3-input"
              type="number"
              min="0"
              max="1000"
              step="1"
              dir="auto"
              name="violatedConstraints"
              value={state.violatedConstraints}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>

        <div className="bp3-form-group">
          <label className="bp3-label" htmlFor="neighbor-of-room-101">
            Which of the following rooms is a neighbor of Room 101? Please
            select all that apply.
          </label>
          <div className="bp3-form-content ">
            <div className="bp3-control bp3-checkbox bp3-inline">
              <Checkbox
                name={"mc_1_101"}
                label="Room 101"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox bp3-inline">
              <Checkbox
                name={"mc_1_102"}
                label="Room 102"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox">
              <Checkbox
                name={"mc_1_103"}
                label="Room 103"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox bp3-inline">
              <Checkbox
                name={"mc_1_104"}
                label="Room 104"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox bp3-inline">
              <Checkbox
                name={"mc_1_105"}
                label="Room 105"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
          </div>
        </div>

        <div className="bp3-form-group">
          <label className="bp3-label" htmlFor="neighbor-of-room-101">
            Which of the following rooms is a neighbor of Room 103? Please
            select all that apply.{" "}
          </label>
          <div className="bp3-form-content ">
            <div className="bp3-control bp3-checkbox">
              <Checkbox
                name={"mc_2_101"}
                label="Room 101"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox bp3-inline">
              <Checkbox
                name={"mc_2_102"}
                label="Room 102"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox bp3-inline">
              <Checkbox
                name={"mc_2_103"}
                label="Room 103"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox">
              <Checkbox
                name={"mc_2_104"}
                label="Room 104"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
            <div className="bp3-control bp3-checkbox">
              <Checkbox
                name={"mc_2_105"}
                label="Room 105"
                onChange={(e) => handleEnabledChange(e)}
              />
            </div>
          </div>
        </div>
        <Button handleClick={previous} autoFocus>
          <p>Previous</p>
        </Button>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
