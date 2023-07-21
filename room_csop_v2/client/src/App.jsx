import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Introduction } from "./intro-exit/Introduction";
import { MyConsent } from "./intro-exit/Consent";
import { Overview } from "./intro-exit/Overview";
import { TaskDetails } from "./intro-exit/TaskDetails";
import { ConstraintsDetails } from "./intro-exit/ConstraintsDetails";
import { RoomArrangements } from "./intro-exit/RoomArrangements";
import { MoreAboutBonus } from "./intro-exit/MoreAboutBonus";
import { UIOverview } from "./intro-exit/UIOverview";
import { IndividualQuiz } from "./intro-exit/IndividualQuiz";
import { Thanks } from "./intro-exit/Thanks";
import { Sorry } from "./intro-exit/Sorry";
import { TeamDetails } from "./intro-exit/TeamDetails";
import { SocialInteractionDetails } from "./intro-exit/SocialInteractionDetails";
import { GroupQuiz } from "./intro-exit/GroupQuiz";
import { GroupExitSurvey } from "./intro-exit/GroupExitSurvey";
import { IndividualExitSurvey } from "./intro-exit/IndividualExitSurvey";

import {
  Chat,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound,
} from "@empirica/core/player/classic/react";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;

  function introSteps({ game, player }) {
    const treatment = player.get("treatment");
    // const steps = [Introduction]; // for testing purposes
    const steps = [Overview, TaskDetails, ConstraintsDetails, RoomArrangements];
    if (treatment.playerCount > 1) {
      steps.push(TeamDetails, SocialInteractionDetails);
    }
    steps.push(MoreAboutBonus, UIOverview);
    if (treatment.playerCount > 1) {
      steps.push(GroupQuiz);
    } else {
      steps.push(IndividualQuiz);
    }
    //Testing purposes
    steps.push(Introduction);
    return steps;
  }

  function exitSteps({ game, player }) {
    const treatment = player.get("treatment");
    console.log("player status", player.get("status"), player.get("ended"))
    // if (player.exitStatus !== "finished") {
    if (player.get("ended") !== "game ended") {
      return [Sorry];
    }
    // if (game.players.length > 1) {
    // very weird that game.get("players") is undefined here, so use treatment.playerCount instead
    if (treatment.playerCount > 1) {
      return [GroupExitSurvey, Thanks];
    } else {
      return [IndividualExitSurvey, Thanks];
    }
  }
  // The my consent form shows up if you have cleared to localhistory in the player console
  return (
    <EmpiricaParticipant url={url} ns={playerKey} modeFunc={EmpiricaClassic}>
      <div className="h-screen relative">
        <EmpiricaMenu position="bottom-left" />
        <div className="h-full overflow-auto">
          <EmpiricaContext
            consent={MyConsent}
            introSteps={introSteps}
            exitSteps={exitSteps}
          >
            <Game />
          </EmpiricaContext>
        </div>
      </div>
    </EmpiricaParticipant>
  );
}
