import React from "react";
import "../styles/GameControls.css";

const GameControls = ({
  setDifficulty,
  initializeBoard,
  toggleScores,
  showScores,
}) => {
  return (
    <div className="game-controls">
      <div className="difficulty-controls">
        <button onClick={() => setDifficulty("easy")}>Fácil</button>
        <button onClick={() => setDifficulty("medium")}>Medio</button>
        <button onClick={() => setDifficulty("hard")}>Difícil</button>
      </div>

      <div className="game-actions">
        <button onClick={initializeBoard}>Reiniciar juego</button>
        <button onClick={toggleScores}>
          {showScores ? "Volver al juego" : "Ver puntuaciones"}
        </button>
      </div>
    </div>
  );
};

export default GameControls;
