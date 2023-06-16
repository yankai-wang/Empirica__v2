import React, {useState,useEffect} from "react";
import _ from 'lodash'
import styles from './main.less'

//mport { Centered } from "meteor/empirica:core";
import {HTMLTable } from "@blueprintjs/core";
import { Button } from "../components/Button";
import {
  usePlayer,
  usePlayers,
  useStage,
  useGame,
  useRound
}from "@empirica/core/player/classic/react";
// student names
const studentNames = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// room numbers
const roomNumbers = _.range(101, 111);

// constraint types
const constraintTypes = {
  0: "must live in the same room",
  1: "can't live in the same room",
  2: "must be neighbors",
  3: "can't live in the same room or be neighbors"
};

export const exampleTaskData = {
  _id: 0,
  optimal: 220,
  difficulty: "easy",
  students: studentNames.slice(0, 4), // how many students
  rooms: roomNumbers.slice(0, 3), // how many rooms
  constraints: [
    {
      _id: 0, // i.e., A and B can't live in the same room or be neighbors.
      pair: ["A", "B"],
      type: 3,
      text: constraintTypes[3]
    },
    {
      _id: 1, // i.e., B and C must live in the same room.
      pair: ["B", "C"],
      type: 0,
      text: constraintTypes[0]
    }
  ],
  payoff: {
    // the payoff of placing Student i in Room j (e.g., `payoff[i][j]`)
    A: { 101: 20, 102: 80, 103: 65 },
    B: { 101: 67, 102: 90, 103: 76 },
    C: { 101: 85, 102: 82, 103: 79 },
    D: { 101: 20, 102: 75, 103: 78 }
  }
};

export function TaskDetails ({ previous,next }) {
  
  const player =usePlayer()
  const treatment= player.get('treatment')
 
 // console.log('This is the treatment page')
  const [state, setState] = useState({
    hovered: false,
    studentARoom: "deck",
    studentBRoom: "deck",
    studentCRoom: "deck",
    studentDRoom: "deck",
    score: 0
  });
  

  useEffect(() => {
    updateScore();
  }, [state.studentARoom, state.studentBRoom, state.studentCRoom, state.studentDRoom]);

  
  function updateScore() {
    setState(prevState => ({
      ...prevState,
      score: 0,
    }));
    exampleTaskData.students.forEach(student => {
      exampleTaskData.rooms.forEach(room => {
        if (state[`student${student}Room`] === room) {
          setState(prevState => ({
            ...prevState,
            score: prevState.score + exampleTaskData.payoff[student][room],
          }));
        }
      });
    });
    //if anyone in the deck, then score is 0
    exampleTaskData.students.forEach(student => {
      if (state[`student${student}Room`] === "deck") {
        //if anyone in the deck, score is 0
        setState(prevState => ({
          ...prevState,
          score: "N/A",
        }));
      }
    });
  } 


  
    return (
        <div className="instructions">
          <h1 className={"text-lg font-medium text-gray-1000"}> Room Assignment Tasks </h1>
          <br></br>
          <p>
            In each task (or round), you will be asked to{" "}
            <strong>assign students to dorm rooms</strong>. Students express
            their degree of satisfaction for living in a room as a number
            between 0 and 100 (the higher the rating, the more satisfied the
            student is).{" "}
          </p>

          <p>
            You are provided with a handy <strong>drag and drop</strong> tool to
            solve the problem. To assign a student into a room, drag the icon of
            that student and drop it into the room. Try this example:
          </p>

          <div className="task">
            <div className="left">
              <div className="payoff">
                <h5>Payoff</h5>
                <HTMLTable>
                  <thead>
                    <tr>
                      <th>Rooms</th>
                      {exampleTaskData.rooms.map(room => (
                        <th key={room}>{room}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {exampleTaskData.students.map(student => (
                      <tr key={student}>
                        <th>Student {student}</th>
                        {exampleTaskData.rooms.map(room => (
                          <td
                            key={room}
                            className={
                              state[`student${student}Room`] === room
                                ? "active"
                                : null
                            }
                          >
                            {exampleTaskData.payoff[student][room]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </HTMLTable>
              </div>

              <div className="info">
                <div className="score">
                  <h5>Score</h5>
                  <h2>{state.score}</h2>
                </div>
              </div>
            </div>
            <div className="board">
              <div className="all-rooms">
                {renderRoom("deck", true)}
                <div className="rooms">
                  {exampleTaskData.rooms.map(room =>
                    renderRoom(room, false)
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <p>
              <strong>
                NOTE: ALL the students HAVE to be assigned to a room in order
                for your score to count.
              </strong>
            </p>
          </div>
  
          <Button handleClick={previous} autoFocus>
        <p>Previous</p>
      </Button>
      
          <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
        </div>
    );
  




  

  function handleDragOver(e) {
    //console.log('Handle Drag over')
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setState(prevState => ({
      ...prevState,
      hovered: true, }));
  };

  function handleDragLeave (e) {
   // console.log('HandleDragLeave',e)
    setState(prevState => ({
      ...prevState,
      hovered: false, }));
  };
 /*
  handleDrop = (room, e) => {
    const student = e.dataTransfer.getData("text/plain");
    this.setState({ hovered: false });
    let obj = {};
    obj[`student${student}Room`] = room;
    this.setState(obj);
  };
  */
  function handleDrop(room, e) {
    const student = e.dataTransfer.getData("text/plain");
    console.log('Handle Drop')
    setState(prevState => ({
      ...prevState,
      hovered: false,
      [`student${student}Room`]: room,
    }));

  };

  function renderRoom(room, isDeck) {
    const { hovered } = state;
    const students = [];
    exampleTaskData.students.forEach(student => {
      if (state[`student${student}Room`] === room) {
        students.push(student);
      }
    });
    //functio seems fine here 

    const classNameRoom = isDeck ? "deck bp3-elevation-1" : "room";
    const classNameHovered = hovered ? "bp3-elevation-3" : "";
    return (
      <div
        key={room}
        onDrop={(e) => handleDrop(room,e)}
        onDragOver={(e) =>handleDragOver(e)}
        onDragLeave={(e) =>handleDragLeave(e)}
        className={`bp3-card ${classNameRoom} ${classNameHovered}`}
      >
        {isDeck ? null : <h6 className={'bp3-heading'}>Room {room}</h6>}
        {students.map(student => renderStudent(student))}
      </div>
    );
    
  }

  function studentHandleDragStart(student, e) {
    e.dataTransfer.setData("text/plain", student);
  };

  function studentHandleDragOver(e)  {
    e.preventDefault();
  };

  function studentHandleDragEnd(e) {

  };

  function renderStudent(student) {
    const style = {};
    const cursorStyle = { cursor: "move" };
    return (
      <div
        key={student}
        draggable={true}
        onDragStart={(e) => studentHandleDragStart(student,e)}
        onDragOver={e => studentHandleDragOver(e)}
        onDragEnd={e => studentHandleDragEnd(e)}
        className="student"
        style={cursorStyle}
      >
        {/* <span className="icon bp3-icon-standard bp3-icon-person" /> */}
        <span className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
            <path
              style={style}
              d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"
            />
          </svg>
        </span>
        <span className="letter">{student}</span>
      </div>
    );
  }
}