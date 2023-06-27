import { EmpiricaClassic } from "@empirica/core/player/classic";
import { EmpiricaContext } from "@empirica/core/player/classic/react";
import { EmpiricaMenu, EmpiricaParticipant } from "@empirica/core/player/react";
import React from "react";
import { Game } from "./Game";
import { ExitSurvey } from "./intro-exit/ExitSurvey";
import { Introduction } from "./intro-exit/Introduction";
import { MyConsent } from "./intro-exit/Consent"
import { Overview } from "./intro-exit/Overview"
import {TaskDetails} from "./intro-exit/TaskDetails"
import {ConstraintsDetails} from "./intro-exit/ConstraintsDetails"
import {RoomArrangements} from "./intro-exit/RoomArrangements"
import {MoreAboutBonus} from "./intro-exit/MoreAboutBonus"
import {UIOverview} from "./intro-exit/UIOverview"
import {IndividualQuiz} from "./intro-exit/IndividualQuiz"
import {
  Chat,
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound
}from "@empirica/core/player/classic/react";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerKey = urlParams.get("participantKey") || "";

  const { protocol, host } = window.location;
  const url = `${protocol}//${host}/query`;
  const player=usePlayer()
  console.log(player)





  function introSteps({ game, player }) {
    const treatment=player.get('treatment')
    const steps= [Overview,Introduction,TaskDetails,ConstraintsDetails, RoomArrangements];
    if(treatment.playerCount >1){
      steps.push(TeamDetails, SocialInteractionDetails);
    }
    steps.push(MoreAboutBonus, UIOverview);
   // if (treatment.playerCount > 1) {
   //   steps.push(GroupQuiz);
  //  } else {
   //   steps.push(IndividualQuiz)
   // }
  
    return steps;

  }
  

  function exitSteps({ game, player }) {
    return [ExitSurvey];
  }
// The my consent form shows up if you have cleared to localhistory in the player console
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
