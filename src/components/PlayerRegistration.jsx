import React, { useState } from "react";
// Eliminamos la importación del CSS o la ajustamos a la ubicación correcta
// Si necesitas un CSS específico, asegúrate de crearlo en la ubicación correcta

const PlayerRegistration = ({ onPlayerRegistered }) => {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      setError("Por favor, ingresa tu nombre");
      return;
    }

    // Pasar el nombre del jugador al componente padre
    onPlayerRegistered(playerName);
  };

  // Estilos en línea para evitar problemas con archivos CSS
  const styles = {
    container: {
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      marginTop: "0",
      marginBottom: "10px",
    },
    subtitle: {
      textAlign: "center",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
    },
    errorMessage: {
      color: "#e74c3c",
      margin: "10px 0",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "#4a6ea9",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bienvenido a Buscaminas</h2>
      <p style={styles.subtitle}>Ingresa tu nombre para comenzar a jugar</p>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="playerName">
            Tu nombre:
          </label>
          <input
            style={styles.input}
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
        </div>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <button style={styles.button} type="submit">
          Comenzar a jugar
        </button>
      </form>
    </div>
  );
};

export default PlayerRegistration;
