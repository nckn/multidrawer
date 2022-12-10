import * as React from "react";

//styles
import styles from "../styles/JoinForm.module.css";

export default function JoinForm(props) {
  const [name2, setName2] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [qtdBalls, setQtdBalls] = React.useState(99);
  const [gameOption, setGameOption] = React.useState("default");

  switch (props.type) {
    case "room":
      return (
        <>
          <label className={styles.label}>Seu nome</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            name="room"
            type="text"
          ></input>
          <button
            className={`${styles.btn_enter} ${styles.bgc_green}`}
            onClick={() => props.btnFunction(props.room, name2)}
          >
            Log ind
          </button>
        </>
      );
    case "home":
      return (
        <>
          <label className={styles.label}>Spillets navn</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            name="room"
            type="text"
          ></input>
          <label className={styles.label}>Dit navn</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            name="room"
            type="text"
          ></input>
          <button
            className={`${styles.btn_enter} ${styles.bgc_green}`}
            onClick={() => props.btnFunction(room, name2, "join")}
          >
            Log ind
          </button>
          <span className={styles.division}> ............. </span>
          <button
            className={`${styles.btn_enter} ${styles.bgc_dark_blue}`}
            onClick={() => props.btnFunction(room, name2, "create")}
          >
            Opret spil
          </button>
        </>
      );
    case "host":
      return (
        <>
          <label className={styles.label}>Spillets navn</label>
          <input
            autoComplete="off"
            className={styles.input}
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            name="room"
            type="text"
          ></input>
          {props.roomAvailability && <p> Spil er optaget </p>}
          <label className={styles.label}>Antal bolde</label>
          <input
            className={styles.input}
            value={qtdBalls}
            onChange={(e) => setQtdBalls(e.target.value)}
            name="qtdBalls"
            min={50}
            max={99}
            type="number"
          ></input>
          <label>Valgmuligheder: </label>
          <select
            name="cars"
            id="cars"
            onChange={(e) => setGameOption(e.target.value)}
          >
            <option value="default">default</option>
            <option value="new">new</option>
          </select>
          <button
            className={`${styles.btn_enter} ${styles.bgc_green}`}
            onClick={() => props.btnFunction(room, qtdBalls, gameOption)}
          >
            Criar
          </button>
        </>
      );
  }
}
