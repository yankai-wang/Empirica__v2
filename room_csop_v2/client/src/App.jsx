import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Introduction } from "./intro-exit/Introduction";
import { MyConsent } from "./intro-exit/Consent"
import { Overview } from "./intro-exit/Overview"

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;
  console.log(Game)
  function introSteps({ game, player }) {
    return [Overview,Introduction];
  }
  /*
  Empirica.introSteps((game, treatment) => {
    const steps = [Overview, TaskDetails, ConstraintsDetails, RoomArrangements];
    if (game.treatment.playerCount > 1) {
      steps.push(TeamDetails, SocialInteractionDetails);
    }
    steps.push(MoreAboutBonus, UIOverview);
  
    if (game.treatment.playerCount > 1) {
      steps.push(GroupQuiz);
    } else {
      steps.push(IndividualQuiz);
    }
  
    return steps;
  });
  */
  function exitSteps({ game, player }) {
    return [ExitSurvey];
  }

  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext consent ={MyConsent} introSteps={introSteps} exitSteps={exitSteps}>
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
