// CONFIG
const CONFIG = { // GAME SETTINGS
  STARTING_REPUTATION: 100,
  MAX_REPUTATION: 100,
  TOTAL_DAYS: 3,
  PATIENTS_PER_DAY: 3,
  FAILED_RECIPE_PENALTY: -10,

  RECIPES: {
    "nightshade+valerian_root": { // making a recipe key by joining ingredient ids with a plus sign
      name: "Quiet Passage",
      delta: -5,
      strength: 1,
      daysToKill: 3,
      detectable: false,
      symptoms: [
        "Complaining of unusual fatigue. Manageable for now.",
        "Pale and refusing food. Something is wrong.",
        "Found unresponsive this morning. Cause unclear."
      ],
      message: "Tastes a little bitter, Doctor..."
    },
    "chalk_powder+nightshade": {
      name: "Obvious Poison",
      delta: -25,
      strength: 3,
      daysToKill: 1,
      detectable: true,
      symptoms: [
        "Collapsed violently. Neighbours heard screaming. Authorities notified."
      ],
      message: "Something is wrong — I can feel it!"
    },
    "chalk_powder+peppermint_oil": {
      name: "Soothing Tonic",
      delta: 15,
      strength: 0,
      daysToKill: null,
      detectable: false,
      symptoms: [
        "Doing remarkably well. Colour returned to their face.",
        "Recovering fully. Singing your praises around town.",
        "Completely healed. Your reputation grows."
      ],
      message: "I feel better already. Thank you, Doctor."
    },
    "peppermint_oil+valerian_root": {
      name: "Masked Remedy",
      delta: 5,
      strength: 0,
      daysToKill: null,
      detectable: false,
      symptoms: [
        "Seems stable. Mild drowsiness reported.",
        "No change. Patient continues daily routine.",
        "Recovered. Nothing remarkable to note."
      ],
      message: "Tastes a bit odd... but I suppose I trust you."
    }
  },

  INERT: { // default "no effect" recipe for when no valid combination is made
    name: "Inert Mix",
    delta: -10,
    strength: 0,
    daysToKill: null,
    detectable: true,
    symptoms: [
      "Patient feels no effect. Growing suspicious of your methods."
    ],
    message: "...Is this actually medicine?"
  },

  INGREDIENTS: { // available ingredients with labels and descriptions
    nightshade:     { label: "Nightshade",     desc: "A potent toxin. Deadly in the right dose." },
    valerian_root:  { label: "Valerian Root",  desc: "A calming herb. Masks the taste of bitterness." },
    chalk_powder:   { label: "Chalk Powder",   desc: "A neutral filler. Binds other compounds together." },
    peppermint_oil: { label: "Peppermint Oil", desc: "A pleasant flavour. Puts patients at ease." }
  }
};

// PATIENTS
const ALL_PATIENTS = [ // 10 unique patients with names, portraits, and initial health
  { name: "Edmund Hale",   portrait: "🧓", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "Mary Ashworth", portrait: "👩", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "Thomas Grigg",  portrait: "🧔", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "Clara Dunne",   portrait: "👵", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "Robert Ash",    portrait: "🧑", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "Agnes Moor",    portrait: "👧", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "William Foss",  portrait: "👴", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "Harriet Cole",  portrait: "🧕", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
  { name: "George Penn",   portrait: "🧒", health: 100, daysRemaining: null, prescription: null, symptomsLog: [], alive: true },
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
console.log("Day 1 patients:", ALL_PATIENTS.slice(0, 3));

// RENDER FUNCTIONS
function renderPatient() { // updates the UI with the current patient's info and resets ingredient selections
  const patient = ALL_PATIENTS[state.currentPatientIndex]; // get current patient based on index

  document.getElementById("patient-name").textContent = patient.name;
  document.getElementById("patient-portrait").textContent = patient.portrait;
  document.getElementById("patient-reaction").textContent = "Awaiting prescription...";

  document.getElementById("round-counter").textContent =
    `Day ${state.currentDay} — Patient ${state.patientsSeenToday + 1} of ${CONFIG.PATIENTS_PER_DAY}`; // show current day and patient number

  const repPercent = (state.reputation / CONFIG.MAX_REPUTATION) * 100; // calculate reputation percentage for the vial fill
  document.getElementById("rep-vial-fill").style.width = repPercent + "%"; // update vial fill based on reputation

  state.selectedIngredients = [];
  document.querySelectorAll(".ingredient-btn").forEach(btn => btn.classList.remove("selected")); // reset ingredient button states
  document.getElementById("slot-1").textContent = "—";
  document.getElementById("slot-2").textContent = "—";
}

function renderIngredientDescriptions() {
  document.querySelectorAll(".ingredient-btn").forEach(btn => {
    const id = btn.dataset.id;
    const info = CONFIG.INGREDIENTS[id]; // get ingredient info from config using data-id attribute
    btn.title = info.desc;
  });
}

// INIT
function init() {
  renderIngredientDescriptions(); // set up ingredient button tooltips
  renderPatient();
}

init();