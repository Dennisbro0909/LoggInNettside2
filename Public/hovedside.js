const balanceText = document.getElementById("balanceText");

let balance = 5000;

function updateBalance() {
    balanceText.textContent = "$" + balance;
}

/* =========================
   MENU SWITCH
========================= */

const slotsSection = document.getElementById("slotsSection");
const blackjackSection = document.getElementById("blackjackSection");
const rouletteSection = document.getElementById("rouletteSection");

document.getElementById("showSlots").addEventListener("click", function () {
    slotsSection.classList.remove("hidden");
    blackjackSection.classList.add("hidden");
    rouletteSection.classList.add("hidden");
});

document.getElementById("showBlackjack").addEventListener("click", function () {
    slotsSection.classList.add("hidden");
    blackjackSection.classList.remove("hidden");
    rouletteSection.classList.add("hidden");
});

document.getElementById("showRoulette").addEventListener("click", function () {
    slotsSection.classList.add("hidden");
    blackjackSection.classList.add("hidden");
    rouletteSection.classList.remove("hidden");
});

/* =========================
   SLOT SOUNDS
========================= */

const threeWinSound = new Audio("big.mp3");
const fourWinSound = new Audio("bug.mp3");

/* =========================
   4x4 SLOT MACHINE
========================= */

const col1Track = document.getElementById("col1Track");
const col2Track = document.getElementById("col2Track");
const col3Track = document.getElementById("col3Track");
const col4Track = document.getElementById("col4Track");

const slotResult = document.getElementById("slotResult");
const slotBetText = document.getElementById("slotBetText");
const slotMinus = document.getElementById("slotMinus");
const slotPlus = document.getElementById("slotPlus");
const spinButton = document.getElementById("spinButton");

const lineOverlay = document.getElementById("lineOverlay");
const winLine = document.getElementById("winLine");

const slotSymbols = ["🍒", "🍋", "⭐", "💎", "7️⃣", "🔔"];
let slotBet = 50;
let slotSpinning = false;
const cellHeight = 120;

function updateSlotBet() {
    slotBetText.textContent = slotBet;
}

slotPlus.addEventListener("click", function () {
    if (slotBet < 500) {
        slotBet += 10;
        updateSlotBet();
    }
});

slotMinus.addEventListener("click", function () {
    if (slotBet > 10) {
        slotBet -= 10;
        updateSlotBet();
    }
});

function clearWinEffects() {
    lineOverlay.classList.remove("ShowLine");
    winLine.setAttribute("x1", 0);
    winLine.setAttribute("y1", 0);
    winLine.setAttribute("x2", 0);
    winLine.setAttribute("y2", 0);

    document.body.classList.remove("PageFlash");
    document.body.classList.remove("BigWinFlash");
}

function makeColumnContent(track, repeatCount) {
    let html = "";

    for (let i = 0; i < repeatCount; i++) {
        for (let symbol of slotSymbols) {
            html += '<div class="Cell">' + symbol + '</div>';
        }
    }

    track.innerHTML = html;
}

function randomSymbol() {
    const randomIndex = Math.floor(Math.random() * slotSymbols.length);
    return slotSymbols[randomIndex];
}

function randomColumnResult() {
    return [
        randomSymbol(),
        randomSymbol(),
        randomSymbol(),
        randomSymbol()
    ];
}

function animateColumn(track, finalColumn, duration) {
    return new Promise(function(resolve) {
        makeColumnContent(track, 10);

        let html = track.innerHTML;
        for (let symbol of finalColumn) {
            html += '<div class="Cell">' + symbol + '</div>';
        }
        track.innerHTML = html;

        const totalCells = 10 * slotSymbols.length;
        const finalOffset = totalCells * cellHeight;

        track.style.transition = "none";
        track.style.transform = "translateY(0px)";
        track.offsetHeight;

        track.style.transition = "transform " + duration + "ms cubic-bezier(0.17, 0.67, 0.2, 1)";
        track.style.transform = "translateY(-" + finalOffset + "px)";

        setTimeout(function () {
            track.style.transition = "none";
            track.innerHTML = "";

            for (let symbol of finalColumn) {
                track.innerHTML += '<div class="Cell">' + symbol + '</div>';
            }

            track.style.transform = "translateY(0px)";
            resolve();
        }, duration + 50);
    });
}

function getBoardFromColumns(col1, col2, col3, col4) {
    return [
        [col1[0], col2[0], col3[0], col4[0]],
        [col1[1], col2[1], col3[1], col4[1]],
        [col1[2], col2[2], col3[2], col4[2]],
        [col1[3], col2[3], col3[3], col4[3]]
    ];
}

function makeWin(kind, payout, x1, y1, x2, y2) {
    return { kind, payout, x1, y1, x2, y2 };
}

function checkWinningLines(board) {
    let wins = [];

    for (let row = 0; row < 4; row++) {
        const line = board[row];
        const y = 60 + (row * 120);

        if (line[0] === line[1] && line[1] === line[2] && line[2] === line[3]) {
            wins.push(makeWin("4-row", slotBet * 8, 60, y, 480, y));
        } else {
            if (line[0] === line[1] && line[1] === line[2]) {
                wins.push(makeWin("3-row", slotBet * 5, 60, y, 340, y));
            }
            if (line[1] === line[2] && line[2] === line[3]) {
                wins.push(makeWin("3-row", slotBet * 5, 200, y, 480, y));
            }
        }
    }

    const diag1 = [board[0][0], board[1][1], board[2][2], board[3][3]];
    if (diag1[0] === diag1[1] && diag1[1] === diag1[2] && diag1[2] === diag1[3]) {
        wins.push(makeWin("4-row", slotBet * 12, 60, 60, 480, 420));
    } else {
        if (diag1[0] === diag1[1] && diag1[1] === diag1[2]) {
            wins.push(makeWin("3-row", slotBet * 5, 60, 60, 340, 300));
        }
        if (diag1[1] === diag1[2] && diag1[2] === diag1[3]) {
            wins.push(makeWin("3-row", slotBet * 5, 200, 180, 480, 420));
        }
    }

    const diag2 = [board[0][3], board[1][2], board[2][1], board[3][0]];
    if (diag2[0] === diag2[1] && diag2[1] === diag2[2] && diag2[2] === diag2[3]) {
        wins.push(makeWin("4-row", slotBet * 12, 480, 60, 60, 420));
    } else {
        if (diag2[0] === diag2[1] && diag2[1] === diag2[2]) {
            wins.push(makeWin("3-row", slotBet * 5, 480, 60, 200, 300));
        }
        if (diag2[1] === diag2[2] && diag2[2] === diag2[3]) {
            wins.push(makeWin("3-row", slotBet * 5, 340, 180, 60, 420));
        }
    }

    return wins;
}

function drawWinLine(win) {
    winLine.setAttribute("x1", win.x1);
    winLine.setAttribute("y1", win.y1);
    winLine.setAttribute("x2", win.x2);
    winLine.setAttribute("y2", win.y2);
    lineOverlay.classList.add("ShowLine");
}

function flashPageSmallWin() {
    document.body.classList.remove("PageFlash");
    void document.body.offsetWidth;
    document.body.classList.add("PageFlash");
}

function flashPageBigWin() {
    document.body.classList.remove("BigWinFlash");
    void document.body.offsetWidth;
    document.body.classList.add("BigWinFlash");
}

spinButton.addEventListener("click", async function () {
    if (slotSpinning) {
        return;
    }

    if (balance < slotBet) {
        slotResult.textContent = "Not enough balance";
        return;
    }

    slotSpinning = true;
    spinButton.disabled = true;
    clearWinEffects();

    balance -= slotBet;
    updateBalance();

    slotResult.textContent = "Spinning...";

    const finalCol1 = randomColumnResult();
    const finalCol2 = randomColumnResult();
    const finalCol3 = randomColumnResult();
    const finalCol4 = randomColumnResult();

    await Promise.all([
        animateColumn(col1Track, finalCol1, 1400),
        animateColumn(col2Track, finalCol2, 1800),
        animateColumn(col3Track, finalCol3, 2200),
        animateColumn(col4Track, finalCol4, 2600)
    ]);

    const board = getBoardFromColumns(finalCol1, finalCol2, finalCol3, finalCol4);
    const wins = checkWinningLines(board);

    if (wins.length > 0) {
        let totalWin = 0;
        let hasFour = false;

        wins.forEach(function(win){
            totalWin += win.payout;
            if (win.kind === "4-row") {
                hasFour = true;
            }
        });

        balance += totalWin;
        updateBalance();

        drawWinLine(wins[0]);

        if (wins.length === 1) {
            if (hasFour) {
                slotResult.textContent = "4 in a row! You won $" + totalWin;
            } else {
                slotResult.textContent = "3 in a row! You won $" + totalWin;
            }
        } else {
            slotResult.textContent = wins.length + " line wins! You won $" + totalWin;
        }

        if (hasFour) {
            flashPageBigWin();
            fourWinSound.currentTime = 0;
            fourWinSound.play();
        } else {
            flashPageSmallWin();
            threeWinSound.currentTime = 0;
            threeWinSound.play();
        }

    } else {
        slotResult.textContent = "No horizontal or diagonal 3-4 match. You lost $" + slotBet;
    }

    slotSpinning = false;
    spinButton.disabled = false;
});

/* =========================
   BLACKJACK
========================= */

const dealerCardsDiv = document.getElementById("dealerCards");
const playerCardsDiv = document.getElementById("playerCards");
const dealerScoreText = document.getElementById("dealerScore");
const playerScoreText = document.getElementById("playerScore");
const blackjackResult = document.getElementById("blackjackResult");

const blackjackMinus = document.getElementById("blackjackMinus");
const blackjackPlus = document.getElementById("blackjackPlus");
const blackjackBetText = document.getElementById("blackjackBetText");

const dealButton = document.getElementById("dealButton");
const hitButton = document.getElementById("hitButton");
const standButton = document.getElementById("standButton");

let blackjackBet = 100;
let deck = [];
let playerHand = [];
let dealerHand = [];
let blackjackPlaying = false;

function updateBlackjackBet() {
    blackjackBetText.textContent = blackjackBet;
}

blackjackPlus.addEventListener("click", function () {
    if (blackjackBet < 500) {
        blackjackBet += 10;
        updateBlackjackBet();
    }
});

blackjackMinus.addEventListener("click", function () {
    if (blackjackBet > 10) {
        blackjackBet -= 10;
        updateBlackjackBet();
    }
});

function makeDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const newDeck = [];

    for (let suit of suits) {
        for (let value of values) {
            newDeck.push({ value: value, suit: suit });
        }
    }

    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
}

function getCardPoints(hand) {
    let total = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === "A") {
            total += 11;
            aces++;
        } else if (card.value === "K" || card.value === "Q" || card.value === "J") {
            total += 10;
        } else {
            total += Number(card.value);
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function drawCard(hand) {
    hand.push(deck.pop());
}

function showHand(hand, container) {
    container.innerHTML = "";

    hand.forEach(function (card) {
        const cardDiv = document.createElement("div");
        cardDiv.className = "Card";
        cardDiv.textContent = card.value + card.suit;
        container.appendChild(cardDiv);
    });
}

function updateBlackjackUI() {
    showHand(playerHand, playerCardsDiv);
    showHand(dealerHand, dealerCardsDiv);

    playerScoreText.textContent = getCardPoints(playerHand);
    dealerScoreText.textContent = getCardPoints(dealerHand);
}

function endBlackjackRound(message, winAmount) {
    blackjackResult.textContent = message;

    if (winAmount > 0) {
        balance += winAmount;
        updateBalance();
    }

    blackjackPlaying = false;
}

dealButton.addEventListener("click", function () {
    if (blackjackPlaying) {
        return;
    }

    if (balance < blackjackBet) {
        blackjackResult.textContent = "Not enough balance";
        return;
    }

    balance -= blackjackBet;
    updateBalance();

    deck = makeDeck();
    playerHand = [];
    dealerHand = [];

    drawCard(playerHand);
    drawCard(playerHand);
    drawCard(dealerHand);
    drawCard(dealerHand);

    blackjackPlaying = true;
    blackjackResult.textContent = "Your turn";
    updateBlackjackUI();

    const playerScore = getCardPoints(playerHand);

    if (playerScore === 21) {
        endBlackjackRound("Blackjack! You won $" + (blackjackBet * 2), blackjackBet * 2);
    }
});

hitButton.addEventListener("click", function () {
    if (!blackjackPlaying) {
        return;
    }

    drawCard(playerHand);
    updateBlackjackUI();

    const playerScore = getCardPoints(playerHand);

    if (playerScore > 21) {
        endBlackjackRound("Bust! You lost $" + blackjackBet, 0);
    }
});

standButton.addEventListener("click", function () {
    if (!blackjackPlaying) {
        return;
    }

    while (getCardPoints(dealerHand) < 17) {
        drawCard(dealerHand);
    }

    updateBlackjackUI();

    const playerScore = getCardPoints(playerHand);
    const dealerScore = getCardPoints(dealerHand);

    if (dealerScore > 21) {
        endBlackjackRound("Dealer bust! You won $" + (blackjackBet * 2), blackjackBet * 2);
    } else if (playerScore > dealerScore) {
        endBlackjackRound("You won $" + (blackjackBet * 2), blackjackBet * 2);
    } else if (playerScore < dealerScore) {
        endBlackjackRound("Dealer wins. You lost $" + blackjackBet, 0);
    } else {
        endBlackjackRound("Push! Your bet was returned", blackjackBet);
    }
});

/* =========================
   ROULETTE
========================= */

const rouletteWheel = document.getElementById("rouletteWheel");
const rouletteResult = document.getElementById("rouletteResult");
const rouletteSpin = document.getElementById("rouletteSpin");

const betRed = document.getElementById("betRed");
const betBlack = document.getElementById("betBlack");
const betGreen = document.getElementById("betGreen");

const rouletteMinus = document.getElementById("rouletteMinus");
const roulettePlus = document.getElementById("roulettePlus");
const rouletteBetText = document.getElementById("rouletteBetText");

let rouletteBet = 100;
let selectedColor = "red";
let rouletteSpinning = false;

function updateRouletteBet() {
    rouletteBetText.textContent = rouletteBet;
}

roulettePlus.addEventListener("click", function () {
    if (rouletteBet < 500) {
        rouletteBet += 10;
        updateRouletteBet();
    }
});

rouletteMinus.addEventListener("click", function () {
    if (rouletteBet > 10) {
        rouletteBet -= 10;
        updateRouletteBet();
    }
});

betRed.addEventListener("click", function () {
    selectedColor = "red";
    rouletteResult.textContent = "Selected: Red";
});

betBlack.addEventListener("click", function () {
    selectedColor = "black";
    rouletteResult.textContent = "Selected: Black";
});

betGreen.addEventListener("click", function () {
    selectedColor = "green";
    rouletteResult.textContent = "Selected: Green";
});

function spinRouletteColor() {
    const randomNumber = Math.floor(Math.random() * 37);

    if (randomNumber === 0) {
        return "green";
    } else if (randomNumber % 2 === 0) {
        return "black";
    } else {
        return "red";
    }
}

rouletteSpin.addEventListener("click", function () {
    if (rouletteSpinning) {
        return;
    }

    if (balance < rouletteBet) {
        rouletteResult.textContent = "Not enough balance";
        return;
    }

    rouletteSpinning = true;
    rouletteSpin.disabled = true;
    balance -= rouletteBet;
    updateBalance();

    rouletteWheel.style.transform = "rotate(1440deg)";

    setTimeout(function () {
        const resultColor = spinRouletteColor();

        if (selectedColor === resultColor) {
            let win = 0;

            if (resultColor === "green") {
                win = rouletteBet * 14;
            } else {
                win = rouletteBet * 2;
            }

            balance += win;
            rouletteResult.textContent = "It landed on " + resultColor + "! You won $" + win;
        } else {
            rouletteResult.textContent = "It landed on " + resultColor + ". You lost $" + rouletteBet;
        }

        updateBalance();
        rouletteWheel.style.transform = "rotate(0deg)";
        rouletteSpinning = false;
        rouletteSpin.disabled = false;
    }, 2000);
});

updateBalance();
updateSlotBet();
updateBlackjackBet();
updateRouletteBet();