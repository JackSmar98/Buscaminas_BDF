import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

// Guarda una puntuación en Firestore
export const saveScore = async (
  playerName,
  difficulty,
  time,
  mines,
  result
) => {
  try {
    const scoreData = {
      jugador: playerName,
      dificultad: difficulty,
      tiempo: time,
      minas: mines,
      resultado: result,
      fecha: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "puntuaciones"), scoreData);
    console.log("Puntuación guardada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar puntuación:", error);
    throw error;
  }
};

// Obtiene todas las puntuaciones de Firestore
export const getScores = async () => {
  try {
    const q = query(collection(db, "puntuaciones"), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);

    const scores = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convertir el timestamp de Firestore a milisegundos de JavaScript
      const fecha = data.fecha ? data.fecha.toMillis() : Date.now();

      scores.push({
        id: doc.id,
        ...data,
        fecha, // Asegurar que la fecha es un número
      });
    });

    return scores;
  } catch (error) {
    console.error("Error al obtener puntuaciones:", error);
    throw error;
  }
};
