import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Completar la URL de la salida OBS
const obsUrl = window.location.href.replace('panel.html', 'index.html');
document.getElementById('obsUrlInput').value = obsUrl;

// Sistema de Pestañas
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// Selección de Colores
let selectedColor = "#ec4899";
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedColor = btn.dataset.color;
  });
});

// Mostrar/Ocultar Editor Manual de Sorteos
document.getElementById('lotteryFetchMode').addEventListener('change', (e) => {
  document.getElementById('manualLotteryEditor').style.display = e.target.value === 'manual' ? 'block' : 'none';
});

// Mostrar/Ocultar Rango Horario de Publicidad
document.getElementById('adScheduleType').addEventListener('change', (e) => {
  document.getElementById('timeRangePicker').style.display = e.target.value === 'custom' ? 'flex' : 'none';
});

// Cargar estado previo de Firebase en el panel
async function loadStoredConfig() {
  try {
    const docSnap = await getDoc(doc(db, "configuracion", "master"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.themeColor) {
        selectedColor = data.themeColor;
        document.querySelectorAll('.color-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.color === selectedColor);
        });
      }
      if (data.templateStyle) document.getElementById('selectTemplateStyle').value = data.templateStyle;
      if (data.tickerSpeed) document.getElementById('tickerSpeedRange').value = data.tickerSpeed;
      if (data.rotationMode) {
        const rad = document.querySelector(`input[name="rotMode"][value="${data.rotationMode}"]`);
        if (rad) rad.checked = true;
      }
      if (data.cardDurationSec) document.getElementById('cardDurationSec').value = data.cardDurationSec;
      
      if (data.lotteryMode) {
        document.getElementById('lotteryFetchMode').value = data.lotteryMode;
        document.getElementById('manualLotteryEditor').style.display = data.lotteryMode === 'manual' ? 'block' : 'none';
      }
      if (data.manualQuiniela) document.getElementById('manualQuinielaHead').value = data.manualQuiniela;
      if (data.manualQuini) document.getElementById('manualQuiniNumbers').value = data.manualQuini;
      if (data.manualBrinco) document.getElementById('manualBrincoNumbers').value = data.manualBrinco;

      if (data.adEnable) document.getElementById('adEnable').value = data.adEnable;
      if (data.adType) document.getElementById('adType').value = data.adType;
      if (data.adMediaUrl) document.getElementById('adMediaUrl').value = data.adMediaUrl;
      if (data.adScheduleType) {
        document.getElementById('adScheduleType').value = data.adScheduleType;
        document.getElementById('timeRangePicker').style.display = data.adScheduleType === 'custom' ? 'flex' : 'none';
      }
      if (data.adTimeStart) document.getElementById('adTimeStart').value = data.adTimeStart;
      if (data.adTimeEnd) document.getElementById('adTimeEnd').value = data.adTimeEnd;
    }
  } catch (e) {
    console.warn("No se pudo cargar la configuración inicial:", e);
  }
}

loadStoredConfig();

// Guardar y Publicar al Aire
document.getElementById('btnSaveConfig').addEventListener('click', async () => {
  const payload = {
    themeColor: selectedColor,
    templateStyle: document.getElementById('selectTemplateStyle').value,
    tickerSpeed: parseFloat(document.getElementById('tickerSpeedRange').value),
    rotationMode: document.querySelector('input[name="rotMode"]:checked').value,
    cardDurationSec: parseInt(document.getElementById('cardDurationSec').value) || 15,
    lotteryMode: document.getElementById('lotteryFetchMode').value,
    manualQuiniela: document.getElementById('manualQuinielaHead').value,
    manualQuini: document.getElementById('manualQuiniNumbers').value,
    manualBrinco: document.getElementById('manualBrincoNumbers').value,
    adEnable: document.getElementById('adEnable').value,
    adType: document.getElementById('adType').value,
    adMediaUrl: document.getElementById('adMediaUrl').value,
    adScheduleType: document.getElementById('adScheduleType').value,
    adTimeStart: document.getElementById('adTimeStart').value,
    adTimeEnd: document.getElementById('adTimeEnd').value,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, "configuracion", "master"), payload);
    
    // Refrescar Previa en el Monitor
    const frame = document.getElementById('previewFrame');
    frame.src = frame.src;

    alert("¡Configuración guardada y transmitida a OBS con éxito!");
  } catch (err) {
    alert("Error al guardar en Firebase: " + err.message);
  }
});
