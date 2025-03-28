import React, { useState } from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import GameBoard from "./GameBoard";
import PlayerRegistration from "./PlayerRegistration";

const Minesweeper = () => {
  const {
    board,
    boardSize,
    mineCount,
    flagCount,
    gameStatus,
    elapsedTime,
    flagMode,
    handleCellClick,
    toggleFlagMode,
    setDifficulty,
    initializeBoard,
    playerName,
    gameStarted,
    registerPlayer,
  } = useGameLogic();

  // Estilos básicos
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
    },
    controls: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    button: {
      padding: "8px 16px",
      cursor: "pointer",
      backgroundColor: "#4a6ea9",
      color: "white",
      border: "none",
      borderRadius: "4px",
    },
    flagButton: {
      padding: "8px 16px",
      cursor: "pointer",
      backgroundColor: flagMode ? "#e67e22" : "#4a6ea9",
      color: "white",
      border: "none",
      borderRadius: "4px",
    },
    status: {
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "20px",
      padding: "10px",
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
    },
    message: {
      padding: "15px",
      margin: "15px 0",
      borderRadius: "5px",
      textAlign: "center",
      backgroundColor: gameStatus === "won" ? "#d4edda" : "#f8d7da",
      color: gameStatus === "won" ? "#155724" : "#721c24",
      display: gameStatus !== "playing" ? "block" : "none",
    },
  };

  const getMessage = () => {
    if (gameStatus === "won") {
      return `¡Felicidades ${playerName}! Has ganado en ${elapsedTime} segundos`;
    } else if (gameStatus === "lost") {
      return `¡Has perdido ${playerName}! Inténtalo de nuevo`;
    }
    return "";
  };

  // Si el juego no ha comenzado, mostrar formulario de registro
  if (!gameStarted) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Buscaminas</h1>
        <PlayerRegistration onPlayerRegistered={registerPlayer} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Buscaminas</h1>

      <div style={styles.status}>
        <div>
          <strong>Jugador:</strong> {playerName}
        </div>
        <div>
          <strong>Minas:</strong> {mineCount - flagCount}
        </div>
        <div>
          <strong>Tiempo:</strong> {elapsedTime}s
        </div>
      </div>

      <div style={styles.controls}>
        <button style={styles.button} onClick={() => setDifficulty("easy")}>
          Fácil
        </button>
        <button style={styles.button} onClick={() => setDifficulty("medium")}>
          Medio
        </button>
        <button style={styles.button} onClick={() => setDifficulty("hard")}>
          Difícil
        </button>
        <button style={styles.button} onClick={initializeBoard}>
          Reiniciar
        </button>
        <button style={styles.flagButton} onClick={toggleFlagMode}>
          Modo Bandera: {flagMode ? "ON" : "OFF"}
        </button>
      </div>

      {gameStatus !== "playing" && (
        <div style={styles.message}>
          <h3>{getMessage()}</h3>
          <p>Presiona "Reiniciar" para jugar de nuevo</p>
        </div>
      )}

      <GameBoard
        board={board}
        boardSize={boardSize}
        handleCellClick={handleCellClick}
      />
    </div>
  );
};

export default Minesweeper;
