import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Autocompletar URL actual de OBS para copiar
document.getElementById('obsUrlInput').value = window.location.href.replace('panel.html', 'index.html');

// Pestañas del Panel
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// Selección de Color de Tema
let selectedColor = "#ec4899";
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedColor = btn.dataset.color;
  });
});

// Botón Guardar y Enviar a Firebase (Impacta en OBS sin recargar)
document.getElementById('btnSaveConfig').addEventListener('click', async () => {
  const configData = {
    themeColor: selectedColor,
    rotationMode: document.querySelector('input[name="rotMode"]:checked').value,
    tickerSpeed: parseFloat(document.getElementById('tickerSpeedRange').value),
    urls: {
      quini: document.getElementById('urlQuini').value,
      brinco: document.getElementById('urlBrinco').value,
      quiniela: document.getElementById('urlQuiniela').value,
      custom: document.getElementById('urlCustom').value
    },
    ads: {
      type: document.getElementById('adType').value,
      mediaUrl: document.getElementById('adMediaUrl').value,
      schedule: document.getElementById('adSchedule').value
    },
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "configuracion", "master"), configData);
    alert("¡Configuración guardada y enviada a OBS con éxito!");
  } catch (e) {
    alert("Error al guardar: " + e.message);
  }
});