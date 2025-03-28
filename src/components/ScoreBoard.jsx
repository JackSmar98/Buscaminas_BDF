import React, { useState, useEffect } from "react";
import { getScores } from "../firebase/scoreService"; // Ruta corregida
import "../styles/ScoreBoard.css";

const ScoreBoard = ({ onClose }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("todos"); // todos, victorias, derrotas

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoreData = await getScores();
        setScores(scoreData);
        setLoading(false);
      } catch (err) {
        setError(
          "Error al cargar las puntuaciones. Inténtalo de nuevo más tarde."
        );
        setLoading(false);
        console.error("Error fetching scores:", err);
      }
    };

    fetchScores();
  }, []);

  const filteredScores = scores.filter((score) => {
    if (filter === "todos") return true;
    if (filter === "victorias") return score.resultado === "victoria";
    if (filter === "derrotas") return score.resultado === "derrota";
    return true;
  });

  // Ordenar por fecha, más recientes primero
  const sortedScores = [...filteredScores].sort((a, b) => b.fecha - a.fecha);

  return (
    <div className="score-board">
      <h2>Tabla de Puntuaciones</h2>

      <div className="score-filters">
        <button
          className={`filter-btn ${filter === "todos" ? "active" : ""}`}
          onClick={() => setFilter("todos")}
        >
          Todos
        </button>
        <button
          className={`filter-btn ${filter === "victorias" ? "active" : ""}`}
          onClick={() => setFilter("victorias")}
        >
          Victorias
        </button>
        <button
          className={`filter-btn ${filter === "derrotas" ? "active" : ""}`}
          onClick={() => setFilter("derrotas")}
        >
          Derrotas
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Cargando puntuaciones...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : sortedScores.length === 0 ? (
        <p className="no-scores-message">No hay puntuaciones disponibles.</p>
      ) : (
        <table className="scores-table">
          <thead>
            <tr>
              <th>Jugador</th>
              <th>Dificultad</th>
              <th>Tiempo</th>
              <th>Minas</th>
              <th>Resultado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {sortedScores.map((score) => (
              <tr
                key={score.id}
                className={
                  score.resultado === "victoria" ? "victory-row" : "defeat-row"
                }
              >
                <td>{score.jugador}</td>
                <td>{score.dificultad}</td>
                <td>{score.tiempo} s</td>
                <td>{score.minas}</td>
                <td>
                  {score.resultado === "victoria" ? "Victoria" : "Derrota"}
                </td>
                <td>{new Date(score.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className="close-btn" onClick={onClose}>
        Volver al juego
      </button>
    </div>
  );
};

export default ScoreBoard;
