
/*---------- Variables (state) ---------*/

let firstCard = null;
let secondCard = null;
//let thirdcard = null;
let playerScore = 0;
let wrongGuesses = 0;
let isFlipping = false;
let timeLeft = 30;
let timerInterval = null;
const maxWrongGuesses = 5; 

/*-------------- Constants -------------*/
const resultDisplayEl = document.querySelector('#result-display');
const playerChoiceEl = document.querySelector('#player-choice');
const playerScoreEl = document.querySelector('#player-score');
const cards = document.querySelectorAll('.card');
const resetBtn = document.querySelector('#resetButton');
const startBtn = document.querySelector('#startButton');


const timerDisplay = document.createElement('p');
timerDisplay.style.color = 'orange';
timerDisplay.style.fontWeight = 'bold';
timerDisplay.textContent = '';
document.querySelector('header').appendChild(timerDisplay);

/* ---------- Card Images ---------- */

const images = [
  { value: 1, url: "https://tse4.mm.bing.net/th/id/OIP.-G_HZBCB2H-GTPu8TTgxdgHaGj" },
  { value: 2, url: "https://images3.alphacoders.com/658/658610.jpg" },
  { value: 3, url: "https://wallpapercave.com/wp/wp3997776.jpg" },
  { value: 4, url: "https://tse4.mm.bing.net/th/id/OIP.01r52uDIwrDPAI1A6Xx8mwHaHa" },
  { value: 6, url: "https://media.istockphoto.com/photos/orange-picture-id185284489?k=6&m=185284489&s=612x612&w=0&h=x_w4oMnanMTQ5KtSNjSNDdiVaSrlxM4om-3PQTIzFaY=" },
  { value: 7, url: "https://th.bing.com/th/id/OIP.KD5TiA6k_Ug8SWjYmxQ4ZgHaIr?w=163&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" }
];

/* ---------- Game Functions ---------- */

function shuffleCards() {
  const fullDeck = images.concat(images); 
  for (let i = fullDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
  }

  cards.forEach((card, index) => {
    const img = card.querySelector('img');
    img.src = fullDeck[index].url;
    card.setAttribute('data-card-value', fullDeck[index].value);
  });
}

function flipCard() {
  if (isFlipping || this.classList.contains('flipped') || this.classList.contains('matched')) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    const choice = firstCard.getAttribute('data-card-value');
    playerChoiceEl.textContent = `You chose: ${choice}`;
  } else {
    secondCard = this;
    checkForMatch();
  }
}

function checkForMatch() {
  isFlipping = true;

  const firstValue = firstCard.getAttribute('data-card-value');
  const secondValue = secondCard.getAttribute('data-card-value');

  if (firstValue === secondValue) {
    playerScore++;
    resultDisplayEl.textContent = '✅ Match found!';
    playerScoreEl.textContent = `Score: ${playerScore}`;
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetFlip();

    if (document.querySelectorAll('.matched').length === cards.length) {
      endGame(true);
    }
  } else {
    wrongGuesses++;
    resultDisplayEl.textContent = `❌ Wrong! (${wrongGuesses}/${maxWrongGuesses})`;

    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetFlip();

      if (wrongGuesses >= maxWrongGuesses) {
        endGame(false);
      }
    }, 1000);
  }
}

function resetFlip() {
  [firstCard, secondCard] = [null, null];
  isFlipping = false;

}

function startTimer() {
  timeLeft = 30;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(false);
    }
  }, 1000);
}

function startGame() {
  resetGame();
  shuffleCards();

  resultDisplayEl.textContent = '🧠 Memorize the cards!';
  cards.forEach(card => {
    card.classList.add('flipped');
    card.style.pointerEvents = 'none';
  });

  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('flipped');
      card.style.pointerEvents = '';
    });
    resultDisplayEl.textContent = '🎮 Game started! Find all matches!';
    startTimer();
  }, 3000);
}

function resetGame() {
  clearInterval(timerInterval);
  timeLeft = 30;
  wrongGuesses = 0;
  playerScore = 0;
  playerChoiceEl.textContent = '';
  playerScoreEl.textContent = 'Score: 0';
  resultDisplayEl.textContent = 'Game reset. Click start!';
  timerDisplay.textContent = '';

  cards.forEach(card => {
    card.classList.remove('flipped', 'matched');
    card.style.pointerEvents = '';
    const img = card.querySelector('img');
    img.src = ''; 
  });

  [firstCard, secondCard] = [null, null];
}

/* ---------- End Game ---------- */
function endGame(won) {
  clearInterval(timerInterval);
  cards.forEach(card => card.style.pointerEvents = 'none');
  resultDisplayEl.textContent = won ? '🎉 You Win! 🎉' : '⏰ You Lose! Try Again.';
}

/* ---------- Event Listeners ---------- */
cards.forEach(card => {
  card.addEventListener('click', flipCard);
});
resetBtn.addEventListener('click', resetGame);
startBtn.addEventListener('click', startGame);

resultDisplayEl.textContent = 'Click start!';

 