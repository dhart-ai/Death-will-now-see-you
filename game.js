

// all tunable values in one place
const CONFIG = {
  STARTING_REPUTATION: 100,
  MAX_REPUTATION: 100,
  TOTAL_ROUNDS: 5,
  FAILED_RECIPE_PENALTY: -10,
  SUSPICION_PENALTY: -45,

  RECIPES: {
    "nightshade+valerian_root": { name: "Quiet Passage",  delta: +10,  message: "Thanks, Doc... I feel strange." },
    "chalk_powder+nightshade":  { name: "Obvious Poison", delta: -60, message: "What IS this?! Someone help!" },
    "chalk_powder+peppermint_oil": { name: "Soothing Tonic", delta: +15, message: "I feel better already. Thank you." },
    "peppermint_oil+valerian_root": { name: "Masked Remedy", delta: -30,  message: "Tastes a bit odd... but okay." },
    "laudanum+valerian_root": { name: "The Long Sleep", delta: -5, message: "I feel... drowsy, but at peace." },
    "foxglove_tincture+nightshade": { name: "Heart's Stop", delta: -20, message: "AAAGH— my chest—!!" },
    "chalk_powder+iron_sulfate": { name: "Iron Stomach", delta: -12, message: "I... don't feel great, Doc." },
  }
};

// PATIENTS — one per round
const PATIENTS = [
  { name: "Edmund ScissorHead" },
  { name: "Mary Osborn" },
  { name: "Thomas Hawthorne" },
  { name: "Clara Duloone" },
  { name: "William ShankSpear"},
];

// GAME STATE — everything that changes at runtime
let state = {
  currentRound: 0,
  reputation: CONFIG.STARTING_REPUTATION,
  gameState: "playing",
  selectedIngredients: [],
  lastRecipeUsed: null,
};

// SANITY CHECK
console.log("CONFIG loaded:", CONFIG);
console.log("State loaded:", state);
console.log("First patient:", PATIENTS[state.currentRound]);

// Ingredient Selection

const ingredientButtons = document.querySelectorAll(".ingredient-btn");
const slot1 = document.getElementById("slot-1"); 
const slot2 = document.getElementById("slot-2");

ingredientButtons.forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;

    if (state.selectedIngredients.includes(id)) { // If already selected, deselect
      state.selectedIngredients = state.selectedIngredients.filter(ingredient => ingredient !== id); // Deselect if already selected
      button.classList.remove("selected"); // Remove visual highlight
    } else {
      if (state.selectedIngredients.length < 2) { // Only allow selection of 2 ingredients
        state.selectedIngredients.push(id); // Add ingredient to selection
        button.classList.add("selected"); // Add visual highlight
      }
    }

    updateSlots(); // Update the display of selected ingredients
  });
});

function updateSlots() {
  slot1.textContent = state.selectedIngredients[0] || "—";
  slot2.textContent = state.selectedIngredients[1] || "—";// Update the display of selected ingredients
}

const prescribeBtn = document.getElementById("prescribe-btn"); // Button to finalize prescription
const repVialFill = document.getElementById("rep-vial-fill"); // Visual representation of reputation
const patientReaction = document.getElementById("patient-reaction"); // Element to display patient's reaction message

prescribeBtn.addEventListener("click", () => {
  if (state.selectedIngredients.length !== 2) return;

  const key = [...state.selectedIngredients].sort().join("+");

  const result = CONFIG.RECIPES[key] || {
    name: "Inert Mix",
    delta: CONFIG.FAILED_RECIPE_PENALTY,
    message: "...Is this medicine?"
  };

  applyOutcome(result);
});

function applyOutcome(result) {
  // 1. Update reputation, clamped between 0 and MAX_REPUTATION
  state.reputation = Math.max(0, Math.min(CONFIG.MAX_REPUTATION, state.reputation + result.delta));
  
  patientReaction.textContent = result.message; // Show patient's reaction message
  repVialFill.style.width = ((state.reputation / CONFIG.MAX_REPUTATION) * 100) + "%"; // Update visual representation of reputation
  if(state.reputation <= 0) {
    gameOver();
  }
  nextRound(); // Move to the next round after applying the outcome
}

const patientNameEl = document.getElementById("patient-name"); // Element to display current patient's name
const roundCounterEl = document.getElementById("round-counter");
const gameoverScreen = document.getElementById("gameover-screen");
const gameoverTitle = document.getElementById("gameover-title");
const gameoverMessage = document.getElementById("gameover-message");

function nextRound() {
  state.currentRound++;

  if (state.currentRound >= CONFIG.TOTAL_ROUNDS) { // If we've completed all rounds, the player wins
    winGame();
    return;
  }
  else{
    patientNameEl.textContent = PATIENTS[state.currentRound].name; // Update patient name for the new round
    roundCounterEl.textContent = `Patient ${state.currentRound + 1} of ${CONFIG.TOTAL_ROUNDS}`; // Update round counter
  }
  state.selectedIngredients = [];// Clear selected ingredients for the new round
  ingredientButtons.forEach(button => button.classList.remove("selected"));// Clear visual highlights from ingredient buttons
  updateSlots();
}

function gameOver() {
  state.gameState = "gameover";
  gameoverScreen.classList.remove("hidden");
  gameoverTitle.textContent = "You've Been Caught.";
  gameoverMessage.textContent = "Your reputation crumbled to nothing.";
}


function winGame() {
  state.gameState = "WIN";
  gameoverScreen.classList.remove("hidden");
  gameoverTitle.textContent = "You pleased Death.";
  gameoverMessage.textContent = "Good job! You win.";
}