import React from "react";
import GameCell from "./GameCell";

const GameBoard = ({ board, boardSize, handleCellClick }) => {
  // Estilo para el tablero
  const boardStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${boardSize}, 30px)`,
    gridTemplateRows: `repeat(${boardSize}, 30px)`,
    gap: "2px",
    margin: "20px auto",
    padding: "5px",
    backgroundColor: "#bbb",
    border: "3px solid #999",
    borderRadius: "4px",
    width: "fit-content",
  };

  // Verificar si el tablero existe y tiene el tamaño correcto
  if (!board || board.length === 0 || board[0].length === 0) {
    return <div>Cargando tablero...</div>;
  }

  return (
    <div style={boardStyle}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GameCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => {
              console.log(`Clic en [${rowIndex}, ${colIndex}]`);
              handleCellClick(rowIndex, colIndex);
            }}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
