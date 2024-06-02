const suits = ['♥', '♦', '♣', '♠'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;

const dealButton = document.getElementById('deal-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerScoreDiv = document.getElementById('player-score');
const dealerScoreDiv = document.getElementById('dealer-score');
const messageDiv = document.getElementById('message');

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

function updateScores() {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    playerScoreDiv.innerText = `Score: ${playerScore}`;
    dealerScoreDiv.innerText = `Score: ${dealerScore}`;
}

function calculateScore(hand) {
    let score = 0;
    let hasAce = false;
    for (let card of hand) {
        score += getCardValue(card);
        if (card.value === 'A') hasAce = true;
    }
    if (score > 21 && hasAce) {
        score -= 10;
    }
    return score;
}

function dealInitialCards() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateScores();
    renderHands();
    checkForBlackjack();
}

function renderHands() {
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';
    playerHand.forEach(card => playerCardsDiv.appendChild(createCardElement(card)));
    dealerHand.forEach((card, index) => {
        if (index === 0 && !gameOver) {
            dealerCardsDiv.appendChild(createCardElement({ value: '?', suit: '?' }));
        } else {
            dealerCardsDiv.appendChild(createCardElement(card));
        }
    });
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `<span>${card.value}</span><span class="suit">${card.suit}</span>`;
    return cardDiv;
}

function checkForBlackjack() {
    if (playerScore === 21) {
        messageDiv.innerText = 'Blackjack! You win!';
        gameOver = true;
        renderHands();
    } else if (dealerScore === 21) {
        messageDiv.innerText = 'Dealer has Blackjack! You lose!';
        gameOver = true;
        renderHands();
    }
}

dealButton.addEventListener('click', () => {
    gameOver = false;
    messageDiv.innerText = '';
    createDeck();
    shuffleDeck();
    dealInitialCards();
});

hitButton.addEventListener('click', () => {
    if (!gameOver) {
        playerHand.push(deck.pop());
        updateScores();
        renderHands();
        if (playerScore > 21) {
            messageDiv.innerText = 'You busted! Dealer wins!';
            gameOver = true;
        }
    }
});

standButton.addEventListener('click', () => {
    if (!gameOver) {
        while (dealerScore < 17) {
            dealerHand.push(deck.pop());
            updateScores();
        }
        if (dealerScore > 21) {
            messageDiv.innerText = 'Dealer busted! You win!';
        } else if (dealerScore >= playerScore) {
            messageDiv.innerText = 'Dealer wins!';
        } else {
            messageDiv.innerText = 'You win!';
        }
        gameOver = true;
        renderHands();
    }
});
