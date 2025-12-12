/* script.js - game logic */

/* Questions defined per level */
const QUESTIONS = {
  1: [
    {q: "Die Milch steht im Kühlregal.", a: "Richtig"},
    {q: "Tomaten findest du bei den Früchten.", a: "Falsch"},
    {q: "Die Eier sind im Tiefkühlfach.", a: "Falsch"},
    {q: "Brot findest du in der Backwaren-Abteilung.", a: "Richtig"},
    {q: "Wasser steht bei den Getränken.", a: "Richtig"},
    {q: "Schokolade findest du bei den Süssigkeiten.", a: "Richtig"},
    {q: "Äpfel liegen in der Gemüse-Abteilung.", a: "Richtig"},
    {q: "Chips findest du beim WC-Papier.", a: "Falsch"}
  ],
  2: [
    {q: "Joghurt steht immer direkt neben dem Käse.", a: "Kommt drauf an"},
    {q: "Reis findest du im gleichen Regal wie Teigwaren.", a: "Kommt drauf an"},
    {q: "Putzmittel stehen bei den Lebensmitteln.", a: "Falsch"},
    {q: "Tiefkühlpizza ist im Tiefkühlregal.", a: "Richtig"},
    {q: "Bananen liegen im Kühlschrank.", a: "Falsch"},
    {q: "WC-Papier findest du bei den Putzmitteln.", a: "Oft richtig"}
  ],
  3: [
    {q: "Regionale Produkte haben oft eine spezielle Kennzeichnung.", a: "Richtig"},
    {q: "Aktionen stehen immer ganz hinten im Laden.", a: "Falsch"},
    {q: "Glace findest du im gleichen Tiefkühlfach wie Gemüse.", a: "Falsch"},
    {q: "Shampoo steht in der Kosmetik-/Hygiene-Abteilung.", a: "Richtig"},
    {q: "Reis steht im gleichen Gang wie Zucker und Mehl.", a: "Oft richtig"},
    {q: "Kundendienst / Info-Punkt ist direkt neben der Kasse.", a: "Kann stimmen"}
  ]
};

/* Time limits per level */
const TIMES = {1:15, 2:10, 3:5};

let state = {
  level: 1,
  index: 0,
  score: 0,
  timeLeft: 0,
  timerId: null
};

/* Elements */
const menu = document.getElementById('menu');
const levelsEl = document.getElementById('levels');
const settingsEl = document.getElementById('settings');
const gameEl = document.getElementById('game');
const resultEl = document.getElementById('result');
const questionEl = document.getElementById('question');
const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');
const scoreBig = document.getElementById('scoreBig');
const details = document.getElementById('details');

/* Buttons */
document.getElementById('levelsBtn').onclick = () => show('levels');
document.getElementById('settingsBtn').onclick = () => show('settings');
document.getElementById('playBtn').onclick = resumeOrStart;
document.getElementById('quitBtn').onclick = quitToMenu;
document.getElementById('restartBtn').onclick = restartLevel;
document.getElementById('menuBtn').onclick = gotoMenu;
document.getElementById('retoursettingsBtn').onclick = gotoMenu
  
/* Level buttons */
document.querySelectorAll('.level').forEach(b => {
  b.addEventListener('click', () => {
    const lvl = Number(b.dataset.level);
    startLevel(lvl);
  });
});

/* Answer buttons */
document.getElementById('richtigBtn').onclick = () => submitAnswer('Richtig');
document.getElementById('falschBtn').onclick = () => submitAnswer('Falsch');

/* Music toggle */
const musicToggle = document.getElementById('musicToggle');
const bgmusic = document.getElementById('bgmusic');
musicToggle.addEventListener('change', ()=> {
  if (musicToggle.checked) bgmusic.play().catch(()=>{});
  else bgmusic.pause();
});

/* Save & load progress in localStorage */
const STORAGE_KEY = 'rof_migros_progress_v1';
function saveProgress(){
  const data = {
    level: state.level,
    index: state.index,
    score: state.score,
    timeLeft: state.timeLeft
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch(e){ return null; }
}

/* Show a section */
function show(id){
  document.querySelectorAll('main .card').forEach(c => c.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

/* Start/resume */
function resumeOrStart(){
  const p = loadProgress();
  if (p && p.level && p.index < (QUESTIONS[p.level] || []).length){
    // resume saved progress
    state.level = p.level; state.index = p.index; state.score = p.score;
    startPlaying();
  } else {
    // start new at previously selected level or level 1
    startLevel(state.level);
  }
}

/* Start a level */
function startLevel(lvl){
  state.level = lvl;
  state.index = 0;
  state.score = 0;
  startPlaying();
}

/* Start playing */
function startPlaying(){
  show('game');
  loadQuestion();
}

/* Load question */
function loadQuestion(){
  clearInterval(state.timerId);
  const list = QUESTIONS[state.level] || [];
  if (state.index >= list.length){
    endLevel();
    return;
  }
  const item = list[state.index];
  questionEl.innerText = item.q;
  progressEl.innerText = `${state.index + 1} / ${list.length}`;

  state.timeLeft = TIMES[state.level];
  updateTimerUI();
  state.timerId = setInterval(()=>{
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0){
      clearInterval(state.timerId);
      state.index++;
      saveProgress();
      loadQuestion();
    }
  }, 1000);

  // persist progress so that "Spielen" can resume later
  saveProgress();
}

/* Update timer UI */
function updateTimerUI(){
  timerEl.innerText = state.timeLeft + 's';
  if (state.timeLeft > 10) timerEl.style.color = 'green';
  else if (state.timeLeft > 5) timerEl.style.color = 'orange';
  else timerEl.style.color = 'red';
}

/* Submit answer */
function submitAnswer(ans){
  clearInterval(state.timerId);
  const item = (QUESTIONS[state.level] || [])[state.index];
  if (item){
    const key = item.a;
    // If answer key explicitly contains Richtig/Falsch, check it.
    // If key is ambiguous (like 'Kommt drauf an', 'Oft richtig', 'Kann stimmen'), accept both answers as correct.
    let correct = false;
    if (key.includes('Richtig')) correct = ans === 'Richtig';
    else if (key.includes('Falsch')) correct = ans === 'Falsch';
    else correct = true; // ambiguous => accept either as correct
    if (correct) state.score++;
  }
  state.index++;
  saveProgress();
  loadQuestion();
}

/* End of level */
function endLevel(){
  clearInterval(state.timerId);
  // calculate percent
  const total = (QUESTIONS[state.level] || []).length;
  const percent = Math.round((state.score / total) * 100);
  // update score display
  scoreBig.innerText = percent + '%';
  scoreBig.style.color = percent >= 50 ? 'green' : 'red';
  details.innerText = `Level ${state.level} — ${state.score} von ${total} richtigen Antworten`;

  // store best score per level
  const bestKey = 'rof_best_scores_v1';
  const raw = localStorage.getItem(bestKey);
  let best = raw ? JSON.parse(raw) : {};
  if (!best[state.level] || percent > best[state.level]){
    best[state.level] = percent;
    localStorage.setItem(bestKey, JSON.stringify(best));
  }

  // clear saved in-progress state (level finished)
  localStorage.removeItem(STORAGE_KEY);

  show('result');
}

/* Restart level */
function restartLevel(){
  startLevel(state.level);
}

/* Go to menu */
function gotoMenu(){
  state.index = 0; state.score = 0; state.timeLeft = 0;
  saveProgress();
  show('menu');
}

/* Quit to menu (keeps progress available to resume) */
function quitToMenu(){
  saveProgress();
  show('menu');
}

/* Initialize: show menu */
show('menu');
