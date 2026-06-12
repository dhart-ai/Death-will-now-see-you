

// all tunable values in one place
const CONFIG = {
  STARTING_REPUTATION: 100,
  MAX_REPUTATION: 100,
  TOTAL_ROUNDS: 5,
  FAILED_RECIPE_PENALTY: -10,
  SUSPICION_PENALTY: -15,

  RECIPES: {
    "nightshade+valerian_root": { name: "Quiet Passage",  delta: -5,  message: "Thanks, Doc... I feel strange." },
    "chalk_powder+nightshade":  { name: "Obvious Poison", delta: -25, message: "What IS this?! Someone help!" },
    "chalk_powder+peppermint_oil": { name: "Soothing Tonic", delta: +15, message: "I feel better already. Thank you." },
    "peppermint_oil+valerian_root": { name: "Masked Remedy", delta: +5,  message: "Tastes a bit odd... but okay." },
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