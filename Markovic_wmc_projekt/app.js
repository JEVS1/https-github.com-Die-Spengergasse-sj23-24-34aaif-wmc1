
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

let usedPokemonIds = []; 
let showLoading = false;
let count = 0; 
let points = 0;

//fetch one pokemon with and ID
async function fetchPokemonById(id) {
  //show loading while fetching data.
  showLoading = true;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}
//load question
async function loadQuestionWithOptions() {
  if (showLoading) {
    showLoadingWindow();
    hidePuzzleWindow();
  }

  //fetch correct answer first
  let pokemonId = getRandomPokemonId();

  // check if the current question has allready been used/displayed earlier
  while (usedPokemonIds.includes(pokemonId)) {
    pokemonId = getRandomPokemonId();
  }

  // if a pokemon has not been displayed yet, added to usedPokemonIds and it is set as the new const pokemon
  usedPokemonIds.push(pokemonId);
  const pokemon = await fetchPokemonById(pokemonId);

  // create/reset 
  const options = [pokemon.name];
  const optionsIds = [pokemon.id];

  // fetch additional random Pokemon names 
  while (options.length < 4) {
    let randomPokemonId = getRandomPokemonId();
    //ensure fetched option does not exist in the options list. Creates a new random id until it does not exist in optionsId.
    while (optionsIds.includes(randomPokemonId)) {
      randomPokemonId = getRandomPokemonId();
    }
    optionsIds.push(randomPokemonId);

    //fetching a new random pokemon 
    const randomPokemon = await fetchPokemonById(randomPokemonId);
    const randomOption = randomPokemon.name;
    options.push(randomOption);
    if (options.length === 4) {
      showLoading = false;
    }
  }

  // shuffle the 4 options array to always change the place of the right answer.
  shuffleArray(options);

  // clear any previous result and update pokemon image to fetched image URL from the "sprites"
  resultElement.textContent = "Who's that Pokemon?";
  pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

  // create options HTML elements from options array in the DOM
  optionsContainer.innerHTML = ""; // Reset
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = (event) => checkAnswer(option === pokemon.name, event);
    optionsContainer.appendChild(button);
  });

  if (!showLoading) {
    hideLoadingWindow();
    showPuzzleWindow();
  }
}

// Initial load
loadQuestionWithOptions();

// check answer function
function checkAnswer(isCorrect, event) {
  // check if any button is already selected, if falsy => no element => "null".
  const selectedButton = document.querySelector(".selected");

  // if already a button is selected, do nothing, exit function
  if (selectedButton) {
    return;
  }

  // else, mark the clicked button as selected and increase the count of quetion by 1
  event.target.classList.add("selected");
  count++;
  totalCount.textContent = count;

  // right / wrong answer.
  if (isCorrect) {
    displayResult("Correct answer!", "correct");
    points++;
    pointsElement.textContent = points;
    event.target.classList.add("correct");
  } else {
    displayResult("Wrong answer...", "wrong");
    event.target.classList.add("wrong");
  }
  setTimeout(() => {
    showLoading = true;
    loadQuestionWithOptions();
  }, 1000);
}

// --- UTILITY FUNCTIONS ---

//id randomizer
function getRandomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

// create the shuffleArray function
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5); // The sort method expects the callback function to return a value less than 0, equal to 0, or greater than 0. Based on this returned value, it determines the sorting order. If you used Math.random() directly without subtracting 0.5, the callback function would generate values between 0 and 1. Since the sort method expects a comparison result that can be negative, zero, or positive, the absence of the 0.5 would lead to a biased sorting behavior. By subtracting 0.5, you ensure that the values generated by Math.random() are equally likely to be negative or positive.
}

// update result text and class name
function displayResult(result) {
  resultElement.textContent = result;
}

// hide loading window
function hideLoadingWindow() {
  loadingContainer.classList.add("hide");
}

// show loading window
function showLoadingWindow() {
  mainContainer[0].classList.remove("show");
  loadingContainer.classList.remove("hide");
  loadingContainer.classList.add("show");
}

// show puzzle window
function showPuzzleWindow() {
  loadingContainer.classList.remove("show");
  mainContainer[0].classList.remove("hide");
  mainContainer[0].classList.add("show");
}

// hide puzzle window
function hidePuzzleWindow() {
  mainContainer[0].classList.add("hide");
}
