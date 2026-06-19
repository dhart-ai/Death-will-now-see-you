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
    },
    "laudanum+nightshade": {
      name: "The Long Sleep",
      delta: -3,
      strength: 1,
      daysToKill: 3,
      detectable: false,
      symptoms: [
        "Sleeping more than usual. Seems peaceful enough.",
        "Difficult to wake this morning. Family is mildly concerned.",
        "Passed quietly in their sleep. No one suspects foul play."
      ],
      message: "Mmm... I feel quite drowsy, Doctor."
    },
    "foxglove_tincture+laudanum": {
      name: "Heart's Quiet",
      delta: -15,
      strength: 3,
      daysToKill: 1,
      detectable: true,
      symptoms: [
        "Passed in their sleep. Family is shaken but not suspicious — yet."
      ],
      message: "I feel... strange. So very tired..."
    },
    "foxglove_tincture+nightshade": {
      name: "Heart's Failure",
      delta: -30,
      strength: 3,
      daysToKill: 1,
      detectable: true,
      symptoms: [
        "Heart stopped within the hour. A physician is being summoned to investigate."
      ],
      message: "My chest — something is terribly wrong!"
    },
    "chalk_powder+iron_sulfate": {
      name: "Iron Stomach",
      delta: -8,
      strength: 0,
      daysToKill: null,
      detectable: true,
      symptoms: [
        "Nauseous and pale, but stable. Buys you time.",
        "Still unwell. Beginning to ask questions.",
        "Recovering slowly. Suspicion lingers."
      ],
      message: "My stomach... what did you give me?"
    },
    "laudanum+peppermint_oil": {
      name: "Calm Recovery",
      delta: 10,
      strength: 0,
      daysToKill: null,
      detectable: false,
      symptoms: [
        "Resting comfortably. Trusts you completely.",
        "Fully recovered. Recommends you to friends.",
        "In excellent health. Your reputation grows."
      ],
      message: "I feel wonderfully calm. Thank you, Doctor."
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
    nightshade:        { label: "Nightshade",        desc: "A potent toxin. Deadly in the right dose." },
    valerian_root:      { label: "Valerian Root",      desc: "A calming herb. Masks the taste of bitterness." },
    chalk_powder:        { label: "Chalk Powder",        desc: "A neutral filler. Binds other compounds together." },
    peppermint_oil:      { label: "Peppermint Oil",      desc: "A pleasant flavour. Puts patients at ease." },
    laudanum:            { label: "Laudanum",            desc: "A powerful sedative. Masks symptoms and suspicion." },
    foxglove_tincture:   { label: "Foxglove Tincture",   desc: "Fast and lethal. Stops the heart — but draws attention." },
    iron_sulfate:        { label: "Iron Sulfate",        desc: "A harsh irritant. Causes visible, suspicious symptoms." }
  }
};

// PATIENTS
const ALL_PATIENTS = [ // 9 unique patients with names, portraits, and initial health
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

// STAGE 4: INGREDIENT CLICK LOGIC

function handleIngredientClick(event) {
  const btn = event.currentTarget;
  const id = btn.dataset.id; // get ingredient id from data attribute

  // If already selected, clicking again deselects it
  if (state.selectedIngredients.includes(id)) {
    state.selectedIngredients = state.selectedIngredients.filter(ing => ing !== id);
    btn.classList.remove("selected");
    updateSlots();
    return;
  }

  // Don't allow more than 2 ingredients selected at once
  if (state.selectedIngredients.length >= 2) {
    return;
  }

  // Select the ingredient
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

// Attach click listeners to every ingredient button
document.querySelectorAll(".ingredient-btn").forEach(btn => {
  btn.addEventListener("click", handleIngredientClick);
});

// STAGE 5: PRESCRIBE LOGIC

function matchRecipe(ingredients) { // takes your two selected ingredients, sorts them alphabetically, joins them into a key like "nightshade+valerian_root", and looks that up in CONFIG.RECIPES

  // Sort alphabetically and join with "+" so order doesn't matter
  const key = [...ingredients].sort().join("+");

  // Look for a match in CONFIG.RECIPES
  return CONFIG.RECIPES[key] || CONFIG.INERT;
}

function handlePrescribe() {
  // Don't allow prescribing with fewer than 2 ingredients
  if (state.selectedIngredients.length !== 2) {
    return;
  }

  const patient = ALL_PATIENTS[state.currentPatientIndex];
  const recipe = matchRecipe(state.selectedIngredients);

  // Check for consecutive identical recipe penalty
  let delta = recipe.delta;
  if (state.lastRecipeUsed === recipe.name && delta < 0) {
    delta = delta * 2; // double the penalty
  }

  // Apply reputation change
  state.reputation = Math.max(0, Math.min(CONFIG.MAX_REPUTATION, state.reputation + delta));
  state.lastRecipeUsed = recipe.name;

  // Store the prescription on the patient for the overnight results screen later
  patient.prescription = recipe;
  patient.daysRemaining = recipe.daysToKill;

  // Show the patient's immediate reaction
  document.getElementById("patient-reaction").textContent = recipe.message;

  // Update the reputation bar
  const repPercent = (state.reputation / CONFIG.MAX_REPUTATION) * 100;
  document.getElementById("rep-vial-fill").style.width = repPercent + "%";

  // Check for immediate game over
  if (state.reputation <= 0) {
    triggerGameOver();
    return;
  }

  console.log(`Prescribed "${recipe.name}" to ${patient.name}. Reputation delta: ${delta}. New reputation: ${state.reputation}`);
  handlePrescribeComplete();
}

function triggerGameOver() {
  state.gameState = "gameover";
  document.getElementById("gameover-screen").classList.remove("hidden");
}

// Attach click listener to Prescribe button
document.getElementById("prescribe-btn").addEventListener("click", handlePrescribe);

// STAGE 6: PATIENT / DAY PROGRESSION

function handlePrescribeComplete() {
  // Disable prescribing again until next patient loads
  document.getElementById("prescribe-btn").classList.add("hidden"); // hide prescribe button
  document.getElementById("next-btn").classList.remove("hidden"); // show next patient button
}

function goToNextPatient() {
  state.patientsSeenToday++; // increment patients seen today
  state.currentPatientIndex++; // move to next patient in the ALL_PATIENTS array

  const dayComplete = state.patientsSeenToday >= CONFIG.PATIENTS_PER_DAY; // check if we've seen enough patients to complete the day

  if (dayComplete) { // reset for next day
    showOvernightResults(); // show overnight results before moving to next day
  } else {
    document.getElementById("next-btn").classList.add("hidden");
    document.getElementById("prescribe-btn").classList.remove("hidden");
    renderPatient();
  }
}

function showOvernightResults() {
  state.gameState = "results";
  console.log("Day complete. Time to show overnight results (Stage 6 Part B).");
  // We'll build the actual results screen next
}

// Attach click listener to Next Patient button
document.getElementById("next-btn").addEventListener("click", goToNextPatient);