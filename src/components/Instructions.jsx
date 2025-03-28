import React, { useState } from "react";
import "../styles/Instructions.css";

const Instructions = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="instructions-container">
      <button className="instructions-toggle" onClick={toggleInstructions}>
        {showInstructions ? "Ocultar instrucciones" : "Mostrar instrucciones"}
      </button>

      {showInstructions && (
        <div className="instructions-content">
          <h3>Cómo jugar al Buscaminas</h3>
          <ul>
            <li>El objetivo es descubrir todas las casillas sin minas.</li>
            <li>Haz clic en una casilla para revelarla.</li>
            <li>
              Los números indican cuántas minas hay en las casillas adyacentes.
            </li>
            <li>
              Activa el "Modo Bandera" para marcar casillas que crees que
              contienen minas.
            </li>
            <li>Si revelas una mina, pierdes el juego.</li>
            <li>Si revelas todas las casillas sin minas, ¡ganas el juego!</li>
          </ul>
          <h3>Niveles de dificultad</h3>
          <ul>
            <li>
              <strong>Fácil:</strong> 8x8 tablero con 10 minas
            </li>
            <li>
              <strong>Medio:</strong> 12x12 tablero con 30 minas
            </li>
            <li>
              <strong>Difícil:</strong> 16x16 tablero con 60 minas
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Instructions;
