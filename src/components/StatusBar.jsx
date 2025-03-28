import React from "react";
// import "../styles/StatusBar.css";

const StatusBar = ({
  mineCount,
  flagCount,
  elapsedTime,
  flagMode,
  toggleFlagMode,
}) => {
  // Estilos en línea
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
      marginBottom: "15px",
    },
    item: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    label: {
      fontWeight: "bold",
    },
    value: {
      fontSize: "18px",
      minWidth: "30px",
      textAlign: "center",
    },
    button: {
      padding: "8px 12px",
      backgroundColor: flagMode ? "#e67e22" : "#4a6ea9",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  // Función para manejar el clic en el botón de modo bandera
  const handleFlagToggle = (e) => {
    e.preventDefault();
    console.log("Cambiando modo bandera");
    toggleFlagMode();
  };

  return (
    <div style={styles.container}>
      <div style={styles.item}>
        <span style={styles.label}>Minas:</span>
        <span style={styles.value}>{mineCount - flagCount}</span>
      </div>

      <div style={styles.item}>
        <span style={styles.label}>Tiempo:</span>
        <span style={styles.value}>{elapsedTime}</span>
      </div>

      <div style={styles.item}>
        <button style={styles.button} onClick={handleFlagToggle}>
          Modo Bandera: {flagMode ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
