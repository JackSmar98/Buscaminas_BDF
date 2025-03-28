import React from "react";
import "../styles/GameMessage.css";

const GameMessage = ({ gameStatus, elapsedTime, playerName }) => {
  let message = "";
  let className = "game-message";

  if (gameStatus === "won") {
    message = `¡Felicidades ${playerName}! Has ganado en ${elapsedTime} segundos`;
    className += " success";
  } else if (gameStatus === "lost") {
    message = `¡Has perdido ${playerName}! Inténtalo de nuevo`;
    className += " error";
  }

  return (
    <div className={className}>
      <h2>{message}</h2>
      <p>Tu puntuación ha sido registrada automáticamente</p>
      <p>Presiona "Reiniciar juego" para jugar de nuevo</p>
    </div>
  );
};

export default GameMessage;
