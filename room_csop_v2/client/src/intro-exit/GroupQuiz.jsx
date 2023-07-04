//import React from "react";

//import { Centered, AlertToaster } from "meteor/empirica:core";

import { Radio, RadioGroup } from "@blueprintjs/core";

import { Checkbox } from "@blueprintjs/core";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import { Centered, AlertToaster } from "meteor/empirica:core";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export function GroupQuiz({ previous, next }) {
  console.log("GROUPQUIZ");
  const player = usePlayer();
  console.log(player.get("treatment"));
  console.log(player.get("treatment").playerCount);
  const [state, setState] = useState({
    nParticipants: "",
    scoreOption: "",
    idle: "",
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
    emptyOption: "",
    num_players: 0,
  });

  state.num_players = player.get("treatment").playerCount;

  function handleChange(e) {
    const el = e.currentTarget;
    //this.setState({ [el.name]: el.value.trim().toLowerCase() });
    setState((prevState) => ({
      ...prevState,
      [el.name]: el.value.trim().toLowerCase(),
    }));
  }

  function handleRadioChange(event) {
    const el = event.currentTarget;
    console.log("el", el);
    console.log("ev", event);
    setState((prevState) => ({ ...prevState, [el.name]: el.value }));
  }

  function handleEnabledChange(e) {
    const el = e.currentTarget;
    setState((prevState) => ({
      ...prevState,
      [el.name]: !state[el.name],
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(state.num_players.toString());
    //it should be this.state.nParticipants !== "3" but we don't have "treatment" in QUIZ
    if (
      state.nParticipants !== state.num_players.toString() ||
      state.scoreOption !== "all" ||
      state.idle !== "100" ||
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
      state.mc_2_105 ||
      state.emptyOption !== "yes"
    ) {
      //I need to put an alert here
      alert(
        "Sorry, you have one or more mistakes. Please ensure that you answer the questions correctly, or go back to the insturctions"
      );
    } else {
      next();
    }
  }
  return (
    <div className="quiz" style={{ margin: "0 auto", width: "90%" }}>
      <h1 className="bp3-heading" style={{ fontSize: "64px" }}>
        {" "}
        Quiz{" "}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="bp3-form-group">
          <label className="bp3-label" htmlFor="number-of-participants">
            How many participants will play at the same time, including
            yourself?
          </label>
          <div className="bp3-form-content">
            <input
              id="nParticipants"
              className="bp3-input"
              type="number"
              min="0"
              max="150"
              step="1"
              dir="auto"
              name="nParticipants"
              value={state.nParticipants}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>

        <div className="bp3-form-group">
          <div className="bp3-form-content">
            <RadioGroup
              label="Select the true statement about the score:"
              onChange={(e) => handleRadioChange(e)}
              selectedValue={state.scoreOption}
              name="scoreOption"
              required
            >
              <Radio
                label="I will score points only based on the assignments that I make"
                value="single"
              />
              <Radio
                label="We will submit only one answer as a team and therefore we will all get the same score."
                value="all"
              />
            </RadioGroup>
          </div>
        </div>

        <div className="bp3-form-group">
          <div className="bp3-form-content">
            <RadioGroup
              name="emptyOption"
              label="is it ok to have some rooms empty? (the answer is 'Yes')"
              onChange={(e) => handleRadioChange(e)}
              selectedValue={state.emptyOption}
              required
            >
              <Radio label="Yes!" value="yes" />
              <Radio label="No!" value="no" />
            </RadioGroup>
          </div>
        </div>

        <div className="bp3-form-group">
          <label className="bp3-label" htmlFor="number-of-participants">
            If your team ended up NOT assigning all students to room (i.e., at
            least one student remained in the deck) then your score in that task
            will be:
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
              id="nParticipants"
              className="bp3-input"
              type="number"
              min="0"
              max="1000"
              step="1"
              dir="auto"
              name="idle"
              value={state.idle}
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
