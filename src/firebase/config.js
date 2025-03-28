// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
// Estos son valores de ejemplo, debes reemplazarlos con tus propias credenciales
const firebaseConfig = {
  apiKey: "AIzaSyBqV95FxUY82MiN_-bHeqGraxQJnDFfvLY",
  authDomain: "buscaminas-3aba5.firebaseapp.com",
  projectId: "buscaminas-3aba5",
  storageBucket: "buscaminas-3aba5.firebasestorage.app",
  messagingSenderId: "1071482540176",
  appId: "1:1071482540176:web:2ee074b79901d278450815",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

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

export default app;
