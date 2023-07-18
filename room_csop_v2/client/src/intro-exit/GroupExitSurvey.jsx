import React from "react";

// import { Centered } from "meteor/empirica:core";

import {
  Button,
  Classes,
  FormGroup,
  RadioGroup,
  TextArea,
  Intent,
  Radio,
} from "@blueprintjs/core";

export default class GroupExitSurvey extends React.Component {
  static stepName = "ExitSurvey";
  state = {
    strategy: "",
    fair: "",
    feedback: "",
    satisfied: "",
    workedWell: "",
    perspective: "",
    chatComfort: "",
    chatUseful: "",
    events: "",
  };

  handleChange = (event) => {
    const el = event.currentTarget;
    this.setState({ [el.name]: el.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  exitMessage = (player, game) => {
    return (
      <div>
        {" "}
        <h1> Exit Survey </h1>
        <br />
        <h3>
          Please submit the following code to receive your bonus:{" "}
          <em>{player._id}</em>.
        </h3>
        <p>
          You final{" "}
          <strong>
            <em>bonus is ${player.get("bonus") || 0}</em>
          </strong>{" "}
        </p>
      </div>
    );
  };

  exitForm = () => {
    const {
      strategy,
      fair,
      feedback,
      satisfied,
      workedWell,
      perspective,
      chatComfort,
      events,
      chatUseful,
    } = this.state;

    return (
      <div>
        {" "}
        <p>
          Please answer the following short survey. You do not have to provide
          any information you feel uncomfortable with.
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className="pt-form-group">
            <div className="pt-form-content">
              <RadioGroup
                name="satisfied"
                label="How satisfied are you with your team's performance in the game?"
                onChange={this.handleChange}
                selectedValue={satisfied}
              >
                <Radio
                  label="Very satisfied"
                  value="verySatisfied"
                  className={"pt-inline"}
                />
                <Radio
                  label="Satisfied"
                  value="somewhatSatisfied"
                  className={"pt-inline"}
                />
                <Radio
                  label="Neutral"
                  value="neutral"
                  className={"pt-inline"}
                />

                <Radio
                  label="Dissatisfied"
                  value="somewhatDissatisfied"
                  className={"pt-inline"}
                />
                <Radio
                  label="Very dissatisfied"
                  value="veryDissatisfied"
                  className={"pt-inline"}
                />
              </RadioGroup>
            </div>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <RadioGroup
                name="workedWell"
                label="Do you think your team worked well together?"
                onChange={this.handleChange}
                selectedValue={workedWell}
              >
                <Radio
                  label="Strongly agree"
                  value="stronglyAgree"
                  className={"pt-inline"}
                />
                <Radio label="Agree" value="agree" className={"pt-inline"} />
                <Radio
                  label="Neutral"
                  value="neutral"
                  className={"pt-inline"}
                />

                <Radio
                  label="Disagree"
                  value="disagree"
                  className={"pt-inline"}
                />

                <Radio
                  label="Strongly disagree"
                  value="stronglyDisagree"
                  className={"pt-inline"}
                />
              </RadioGroup>
            </div>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <RadioGroup
                name="perspective"
                label="How valuable do you think your perspective was to the end results?"
                onChange={this.handleChange}
                selectedValue={perspective}
              >
                <Radio
                  label="Extremely valuable"
                  value="extremelyValuable"
                  className={"pt-inline"}
                />
                <Radio
                  label="Valuable"
                  value="valuable"
                  className={"pt-inline"}
                />
                <Radio
                  label="Neutral"
                  value="neutral"
                  className={"pt-inline"}
                />
                <Radio
                  label="Invaluable"
                  value="invaluable"
                  className={"pt-inline"}
                />
                <Radio
                  label="Extremely invaluable"
                  value="extremelyInvaluable"
                  className={"pt-inline"}
                />
              </RadioGroup>
            </div>
          </div>

          <div className="pt-form-group">
            <div className="pt-form-content">
              <RadioGroup
                name="chatComfort"
                label="How comfortable were you in sharing your perspective with the team through the chat?"
                onChange={this.handleChange}
                selectedValue={chatComfort}
              >
                <Radio
                  label="Very comfortable"
                  value="extremelyValuable"
                  className={"pt-inline"}
                />
                <Radio
                  label="Comfortable"
                  value="comfortable"
                  className={"pt-inline"}
                />
                <Radio
                  label="Neutral"
                  value="neutral"
                  className={"pt-inline"}
                />

                <Radio
                  label="Uncomfortable"
                  value="uncomfortable"
                  className={"pt-inline"}
                />

                <Radio
                  label="Very uncomfortable"
                  value="veryUncomfortable"
                  className={"pt-inline"}
                />
              </RadioGroup>
            </div>
          </div>

          <div className="form-line thirds">
            <FormGroup
              className={"form-group"}
              inline={false}
              label={"How would you describe your strategy in the game?"}
              labelFor={"strategy"}
              //className={"form-group"}
            >
              <TextArea
                id="strategy"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={strategy}
                fill={true}
                name="strategy"
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Do you feel the pay was fair?"}
              labelFor={"fair"}
              //className={"form-group"}
            >
              <TextArea
                id="fair"
                name="fair"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={fair}
                fill={true}
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Feedback, including problems you encountered."}
              labelFor={"feedback"}
              //className={"form-group"}
            >
              <TextArea
                id="feedback"
                name="feedback"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={feedback}
                fill={true}
              />
            </FormGroup>
          </div>

          <div className="form-line thirds">
            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Was the in-game chat feature useful?"}
              labelFor={"chatUseful"}
              //className={"form-group"}
            >
              <TextArea
                id="chatUseful"
                name="chatUseful"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={chatUseful}
                fill={true}
              />
            </FormGroup>

            <FormGroup
              className={"form-group"}
              inline={false}
              label={"Was the events log feature useful?"}
              labelFor={"events"}
              //className={"form-group"}
            >
              <TextArea
                id="events"
                name="events"
                large={true}
                intent={Intent.PRIMARY}
                onChange={this.handleChange}
                value={events}
                fill={true}
              />
            </FormGroup>
          </div>

          <button type="submit" className="pt-button pt-intent-primary">
            Submit
            <span className="pt-icon-standard pt-icon-key-enter pt-align-right" />
          </button>
        </form>{" "}
      </div>
    );
  };

  componentWillMount() {}

  render() {
    const { player, game } = this.props;
    return (
      <Centered>
        <div className="exit-survey">
          {this.exitMessage(player, game)}
          <hr />
          {this.exitForm()}
        </div>
      </Centered>
    );
  }
}
