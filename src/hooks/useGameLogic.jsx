import { useState, useCallback, useEffect, useRef } from "react";
import { saveScore } from "../firebase/scoreService";

export const useGameLogic = () => {
  // Estados del tablero
  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState(8);
  const [mineCount, setMineCount] = useState(10);

  // Estados del juego
  const [gameStatus, setGameStatus] = useState("playing");
  const [flagMode, setFlagMode] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // Usar useRef para el intervalo del temporizador
  const timerRef = useRef(null);

  // Función para crear un tablero nuevo
  const createBoard = useCallback(() => {
    console.log(
      `Creando tablero de ${boardSize}x${boardSize} con ${mineCount} minas`
    );

    // Crear tablero vacío
    const newBoard = [];
    for (let i = 0; i < boardSize; i++) {
      const row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
      newBoard.push(row);
    }

    // Colocar minas aleatoriamente
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * boardSize);
      const col = Math.floor(Math.random() * boardSize);

      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calcular minas adyacentes
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;

          // Revisar las 8 celdas adyacentes
          for (
            let r = Math.max(0, row - 1);
            r <= Math.min(boardSize - 1, row + 1);
            r++
          ) {
            for (
              let c = Math.max(0, col - 1);
              c <= Math.min(boardSize - 1, col + 1);
              c++
            ) {
              if (newBoard[r][c].isMine) count++;
            }
          }

          newBoard[row][col].adjacentMines = count;
        }
      }
    }

    return newBoard;
  }, [boardSize, mineCount]);

  // Iniciar temporizador de forma segura
  const startTimer = useCallback(() => {
    // Detener temporizador existente si hay uno
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reiniciar tiempo
    setElapsedTime(0);

    // Crear nuevo temporizador
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    console.log("Temporizador iniciado");
  }, []);

  // Detener temporizador de forma segura
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log("Temporizador detenido");
    }
  }, []);

  // Inicializar el tablero
  const initializeBoard = useCallback(() => {
    console.log("Inicializando tablero");

    // Detener temporizador existente
    stopTimer();

    // Crear nuevo tablero
    const newBoard = createBoard();

    // Actualizar estados
    setBoard(newBoard);
    setGameStatus("playing");
    setFlagCount(0);
    setElapsedTime(0);

    // Iniciar nuevo temporizador
    startTimer();
  }, [createBoard, stopTimer, startTimer]);

  // Revelar celdas adyacentes (para celdas con 0 minas adyacentes)
  const revealAdjacentCells = useCallback(
    (boardCopy, row, col) => {
      // Si la celda está fuera de los límites o ya revelada, salir
      if (
        row < 0 ||
        row >= boardSize ||
        col < 0 ||
        col >= boardSize ||
        boardCopy[row][col].isRevealed ||
        boardCopy[row][col].isFlagged
      ) {
        return boardCopy;
      }

      // Revelar la celda actual
      boardCopy[row][col].isRevealed = true;

      // Si no hay minas adyacentes, revelar celdas vecinas
      if (boardCopy[row][col].adjacentMines === 0) {
        // Revisar las 8 celdas adyacentes
        for (
          let r = Math.max(0, row - 1);
          r <= Math.min(boardSize - 1, row + 1);
          r++
        ) {
          for (
            let c = Math.max(0, col - 1);
            c <= Math.min(boardSize - 1, col + 1);
            c++
          ) {
            // Evitar la celda actual
            if (r !== row || c !== col) {
              boardCopy = revealAdjacentCells(boardCopy, r, c);
            }
          }
        }
      }

      return boardCopy;
    },
    [boardSize]
  );

  // Verificar victoria
  const checkVictory = useCallback(
    (currentBoard) => {
      // Verificar si todas las celdas no-minas han sido reveladas
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (
            !currentBoard[row][col].isMine &&
            !currentBoard[row][col].isRevealed
          ) {
            // Todavía hay celdas por revelar
            return false;
          }
        }
      }

      // Si llegamos aquí, todas las celdas no-minas han sido reveladas
      console.log("¡Victoria detectada!");
      setGameStatus("won");

      // Detener temporizador
      stopTimer();

      // Guardar puntuación
      if (playerName) {
        const difficulty =
          boardSize === 8 ? "Fácil" : boardSize === 12 ? "Medio" : "Difícil";
        saveScore(playerName, difficulty, elapsedTime, mineCount, "victoria")
          .then(() => console.log("Puntuación guardada"))
          .catch((error) => console.error("Error al guardar:", error));
      }

      return true;
    },
    [boardSize, stopTimer, playerName, elapsedTime, mineCount]
  );

  // Manejar clic en celda
  const handleCellClick = useCallback(
    (row, col) => {
      console.log(`Clic en celda [${row}, ${col}]`);

      // Si el juego terminó, ignorar
      if (gameStatus !== "playing") {
        console.log("Juego no está en curso. Estado:", gameStatus);
        return;
      }

      // Crear copia del tablero
      const boardCopy = JSON.parse(JSON.stringify(board));

      // Modo bandera
      if (flagMode) {
        console.log("Modo bandera activado");

        // Ignorar celdas ya reveladas
        if (boardCopy[row][col].isRevealed) {
          return;
        }

        // Alternar bandera
        boardCopy[row][col].isFlagged = !boardCopy[row][col].isFlagged;

        // Actualizar contador de banderas
        setFlagCount((prevCount) =>
          boardCopy[row][col].isFlagged ? prevCount + 1 : prevCount - 1
        );

        setBoard(boardCopy);
        return;
      }

      // Ignorar celdas con bandera
      if (boardCopy[row][col].isFlagged) {
        console.log("Celda tiene bandera, ignorando clic");
        return;
      }

      // Si ya está revelada, ignorar
      if (boardCopy[row][col].isRevealed) {
        console.log("Celda ya revelada, ignorando clic");
        return;
      }

      // Si es una mina, fin del juego
      if (boardCopy[row][col].isMine) {
        console.log("¡Es una mina! Juego perdido");

        // Revelar todas las minas
        for (let r = 0; r < boardSize; r++) {
          for (let c = 0; c < boardSize; c++) {
            if (boardCopy[r][c].isMine) {
              boardCopy[r][c].isRevealed = true;
            }
          }
        }

        setBoard(boardCopy);
        setGameStatus("lost");

        // Detener temporizador
        stopTimer();

        // Guardar derrota
        if (playerName) {
          const difficulty =
            boardSize === 8 ? "Fácil" : boardSize === 12 ? "Medio" : "Difícil";
          saveScore(playerName, difficulty, elapsedTime, mineCount, "derrota")
            .then(() => console.log("Derrota registrada"))
            .catch((error) => console.error("Error al registrar:", error));
        }

        return;
      }

      // Revelar la celda y adyacentes si es necesario
      const updatedBoard = revealAdjacentCells(boardCopy, row, col);
      console.log(
        "Tablero actualizado, estado de la celda:",
        updatedBoard[row][col]
      );

      // Actualizar el tablero
      setBoard(updatedBoard);

      // Verificar victoria
      checkVictory(updatedBoard);
    },
    [
      board,
      boardSize,
      flagMode,
      gameStatus,
      revealAdjacentCells,
      checkVictory,
      stopTimer,
      playerName,
      elapsedTime,
      mineCount,
    ]
  );

  // Cambiar dificultad
  const setDifficulty = useCallback((level) => {
    console.log(`Cambiando dificultad a: ${level}`);

    switch (level) {
      case "easy":
        setBoardSize(8);
        setMineCount(10);
        break;
      case "medium":
        setBoardSize(12);
        setMineCount(30);
        break;
      case "hard":
        setBoardSize(16);
        setMineCount(60);
        break;
      default:
        setBoardSize(8);
        setMineCount(10);
    }
  }, []);

  // Alternar modo bandera
  const toggleFlagMode = useCallback(() => {
    setFlagMode((prevMode) => !prevMode);
    console.log("Modo bandera toggled");
  }, []);

  // Registrar jugador
  const registerPlayer = useCallback(
    (name) => {
      console.log(`Jugador registrado: ${name}`);
      setPlayerName(name);
      setGameStarted(true);

      // Inicializar tablero después de registrar jugador
      setTimeout(() => {
        initializeBoard();
      }, 0);
    },
    [initializeBoard]
  );

  // Reinicializar tablero cuando cambia la dificultad
  useEffect(() => {
    if (gameStarted) {
      console.log("Reinicializando tablero por cambio de dificultad");
      initializeBoard();
    }
  }, [boardSize, mineCount, gameStarted, initializeBoard]);

  // Limpiar temporizador al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
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
  };
};
