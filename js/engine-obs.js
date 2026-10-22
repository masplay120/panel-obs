import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
  aries: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="M12 9a5 5 0 0 0-5-5c-2.8 0-5 2.2-5 5 0 2.5 2 4.5 4.5 4.5"/><path d="M12 9a5 5 0 0 1 5-5c2.8 0 5 2.2 5 5 0 2.5-2 4.5-4.5 4.5"/></svg>`,
  taurus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M6 4a6 6 0 0 0 12 0"/></svg>`,
  gemini: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4a16 16 0 0 0 16 0"/><path d="M4 20a16 16 0 0 1 16 0"/><path d="M8 4v16"/><path d="M16 4v16"/></svg>`,
  cancer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="10" r="3"/><circle cx="18" cy="14" r="3"/><path d="M9 10a7 7 0 0 0 11-4"/><path d="M15 14a7 7 0 0 0-11 4"/></svg>`,
  leo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17" r="3"/><path d="M10 17c0-4 3-7 7-7a4 4 0 0 0 0-8c-2.5 0-4.5 2-4.5 4.5 0 3.5 2 5.5 2 8.5 0 2.5-2 4-4.5 4"/></svg>`,
  virgo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v10a3 3 0 0 0 6 0V4"/><path d="M10 4v10a3 3 0 0 0 6 0V4"/><path d="M16 4v10a3 3 0 0 0 3 3h1"/><path d="M18 13a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>`,
  libra: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"/><path d="M4 16h16"/><path d="M8 16a4 4 0 0 1 8 0"/><path d="M12 5v7"/><path d="M9 8h6"/></svg>`,
  scorpio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v10a3 3 0 0 0 6 0V4"/><path d="M10 4v10a3 3 0 0 0 6 0V4"/><path d="M16 4v11a2 2 0 0 0 2 2h3"/><path d="m19 15 3 2-3 2"/></svg>`,
  sagittarius: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5 5 19"/><path d="M14 5h5v5"/><path d="M9 9 5 5"/><path d="M19 19l-4-4"/></svg>`,
  capricorn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l5 13a2 2 0 0 0 4 0l3-8"/><circle cx="18" cy="15" r="3"/><path d="M18 18c0 2-1.5 3.5-3.5 3.5S11 20 11 18"/></svg>`,
  aquarius: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8 3-3 4 4 4-4 4 4 3-3"/><path d="m3 16 3-3 4 4 4-4 4 4 3-3"/></svg>`,
  pisces: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M6 4a16 16 0 0 1 0 16"/><path d="M18 4a16 16 0 0 0 0 16"/></svg>`
};

const ZODIAC_CONFIG = [
  { key: 'aries', apiKey: 'aries', name: 'Aries', dates: '21 MAR - 19 ABR', defaultText: 'Momentos de gran energía creativa y proyectos que comienzan a dar sus frutos. Mantené el enfoque.' },
  { key: 'taurus', apiKey: 'Taurus', name: 'Tauro', dates: '20 ABR - 20 MAY', defaultText: 'Estabilidad y buenas oportunidades financieras. Tiempo ideal para afianzar proyectos personales.' },
  { key: 'gemini', apiKey: 'Gemini', name: 'Géminis', dates: '21 MAY - 20 JUN', defaultText: 'La comunicación y las relaciones sociales están a tu favor. Buena jornada para entablar nuevos contactos.' },
  { key: 'cancer', apiKey: 'Cancer', name: 'Cáncer', dates: '21 JUN - 22 JUL', defaultText: 'Escuchá tu intuición para tomar decisiones importantes en lo personal. Gran armonía familiar.' },
  { key: 'leo', apiKey: 'leo', name: 'Leo', dates: '23 JUL - 22 AGO', defaultText: 'Tu liderazgo natural destaca hoy con fuerza. Momento de brillar y cosechar éxitos en el trabajo.' },
  { key: 'virgo', apiKey: 'Virgo', name: 'Virgo', dates: '23 AGO - 22 SEP', defaultText: 'Organización y disciplina clave para resolver temas pendientes. La constancia dará excelentes resultados.' },
  { key: 'libra', apiKey: 'Libra', name: 'Libra', dates: '23 SEP - 22 OCT', defaultText: 'Búsqueda de equilibrio e inspiración. La música y el arte renovarán tus energías plenamente.' },
  { key: 'scorpio', apiKey: 'Scorpio', name: 'Escorpio', dates: '23 OCT - 21 NOV', defaultText: 'Determinación y pasión en todo lo que emprendas. Grandes cambios positivos en camino.' },
  { key: 'sagittarius', apiKey: 'Sagittarius', name: 'Sagitario', dates: '22 NOV - 21 DIC', defaultText: 'Aventuras y nuevas experiencias en el horizonte. Mantené la mente abierta a nuevos conocimientos.' },
  { key: 'capricorn', apiKey: 'Capricorn', name: 'Capricornio', dates: '22 DIC - 19 ENE', defaultText: 'Perseverancia y enfoque profesional garantizados. Paso a paso avanzás seguro hacia tus metas.' },
  { key: 'aquarius', apiKey: 'Aquarius', name: 'Acuario', dates: '20 ENE - 18 FEB', defaultText: 'Ideas innovadoras y originales que marcan la diferencia. Confía en tu talento sin dudar.' },
  { key: 'pisces', apiKey: 'Pisces', name: 'Piscis', dates: '19 FEB - 20 MAR', defaultText: 'Sensibilidad y empatía conectando positivamente con quienes te rodean. Etapa de renovación espiritual.' }
];

let chatMessages = [];
let quiniList = [];
let brincoList = [];
let quinielaList = [];
let horoscopeList = [];

let chatIndex = 0;
let quiniIndex = 0;
let brincoIndex = 0;
let quinielaIndex = 0;
let horoscopeIndex = 0;

let masterSection = 0;
let isMasterLoopRunning = false;
let activeMarqueeFrame = null;

// URLs por defecto (se actualizarán si cambian en el panel)
let workerUrls = {
  quini: "https://quini-6.fachacarlos1.workers.dev/",
  brinco: "https://brinco.fachacarlos1.workers.dev/",
  quiniela: "https://quinielamisionera.fachacarlos1.workers.dev/"
};

// Cargar configuración inicial y escuchar cambios desde el Panel
async function initMasterConfig() {
  try {
    const docSnap = await getDoc(doc(db, "configuracion", "master"));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.themeColor) document.documentElement.style.setProperty('--theme-color', data.themeColor);
      if (data.urls) workerUrls = { ...workerUrls, ...data.urls };
    }
  } catch (e) {}

  onSnapshot(doc(db, "configuracion", "master"), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.themeColor) document.documentElement.style.setProperty('--theme-color', data.themeColor);
      if (data.urls) {
        workerUrls = { ...workerUrls, ...data.urls };
        loadLotteryData(); // Recarga si cambian las URLs en el panel
      }
    }
  });
}

// Cargar Sorteos desde los Workers configurados
async function loadLotteryData() {
  try {
    const cacheBuster = `?_t=${Date.now()}`;
    const [resQuini, resBrinco, resQuiniela] = await Promise.all([
      fetch(workerUrls.quini + cacheBuster, { cache: "no-store" }).then(r => r.json()).catch(() => ({})),
      fetch(workerUrls.brinco + cacheBuster, { cache: "no-store" }).then(r => r.json()).catch(() => ({})),
      fetch(workerUrls.quiniela + cacheBuster, { cache: "no-store" }).then(r => r.json()).catch(() => ({}))
    ]);

    quiniList = [
      { game: "QUINI 6", name: "Tradicional Primer Sorteo", numbers: resQuini.tradicionalPrimerSorteo || ["04","05","32","38","40","44"], info: `SORTEO N° ${resQuini.sorteoNumero || '3419'}`, fecha: resQuini.fecha || "" },
      { game: "QUINI 6", name: "La Segunda del Quini", numbers: resQuini.laSegunda || ["04","10","16","21","27","38"], info: `SORTEO N° ${resQuini.sorteoNumero || '3419'}`, fecha: resQuini.fecha || "" },
      { game: "QUINI 6", name: "Revancha", numbers: resQuini.revancha || ["01","05","26","40","41","43"], info: `SORTEO N° ${resQuini.sorteoNumero || '3419'}`, fecha: resQuini.fecha || "" },
      { game: "QUINI 6", name: "Siempre Sale", numbers: resQuini.siempreSale || ["01","10","19","25","37","44"], info: `SORTEO N° ${resQuini.sorteoNumero || '3419'}`, fecha: resQuini.fecha || "" }
    ];

    brincoList = [
      { game: "BRINCO", name: "Extracciones", numbers: resBrinco.extracciones || ["07","22","26","33","34","39"], info: `SORTEO N° ${resBrinco.sorteoNumero || '1376'}`, fecha: resBrinco.fecha || "" },
      { game: "BRINCO", name: "Brinco Junior", numbers: resBrinco.brincoJunior || ["05","12","20","23","30","38"], info: `SORTEO N° ${resBrinco.sorteoNumero || '1376'}`, fecha: resBrinco.fecha || "" }
    ];

    const c = resQuiniela.cabezas || {};
    quinielaList = [
      { game: "QUINIELA MISIONERA", name: "Previa", head: c.previa || "3261", fecha: resQuiniela.fecha || "" },
      { game: "QUINIELA MISIONERA", name: "Primera", head: c.primera || "4266", fecha: resQuiniela.fecha || "" },
      { game: "QUINIELA MISIONERA", name: "Matutina", head: c.matutina || "3586", fecha: resQuiniela.fecha || "" },
      { game: "QUINIELA MISIONERA", name: "Matutina Plus", head: c.matPlus || "2994", fecha: resQuiniela.fecha || "" },
      { game: "QUINIELA MISIONERA", name: "Vespertina", head: c.vespertina || "0812", fecha: resQuiniela.fecha || "" },
      { game: "QUINIELA MISIONERA", name: "Nocturna", head: c.nocturna || "7419", fecha: resQuiniela.fecha || "" },
      { game: "QUINIELA MISIONERA", name: "Nocturna Plus", head: c.noctPlus || "9537", fecha: resQuiniela.fecha || "" }
    ];
  } catch (e) {}
}

// Cargar Horóscopo Jotform
async function loadHoroscopeAPIs() {
  const fetched = [];
  const cacheBuster = `&_t=${Date.now()}`;
  for (const sign of ZODIAC_CONFIG) {
    let textLoaded = null;
    try {
      const url = `https://api.jotform.com/website-widgets/templates/019f365ed74870008e184f2271ab1b90f656/execute-action?action=getHoroscopeData&period=daily&sign=${sign.apiKey}&language=es&widgetID=01a120be41b070008003137f1833c7dc8d78${cacheBuster}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json && json.content && json.content.horoscope) {
          textLoaded = json.content.horoscope.trim();
        }
      }
    } catch (e) {}
    fetched.push({ ...sign, text: textLoaded || sign.defaultText });
  }
  horoscopeList = fetched;
  if (!isMasterLoopRunning) startMasterBroadcastLoop();
}

// Escuchar Chat Firebase
const q = query(collection(db, "mensajes"), where("estado", "==", "aprobado"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  const rawList = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    data.id = doc.id;
    rawList.push(data);
  });
  chatMessages = rawList.filter(msg => {
    if (!msg.timestamp) return true;
    const msgTime = msg.timestamp.toDate ? msg.timestamp.toDate().getTime() : Date.now();
    return (Date.now() - msgTime) <= 24 * 60 * 60 * 1000;
  });
  if (!isMasterLoopRunning) startMasterBroadcastLoop();
});

// Bucle Maestro de Reproducción
function startMasterBroadcastLoop() {
  if (activeMarqueeFrame) cancelAnimationFrame(activeMarqueeFrame);
  isMasterLoopRunning = true;

  if (masterSection === 0) {
    if (chatMessages.length > 0) renderChatCard();
    else { masterSection = 1; startMasterBroadcastLoop(); }
  } else if (masterSection === 1) {
    if (quiniList.length > 0) renderQuiniCard();
    else { masterSection = 2; startMasterBroadcastLoop(); }
  } else if (masterSection === 2) {
    if (brincoList.length > 0) renderBrincoCard();
    else { masterSection = 3; startMasterBroadcastLoop(); }
  } else if (masterSection === 3) {
    if (quinielaList.length > 0) renderQuinielaCard();
    else { masterSection = 4; startMasterBroadcastLoop(); }
  } else if (masterSection === 4) {
    if (horoscopeList.length > 0) renderHoroscopeCard();
    else { masterSection = 0; startMasterBroadcastLoop(); }
  }
}

function renderChatCard() {
  if (chatIndex >= chatMessages.length) chatIndex = 0;
  const msg = chatMessages[chatIndex];
  upperCard.className = 'upper-card chat-mode';
  const lugarHtml = (msg.lugar && msg.lugar.trim() !== '') ? `<span style="color:#00f2fe; margin-left:10px;">📍 ${msg.lugar.trim()}</span>` : '';

  cardDynamicContent.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
      <span style="background:#ec4899; color:#fff; padding:4px 12px; font-weight:900; border-radius:4px; font-family:'Orbitron'; font-size:18px;">OYENTE AL AIRE</span>
      <span style="color:#f472b6; font-weight:900; font-size:22px; text-transform:uppercase;">${msg.nombre || 'ANÓNIMO'}</span>
      ${lugarHtml}
    </div>
    <div style="color:#ffffff; font-size:32px; font-weight:900; font-style:italic;">"${msg.msj || ''}"</div>
  `;

  setTimeout(() => upperCard.classList.remove('hidden-card'), 100);
  setTimeout(() => {
    upperCard.classList.add('hidden-card');
    setTimeout(() => {
      chatIndex++;
      if (chatIndex >= chatMessages.length) { chatIndex = 0; masterSection = 1; }
      setTimeout(startMasterBroadcastLoop, 1000);
    }, 400);
  }, 18000);
}

function renderQuiniCard() {
  if (quiniIndex >= quiniList.length) quiniIndex = 0;
  const lot = quiniList[quiniIndex];
  upperCard.className = 'upper-card lottery-mode';
  let ballsHtml = '';
  lot.numbers.forEach(num => { ballsHtml += `<div class="lottery-ball">${num}</div>`; });

  cardDynamicContent.innerHTML = `
    <div class="lottery-layout">
      <div class="lottery-info-box">
        <div class="lottery-badge">${lot.game} • ${lot.info}</div>
        <div class="lottery-date">${lot.fecha}</div>
      </div>
      <div class="lottery-mod-center"><div class="lottery-mod-name">${lot.name}</div></div>
      <div class="lottery-right-group"><div class="lottery-balls-wrapper">${ballsHtml}</div></div>
    </div>
  `;

  setTimeout(() => upperCard.classList.remove('hidden-card'), 100);
  setTimeout(() => {
    upperCard.classList.add('hidden-card');
    setTimeout(() => {
      quiniIndex++;
      if (quiniIndex >= quiniList.length) { quiniIndex = 0; masterSection = 2; }
      setTimeout(startMasterBroadcastLoop, 1000);
    }, 400);
  }, 15000);
}

function renderBrincoCard() {
  if (brincoIndex >= brincoList.length) brincoIndex = 0;
  const lot = brincoList[brincoIndex];
  upperCard.className = 'upper-card lottery-mode';
  let ballsHtml = '';
  lot.numbers.forEach(num => { ballsHtml += `<div class="lottery-ball">${num}</div>`; });

  cardDynamicContent.innerHTML = `
    <div class="lottery-layout">
      <div class="lottery-info-box">
        <div class="lottery-badge">${lot.game} • ${lot.info}</div>
        <div class="lottery-date">${lot.fecha}</div>
      </div>
      <div class="lottery-mod-center"><div class="lottery-mod-name">${lot.name}</div></div>
      <div class="lottery-right-group"><div class="lottery-balls-wrapper">${ballsHtml}</div></div>
    </div>
  `;

  setTimeout(() => upperCard.classList.remove('hidden-card'), 100);
  setTimeout(() => {
    upperCard.classList.add('hidden-card');
    setTimeout(() => {
      brincoIndex++;
      if (brincoIndex >= brincoList.length) { brincoIndex = 0; masterSection = 3; }
      setTimeout(startMasterBroadcastLoop, 1000);
    }, 400);
  }, 15000);
}

function renderQuinielaCard() {
  if (quinielaIndex >= quinielaList.length) quinielaIndex = 0;
  const qm = quinielaList[quinielaIndex];
  upperCard.className = 'upper-card quiniela-mode';

  cardDynamicContent.innerHTML = `
    <div class="lottery-layout">
      <div class="lottery-info-box">
        <div class="lottery-badge" style="color:#10b981;">${qm.game}</div>
        <div class="lottery-date">${qm.fecha}</div>
      </div>
      <div class="lottery-mod-center"><div class="lottery-mod-name" style="color:#10b981;">TURNO ${qm.name}</div></div>
      <div class="lottery-right-group" style="display:flex; align-items:center; background:rgba(16,185,129,0.2); border:2px solid #10b981; padding:8px 20px; border-radius:10px; gap:15px;">
        <div style="font-family:'Orbitron'; font-size:18px; color:#a7f3d0; text-align:right; font-weight:900;">1° A LA<br>CABEZA</div>
        <div style="font-family:'Orbitron'; font-size:42px; color:#fff; background:#047857; padding:2px 18px; border-radius:6px; font-weight:900;">${qm.head}</div>
      </div>
    </div>
  `;

  setTimeout(() => upperCard.classList.remove('hidden-card'), 100);
  setTimeout(() => {
    upperCard.classList.add('hidden-card');
    setTimeout(() => {
      quinielaIndex++;
      if (quinielaIndex >= quinielaList.length) { quinielaIndex = 0; masterSection = 4; }
      setTimeout(startMasterBroadcastLoop, 1000);
    }, 400);
  }, 12000);
}

function renderHoroscopeCard() {
  if (horoscopeIndex >= horoscopeList.length) horoscopeIndex = 0;
  const item = horoscopeList[horoscopeIndex];
  upperCard.className = 'upper-card horoscope-mode';

  cardDynamicContent.innerHTML = `
    <div style="display:flex; align-items:center; width:100%; gap:25px;">
      <div style="display:flex; align-items:center; gap:16px; background:#1e293b; padding:8px 18px; border-radius:8px; border:2px solid #f59e0b; min-width:380px;">
        <div style="width:55px; height:55px; color:#f59e0b; display:flex; align-items:center; justify-content:center;">${ZODIAC_SVGS[item.key] || ''}</div>
        <div>
          <div style="font-family:'Oswald'; font-size:38px; font-weight:800; color:#fff; text-transform:uppercase;">${item.name}</div>
          <div style="font-size:14px; font-weight:800; color:#f59e0b;">${item.dates}</div>
        </div>
      </div>
      <div style="flex:1; overflow:hidden; position:relative; height:60px; display:flex; align-items:center;">
        <div id="horoscopeText" style="font-size:32px; font-weight:800; color:#fff; white-space:nowrap; position:absolute; left:0;">${item.text}</div>
      </div>
    </div>
  `;

  setTimeout(() => {
    upperCard.classList.remove('hidden-card');
    setTimeout(() => {
      upperCard.classList.add('hidden-card');
      setTimeout(() => {
        horoscopeIndex++;
        if (horoscopeIndex >= horoscopeList.length) { horoscopeIndex = 0; masterSection = 0; }
        setTimeout(startMasterBroadcastLoop, 1000);
      }, 400);
    }, 12000);
  }, 100);
}

// Ticker Inferior de Noticias (Jotform)
async function fetchJotformNews() {
  let newsList = [];
  try {
    const cacheBuster = `&_t=${Date.now()}`;
    const apiUrl = `https://api.jotform.com/website-widgets/templates/019f3bae37487000889dd04d159b98b17f3a/execute-action?action=refreshSocialFeed&widgetID=01a13e9789a87000805d60e413b14e37d5b0${cacheBuster}`;
    const res = await fetch(apiUrl, { cache: "no-store" });
    const data = await res.json();
    if (data && data.content && data.content.feedData && data.content.feedData.sources) {
      data.content.feedData.sources.forEach(sourceObj => {
        if (sourceObj.success && sourceObj.posts) {
          sourceObj.posts.slice(0, 5).forEach(post => {
            if (post.title) newsList.push({ text: post.title.trim(), source: sourceObj.sourceLabel ? sourceObj.sourceLabel.toUpperCase() : "NOTICIAS" });
          });
        }
      });
    }
  } catch (e) {}

  if (newsList.length === 0) {
    newsList = [
      { text: "Bienvenidos a DJ TV Estación Mix - Transmitiendo música y entretenimiento las 24 horas en calidad HD.", source: "DJ TV" },
      { text: "Disfrutá de la mejor selección de música retro, pop, reggaeton y rock nacional.", source: "MÚSICA" }
    ];
  }

  const container = document.getElementById('tickerText');
  if (container) {
    let htmlContent = '';
    [...newsList, ...newsList].forEach(item => {
      htmlContent += `<div class="news-item"><span class="news-source">${item.source}</span> ${item.text}<span class="news-separator" style="color:#2563eb; margin-left:25px;">•</span></div>`;
    });
    container.innerHTML = htmlContent;
    
    let posX = 0;
    function step() {
      posX -= 1.2;
      const width = container.scrollWidth / 2;
      if (width > 0 && Math.abs(posX) >= width) posX = 0;
      container.style.transform = `translateX(${posX}px)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

initMasterConfig();
loadLotteryData();
loadHoroscopeAPIs();
fetchJotformNews();
