import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const ZODIAC_SVGS = {
  aries: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 21V9"/><path d="M12 9a5 5 0 0 0-5-5c-2.8 0-5 2.2-5 5 0 2.5 2 4.5 4.5 4.5"/><path d="M12 9a5 5 0 0 1 5-5c2.8 0 5 2.2 5 5 0 2.5-2 4.5-4.5 4.5"/></svg>`,
  taurus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="14" r="6"/><path d="M6 4a6 6 0 0 0 12 0"/></svg>`,
  gemini: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4a16 16 0 0 0 16 0"/><path d="M4 20a16 16 0 0 1 16 0"/><path d="M8 4v16"/><path d="M16 4v16"/></svg>`,
  cancer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="6" cy="10" r="3"/><circle cx="18" cy="14" r="3"/><path d="M9 10a7 7 0 0 0 11-4"/><path d="M15 14a7 7 0 0 0-11 4"/></svg>`,
  leo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="7" cy="17" r="3"/><path d="M10 17c0-4 3-7 7-7a4 4 0 0 0 0-8c-2.5 0-4.5 2-4.5 4.5 0 3.5 2 5.5 2 8.5 0 2.5-2 4-4.5 4"/></svg>`,
  virgo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4v10a3 3 0 0 0 6 0V4"/><path d="M10 4v10a3 3 0 0 0 6 0V4"/><path d="M16 4v10a3 3 0 0 0 3 3h1"/><path d="M18 13a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>`,
  libra: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 20h16"/><path d="M4 16h16"/><path d="M8 16a4 4 0 0 1 8 0"/><path d="M12 5v7"/><path d="M9 8h6"/></svg>`,
  scorpio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4v10a3 3 0 0 0 6 0V4"/><path d="M10 4v10a3 3 0 0 0 6 0V4"/><path d="M16 4v11a2 2 0 0 0 2 2h3"/><path d="m19 15 3 2-3 2"/></svg>`,
  sagittarius: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 5 5 19"/><path d="M14 5h5v5"/><path d="M9 9 5 5"/><path d="M19 19l-4-4"/></svg>`,
  capricorn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4l5 13a2 2 0 0 0 4 0l3-8"/><circle cx="18" cy="15" r="3"/><path d="M18 18c0 2-1.5 3.5-3.5 3.5S11 20 11 18"/></svg>`,
  aquarius: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m3 8 3-3 4 4 4-4 4 4 3-3"/><path d="m3 16 3-3 4 4 4-4 4 4 3-3"/></svg>`,
  pisces: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12h16"/><path d="M6 4a16 16 0 0 1 0 16"/><path d="M18 4a16 16 0 0 0 0 16"/></svg>`
};

const ZODIAC_CONFIG = [
  { key: 'aries', name: 'Aries', dates: '21 MAR - 19 ABR', defaultText: 'Momentos de gran energía creativa y proyectos que comienzan a dar sus frutos.' },
  { key: 'taurus', name: 'Tauro', dates: '20 ABR - 20 MAY', defaultText: 'Estabilidad y buenas oportunidades financieras. Tiempo ideal para afianzar proyectos.' },
  { key: 'gemini', name: 'Géminis', dates: '21 MAY - 20 JUN', defaultText: 'La comunicación y las relaciones sociales están a tu favor hoy.' },
  { key: 'cancer', name: 'Cáncer', dates: '21 JUN - 22 JUL', defaultText: 'Escuchá tu intuición para tomar decisiones importantes en lo personal.' },
  { key: 'leo', name: 'Leo', dates: '23 JUL - 22 AGO', defaultText: 'Tu liderazgo natural destaca hoy con fuerza. Momento de brillar.' },
  { key: 'virgo', name: 'Virgo', dates: '23 AGO - 22 SEP', defaultText: 'Organización y disciplina clave para resolver temas pendientes.' },
  { key: 'libra', name: 'Libra', dates: '23 SEP - 22 OCT', defaultText: 'Búsqueda de equilibrio e inspiración. La música renovará tus energías.' },
  { key: 'scorpio', name: 'Escorpio', dates: '23 OCT - 21 NOV', defaultText: 'Determinación y pasión en todo lo que emprendas. Cambios positivos.' },
  { key: 'sagittarius', name: 'Sagitario', dates: '22 NOV - 21 DIC', defaultText: 'Aventuras y nuevas experiencias en el horizonte.' },
  { key: 'capricorn', name: 'Capricornio', dates: '22 DIC - 19 ENE', defaultText: 'Perseverancia y enfoque profesional garantizados.' },
  { key: 'aquarius', name: 'Acuario', dates: '20 ENE - 18 FEB', defaultText: 'Ideas innovadoras y originales que marcan la diferencia.' },
  { key: 'pisces', name: 'Piscis', dates: '19 FEB - 20 MAR', defaultText: 'Sensibilidad y empatía conectando positivamente con quienes te rodean.' }
];

let chatMessages = [];
let lotteryList = [];
let horoscopeList = ZODIAC_CONFIG;

let chatIdx = 0;
let lotteryIdx = 0;
let horoIdx = 0;

let isLoopActive = false;
let masterConfig = {
  themeColor: "#ec4899",
  rotationMode: "consecutive",
  cardDurationSec: 15,
  lotteryMode: "auto",
  manualQuiniela: "2994",
  manualQuini: "04,05,32,39,40,44",
  manualBrinco: "07,22,26,33,34,39",
  adEnable: "no",
  adType: "image",
  adMediaUrl: "",
  adScheduleType: "247"
};

// Cargar Sorteos Automáticos o Manuales
async function fetchLotteryData() {
  if (masterConfig.lotteryMode === "manual") {
    const parseNum = (str) => str ? str.split(',').map(s => s.trim()) : ["--","--","--","--","--","--"];
    lotteryList = [
      { game: "QUINI 6", name: "Tradicional Primer Sorteo", numbers: parseNum(masterConfig.manualQuini), info: "SORTEO EN VIVO" },
      { game: "BRINCO", name: "Extracciones", numbers: parseNum(masterConfig.manualBrinco), info: "SORTEO EN VIVO" },
      { game: "QUINIELA MISIONERA", name: "Cabeza", head: masterConfig.manualQuiniela || "----", isQuiniela: true }
    ];
    return;
  }

  try {
    const cb = `?_t=${Date.now()}`;
    const [resQ, resB, resM] = await Promise.all([
      fetch(`https://quini-6.fachacarlos1.workers.dev/${cb}`, { cache: "no-store" }).then(r => r.json()).catch(() => ({})),
      fetch(`https://brinco.fachacarlos1.workers.dev/${cb}`, { cache: "no-store" }).then(r => r.json()).catch(() => ({})),
      fetch(`https://quinielamisionera.fachacarlos1.workers.dev/${cb}`, { cache: "no-store" }).then(r => r.json()).catch(() => ({}))
    ]);

    lotteryList = [
      { game: "QUINI 6", name: "Tradicional", numbers: resQ.tradicionalPrimerSorteo || ["04","05","32","39","40","44"], info: `SORTEO N° ${resQ.sorteoNumero || '----'}` },
      { game: "BRINCO", name: "Extracciones", numbers: resB.extracciones || ["07","22","26","33","34","39"], info: `SORTEO N° ${resB.sorteoNumero || '----'}` },
      { game: "QUINIELA MISIONERA", name: "Matutina Plus", head: (resM.cabezas && resM.cabezas.matPlus) || "2994", isQuiniela: true }
    ];
  } catch (e) {}
}

// Conexión Firebase para Chat
const qChat = query(collection(db, "mensajes"), where("estado", "==", "aprobado"), orderBy("timestamp", "desc"));
onSnapshot(qChat, (snap) => {
  const list = [];
  snap.forEach(d => list.push(d.data()));
  chatMessages = list;
  if (!isLoopActive) startMasterLoop();
});

// Conexión Firebase para Configuración en Vivo
onSnapshot(doc(db, "configuracion", "master"), (snap) => {
  if (snap.exists()) {
    masterConfig = { ...masterConfig, ...snap.data() };
    document.documentElement.style.setProperty('--theme-color', masterConfig.themeColor);
    fetchLotteryData();
  }
});

// Bucle Broadcast Principal
async function startMasterLoop() {
  isLoopActive = true;
  await fetchLotteryData();

  const durationMs = (masterConfig.cardDurationSec || 15) * 1000;

  // Lógica de Rotación
  let modeType = "chat";
  if (masterConfig.rotationMode === "random") {
    const modes = ["chat", "lottery", "horoscope"];
    if (masterConfig.adEnable === "yes" && isAdInSchedule()) modes.push("ad");
    modeType = modes[Math.floor(Math.random() * modes.length)];
  } else {
    // Consecutivo
    window.masterStep = (window.masterStep || 0) % 4;
    const seq = ["chat", "lottery", "horoscope", "ad"];
    modeType = seq[window.masterStep];
    window.masterStep++;
  }

  // Renderizar según el tipo
  if (modeType === "chat" && chatMessages.length > 0) {
    renderChat();
  } else if (modeType === "lottery" && lotteryList.length > 0) {
    renderLottery();
  } else if (modeType === "horoscope") {
    renderHoroscope();
  } else if (modeType === "ad" && masterConfig.adEnable === "yes" && masterConfig.adMediaUrl) {
    renderAd();
  } else {
    renderHoroscope(); // Fallback
  }

  setTimeout(() => {
    upperCard.classList.add('hidden-card');
    setTimeout(startMasterLoop, 1200);
  }, durationMs);
}

function isAdInSchedule() {
  if (masterConfig.adScheduleType === "247") return true;
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = (masterConfig.adTimeStart || "00:00").split(':').map(Number);
  const [eh, em] = (masterConfig.adTimeEnd || "23:59").split(':').map(Number);
  return currentMin >= (sh * 60 + sm) && currentMin <= (eh * 60 + em);
}

function renderChat() {
  if (chatIdx >= chatMessages.length) chatIdx = 0;
  const msg = chatMessages[chatIdx++];
  upperCard.className = 'upper-card chat-mode';
  cardDynamicContent.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
      <span style="background:var(--theme-color); color:#fff; padding:4px 12px; font-weight:900; border-radius:4px; font-family:'Orbitron'; font-size:18px;">OYENTE AL AIRE</span>
      <span style="color:#f472b6; font-weight:900; font-size:22px; text-transform:uppercase;">${msg.nombre || 'ANÓNIMO'}</span>
      ${msg.lugar ? `<span style="color:#00f2fe; font-size:20px; font-weight:700;">📍 ${msg.lugar}</span>` : ''}
    </div>
    <div style="color:#ffffff; font-size:32px; font-weight:900; font-style:italic;">"${msg.msj || ''}"</div>
  `;
  upperCard.classList.remove('hidden-card');
}

function renderLottery() {
  if (lotteryIdx >= lotteryList.length) lotteryIdx = 0;
  const lot = lotteryList[lotteryIdx++];
  upperCard.className = 'upper-card lottery-mode';

  if (lot.isQuiniela) {
    cardDynamicContent.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <div>
          <div style="font-family:'Orbitron'; font-size:24px; font-weight:900; color:#10b981;">${lot.game}</div>
          <div style="font-size:18px; font-weight:800; color:#fff;">• TURNO ${lot.name}</div>
        </div>
        <div style="display:flex; align-items:center; background:rgba(16,185,129,0.2); border:2px solid #10b981; padding:8px 24px; border-radius:10px; gap:16px;">
          <div style="font-family:'Orbitron'; font-size:18px; color:#a7f3d0; font-weight:900;">1° A LA CABEZA</div>
          <div style="font-family:'Orbitron'; font-size:46px; color:#fff; background:#047857; padding:2px 20px; border-radius:8px; font-weight:900;">${lot.head}</div>
        </div>
      </div>
    `;
  } else {
    let balls = lot.numbers.map(n => `<div style="width:64px; height:64px; background:radial-gradient(circle at 30% 30%, #fff, #cbd5e1); color:#0f172a; font-weight:900; font-size:24px; display:flex; align-items:center; justify-content:center; border-radius:50%; box-shadow:0 4px 12px rgba(0,0,0,0.5);">${n}</div>`).join('');
    cardDynamicContent.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <div>
          <div style="font-family:'Orbitron'; font-size:24px; font-weight:900; color:#f97316;">${lot.game}</div>
          <div style="font-size:18px; font-weight:800; color:#fff;">• ${lot.info}</div>
        </div>
        <div style="font-size:30px; font-weight:900; color:#38bdf8; background:rgba(255,255,255,0.05); padding:6px 20px; border-radius:8px;">${lot.name}</div>
        <div style="display:flex; gap:10px;">${balls}</div>
      </div>
    `;
  }
  upperCard.classList.remove('hidden-card');
}

function renderHoroscope() {
  if (horoIdx >= horoscopeList.length) horoIdx = 0;
  const h = horoscopeList[horoIdx++];
  upperCard.className = 'upper-card horoscope-mode';
  cardDynamicContent.innerHTML = `
    <div style="display:flex; align-items:center; gap:25px; width:100%;">
      <div style="display:flex; align-items:center; gap:15px; background:#1e293b; padding:8px 18px; border-radius:8px; border:2px solid #f59e0b; min-width:360px;">
        <div style="width:50px; height:50px; color:#f59e0b;">${ZODIAC_SVGS[h.key] || ''}</div>
        <div>
          <div style="font-family:'Oswald'; font-size:36px; font-weight:800; color:#fff;">${h.name}</div>
          <div style="font-size:13px; font-weight:800; color:#f59e0b;">${h.dates}</div>
        </div>
      </div>
      <div style="font-size:30px; font-weight:800; color:#fff; flex:1;">${h.defaultText}</div>
    </div>
  `;
  upperCard.classList.remove('hidden-card');
}

function renderAd() {
  upperCard.className = 'upper-card ad-mode';
  if (masterConfig.adType === "video") {
    cardDynamicContent.innerHTML = `<video src="${masterConfig.adMediaUrl}" autoplay loop muted style="width:100%; height:120px; object-fit:contain; border-radius:8px;"></video>`;
  } else {
    cardDynamicContent.innerHTML = `<img src="${masterConfig.adMediaUrl}" style="width:100%; height:120px; object-fit:contain; border-radius:8px;">`;
  }
  upperCard.classList.remove('hidden-card');
}

// Ticker Inferior
async function fetchTickerNews() {
  const container = document.getElementById('tickerText');
  if (!container) return;
  container.innerHTML = `<div style="font-size:22px; font-weight:700; color:#fff; padding-right:40px;"><span style="background:rgba(255,255,255,0.1); color:#38bdf8; font-weight:900; font-size:14px; padding:3px 8px; border-radius:4px; margin-right:12px;">DJ TV</span> Transmitiendo en vivo 24/7 en HD • Canal Oficial Radio Estación Mix • Posadas, Misiones</div>`;
  
  let posX = 0;
  function step() {
    posX -= (masterConfig.tickerSpeed || 1.2);
    const w = container.scrollWidth / 2;
    if (w > 0 && Math.abs(posX) >= w) posX = 0;
    container.style.transform = `translateX(${posX}px)`;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

fetchTickerNews();
