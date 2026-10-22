import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyARhC07Q4CvEqB1JytYK_AkY2_HQw4ToSY",
  authDomain: "dj-tv-estacion-mix.firebaseapp.com",
  projectId: "dj-tv-estacion-mix",
  storageBucket: "dj-tv-estacion-mix.firebasestorage.app",
  messagingSenderId: "955348774578",
  appId: "1:955348774578:web:221c8f8edac25a53e023ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const upperCard = document.getElementById('upperCard');
const cardDynamicContent = document.getElementById('cardDynamicContent');

let globalConfig = {
  rotationMode: "consecutive", // consecutive | random | fixed
  themeColor: "#ec4899",
  animationSpeed: 1.2
};

// Escucha configuraciones de diseño en tiempo real desde el Panel
onSnapshot(doc(db, "configuracion", "master"), (docSnap) => {
  if (docSnap.exists()) {
    globalConfig = { ...globalConfig, ...docSnap.data() };
    document.documentElement.style.setProperty('--theme-color', globalConfig.themeColor);
  }
});

console.log("DJ TV Engine Master iniciado correctamente.");