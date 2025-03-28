import React, { useState } from "react";
import { saveScore } from "../firebase/scoreService";
import "../styles/SaveScoreForm.css";

const SaveScoreForm = ({ time, boardSize, mineCount, onScoreSaved }) => {
  const [playerName, setPlayerName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError("Por favor, ingresa tu nombre");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await saveScore(playerName, boardSize, time, mineCount);
      setSaved(true);
      if (onScoreSaved) {
        onScoreSaved();
      }
    } catch (error) {
      console.error("Error al guardar puntuación:", error);
      setError(
        "Ocurrió un error al guardar tu puntuación. Inténtalo de nuevo."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="save-score-form saved">
        <h3>¡Puntuación guardada con éxito!</h3>
        <p>Tu tiempo de {time} segundos ha sido registrado.</p>
      </div>
    );
  }

  return (
    <div className="save-score-form">
      <h3>¡Felicidades! Has ganado en {time} segundos</h3>
      <p>Guarda tu puntuación en el ranking:</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerName">Tu nombre:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            disabled={isSaving}
            placeholder="Ingresa tu nombre"
            maxLength={20}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="save-button" disabled={isSaving}>
          {isSaving ? "Guardando..." : "Guardar Puntuación"}
        </button>
      </form>
    </div>
  );
};

export default SaveScoreForm;
