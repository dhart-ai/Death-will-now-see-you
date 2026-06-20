const CONFIG = { // GAME SETTINGS
  STARTING_REPUTATION: 100,
  MAX_REPUTATION: 100,
  TOTAL_DAYS: 3,
  PATIENTS_PER_DAY: 3,
  FAILED_RECIPE_PENALTY: -10,
  MIN_KILLS_TO_WIN: 2,

  RECIPES: {
    "nightshade+valerian_root": {
      name: "Quiet Passage",
      delta: -5,
      healthChange: -25,
      detectable: false,
      message: "Tastes a little bitter, Doctor..."
    },
    "chalk_powder+nightshade": {
      name: "Obvious Poison",
      delta: -25,
      healthChange: -50,
      detectable: true,
      message: "Something is wrong — I can feel it!"
    },
    "chalk_powder+peppermint_oil": {
      name: "Soothing Tonic",
      delta: 15,
      healthChange: 20,
      detectable: false,
      message: "I feel better already. Thank you, Doctor."
    },
    "peppermint_oil+valerian_root": {
      name: "Masked Remedy",
      delta: 5,
      healthChange: 10,
      detectable: false,
      message: "Tastes a bit odd... but I suppose I trust you."
    },
    "laudanum+nightshade": {
      name: "The Long Sleep",
      delta: -3,
      healthChange: -15,
      detectable: false,
      message: "Mmm... I feel quite drowsy, Doctor."
    },
    "foxglove_tincture+laudanum": {
      name: "Heart's Quiet",
      delta: -15,
      healthChange: -40,
      detectable: true,
      message: "I feel... strange. So very tired..."
    },
    "foxglove_tincture+nightshade": {
      name: "Heart's Failure",
      delta: -30,
      healthChange: -70,
      detectable: true,
      message: "My chest — something is terribly wrong!"
    },
    "chalk_powder+iron_sulfate": {
      name: "Iron Stomach",
      delta: -8,
      healthChange: -20,
      detectable: true,
      message: "My stomach... what did you give me?"
    },
    "laudanum+peppermint_oil": {
      name: "Calm Recovery",
      delta: 10,
      healthChange: 15,
      detectable: false,
      message: "I feel wonderfully calm. Thank you, Doctor."
    }
  },

  INERT: {
    name: "Inert Mix",
    delta: -10,
    healthChange: -5,
    detectable: true,
    message: "...Is this actually medicine?"
  },

  INGREDIENTS: {
    nightshade:        { label: "Nightshade",        desc: "A potent toxin. Deadly in the right dose." },
    valerian_root:      { label: "Valerian Root",      desc: "A calming herb. Masks the taste of bitterness." },
    chalk_powder:        { label: "Chalk Powder",        desc: "A neutral filler. Binds other compounds together." },
    peppermint_oil:      { label: "Peppermint Oil",      desc: "A pleasant flavour. Puts patients at ease." },
    laudanum:            { label: "Laudanum",            desc: "A powerful sedative. Masks symptoms and suspicion." },
    foxglove_tincture:   { label: "Foxglove Tincture",   desc: "Fast and lethal. Stops the heart — but draws attention." },
    iron_sulfate:        { label: "Iron Sulfate",        desc: "A harsh irritant. Causes visible, suspicious symptoms." }
  }
};

// PATIENTS — only 3, seen every day across all 3 days
const ALL_PATIENTS = [
  { name: "Edmund Hale",   portrait: "🧓", health: 100, alive: true },
  { name: "Mary Ashworth", portrait: "👩", health: 100, alive: true },
  { name: "Thomas Grigg",  portrait: "🧔", health: 100, alive: true },
];

// GAME STATE
let state = {
  currentDay: 1,
  currentPatientIndex: 0,
  patientsSeenToday: 0,
  reputation: CONFIG.STARTING_REPUTATION,
  gameState: "playing",
  selectedIngredients: [],
  lastRecipeUsed: null,
  activePatients: [],
};

// SANITY CHECK
console.log("CONFIG loaded:", CONFIG);
console.log("State loaded:", state);
console.log("Day 1 patients:", ALL_PATIENTS);

// RENDER FUNCTIONS
function renderPatient() {
  const patientIndex = state.patientsSeenToday;
  const patient = ALL_PATIENTS[patientIndex];
  state.currentPatientIndex = patientIndex;

  document.getElementById("patient-name").textContent = patient.name;
  document.getElementById("patient-portrait").textContent = patient.portrait;
  document.getElementById("patient-reaction").textContent =
    `Health: ${patient.health} — Awaiting prescription...`;

  document.getElementById("round-counter").textContent =
    `Day ${state.currentDay} — Patient ${state.patientsSeenToday + 1} of ${CONFIG.PATIENTS_PER_DAY}`;

  const repPercent = (state.reputation / CONFIG.MAX_REPUTATION) * 100;
  document.getElementById("rep-vial-fill").style.width = repPercent + "%";

  state.selectedIngredients = [];
  document.querySelectorAll(".ingredient-btn").forEach(btn => btn.classList.remove("selected"));
  document.getElementById("slot-1").textContent = "—";
  document.getElementById("slot-2").textContent = "—";
}

function renderIngredientDescriptions() {
  document.querySelectorAll(".ingredient-btn").forEach(btn => {
    const id = btn.dataset.id;
    const info = CONFIG.INGREDIENTS[id];
    btn.title = info.desc;
  });
}

// INIT
function init() {
  renderIngredientDescriptions();
  renderPatient();
}

init();

// STAGE 4: INGREDIENT CLICK LOGIC

function handleIngredientClick(event) {
  const btn = event.currentTarget;
  const id = btn.dataset.id;

  if (state.selectedIngredients.includes(id)) {
    state.selectedIngredients = state.selectedIngredients.filter(ing => ing !== id);
    btn.classList.remove("selected");
    updateSlots();
    return;
  }

  if (state.selectedIngredients.length >= 2) {
    return;
  }

  state.selectedIngredients.push(id);
  btn.classList.add("selected");
  updateSlots();
}

function updateSlots() {
  const slot1 = document.getElementById("slot-1");
  const slot2 = document.getElementById("slot-2");

  const [first, second] = state.selectedIngredients;

  slot1.textContent = first ? CONFIG.INGREDIENTS[first].label : "—";
  slot2.textContent = second ? CONFIG.INGREDIENTS[second].label : "—";
}

document.querySelectorAll(".ingredient-btn").forEach(btn => {
  btn.addEventListener("click", handleIngredientClick);
});

// STAGE 5: PRESCRIBE LOGIC

function matchRecipe(ingredients) {
  const key = [...ingredients].sort().join("+");
  return CONFIG.RECIPES[key] || CONFIG.INERT;
}

function handlePrescribe() {
  if (state.selectedIngredients.length !== 2) {
    return;
  }

  const patient = ALL_PATIENTS[state.currentPatientIndex];

  if (!patient.alive) {
    return;
  }

  const recipe = matchRecipe(state.selectedIngredients);

  let delta = recipe.delta;
  if (state.lastRecipeUsed === recipe.name && delta < 0) {
    delta = delta * 2;
  }
  state.reputation = Math.max(0, Math.min(CONFIG.MAX_REPUTATION, state.reputation + delta));
  state.lastRecipeUsed = recipe.name;

  patient.health = Math.max(0, Math.min(100, patient.health + recipe.healthChange));

  if (patient.health <= 0) {
    patient.alive = false;
  }

  document.getElementById("patient-reaction").textContent =
    patient.alive
      ? `${recipe.message} (Health: ${patient.health})`
      : `${patient.name} has died.`;

  const repPercent = (state.reputation / CONFIG.MAX_REPUTATION) * 100;
  document.getElementById("rep-vial-fill").style.width = repPercent + "%";

  if (state.reputation <= 0) {
    triggerGameOver();
    return;
  }

  console.log(`Prescribed "${recipe.name}" to ${patient.name}. Health: ${patient.health}. Alive: ${patient.alive}. Reputation: ${state.reputation}`);
  handlePrescribeComplete();
}

function triggerGameOver() {
  state.gameState = "gameover";
  document.getElementById("gameover-screen").classList.remove("hidden");
}

document.getElementById("prescribe-btn").addEventListener("click", handlePrescribe);

// STAGE 6: PATIENT / DAY PROGRESSION

function handlePrescribeComplete() {
  document.getElementById("prescribe-btn").classList.add("hidden");
  document.getElementById("next-btn").classList.remove("hidden");
}

function goToNextPatient() {
  state.patientsSeenToday++;

  const dayComplete = state.patientsSeenToday >= CONFIG.PATIENTS_PER_DAY;

  if (dayComplete) {
    showOvernightResults();
  } else {
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("prescribe-btn").classList.remove("hidden");
    renderPatient();
  }
}

function showOvernightResults() {
  state.gameState = "results";

  const resultsList = document.getElementById("results-list");
  resultsList.innerHTML = "";

  ALL_PATIENTS.forEach(patient => {
    const isDeceased = !patient.alive;
    const statusText = isDeceased
      ? "Found unresponsive this morning."
      : `Health: ${patient.health} / 100`;

    renderResultEntry(patient, statusText, isDeceased);
  });

  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("hud").classList.add("hidden");
  document.getElementById("results-screen").classList.remove("hidden");
}

function renderResultEntry(patient, symptomText, isDeceased) {
  const entry = document.createElement("div");
  entry.className = isDeceased ? "result-entry deceased" : "result-entry";

  entry.innerHTML = `
    <div class="result-name">${patient.portrait} ${patient.name}</div>
    <div class="result-symptom">${symptomText}</div>
    ${isDeceased ? '<div class="result-status">DECEASED</div>' : ''}
  `;

  document.getElementById("results-list").appendChild(entry);
}

function continueToNextDay() {
  document.getElementById("results-screen").classList.add("hidden");
  document.getElementById("hud").classList.remove("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  state.currentDay++;
  state.patientsSeenToday = 0;

  if (state.currentDay > CONFIG.TOTAL_DAYS) {
    triggerWin();
    return;
  }

  state.gameState = "playing";
  document.getElementById("next-btn").classList.add("hidden");
  document.getElementById("prescribe-btn").classList.remove("hidden");
  renderPatient();
}

function getKillCount() {
  return ALL_PATIENTS.filter(p => !p.alive).length;
}

function triggerWin() {
  const kills = getKillCount();

  if (kills >= CONFIG.MIN_KILLS_TO_WIN) {
    state.gameState = "win";
    document.getElementById("gameover-title").textContent = "Death is Satisfied.";
    document.getElementById("gameover-message").textContent =
      `You survived all ${CONFIG.TOTAL_DAYS} days and claimed ${kills} of ${ALL_PATIENTS.length} patients. Your secret is safe... for now.`;
  } else {
    state.gameState = "gameover";
    document.getElementById("gameover-title").textContent = "Death is Displeased.";
    document.getElementById("gameover-message").textContent =
      `You survived, but only claimed ${kills} of the required ${CONFIG.MIN_KILLS_TO_WIN} patients. Death demands more.`;
  }

  document.getElementById("gameover-screen").classList.remove("hidden");
}

document.getElementById("continue-btn").addEventListener("click", continueToNextDay);
document.getElementById("next-btn").addEventListener("click", goToNextPatient);