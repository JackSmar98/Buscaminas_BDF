import React from "react";

const GameCell = ({ cell, onClick }) => {
  const { isMine, isRevealed, isFlagged, adjacentMines } = cell;

  // Estilo básico para todas las celdas
  const cellStyle = {
    width: "30px",
    height: "30px",
    border: "1px solid #999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: isRevealed
      ? isMine
        ? "#ff6666"
        : "#eee"
      : isFlagged
      ? "#ffffaa"
      : "#ccc",
  };

  // Determinar el contenido a mostrar
  let cellContent = "";
  if (isRevealed) {
    if (isMine) {
      cellContent = "💣";
    } else if (adjacentMines > 0) {
      cellContent = adjacentMines;
    }
  } else if (isFlagged) {
    cellContent = "🚩";
  }

  // Colores para números
  let textColor = "black";
  if (isRevealed && !isMine && adjacentMines > 0) {
    const colors = [
      "blue",
      "green",
      "red",
      "darkblue",
      "darkred",
      "teal",
      "black",
      "gray",
    ];
    textColor = colors[adjacentMines - 1] || "black";
  }

  return (
    <div style={{ ...cellStyle, color: textColor }} onClick={onClick}>
      {cellContent}
    </div>
  );
};

export default GameCell;
