// ========================================
// JOGO DA MEMÓRIA
// ========================================


// ELEMENTOS

const board =
    document.getElementById("board");

const timeElement =
    document.getElementById("time");

const movesElement =
    document.getElementById("moves");

const scoreElement =
    document.getElementById("score");

const messageElement =
    document.getElementById("message");

const restartButton =
    document.getElementById("restartButton");


// ========================================
// CONFIGURAÇÃO
// ========================================

// 8 pares = 16 cartas

const symbols = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍍",
    "🥝",
    "🍒"
];


// ========================================
// VARIÁVEIS
// ========================================

let cards = [];

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;

let moves = 0;

let score = 0;

let seconds = 0;

let timer = null;

let gameStarted = false;


// ========================================
// INICIAR JOGO
// ========================================

function startGame() {

    // Limpa o tabuleiro

    board.innerHTML = "";


    // Reseta valores

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    matchedPairs = 0;

    moves = 0;

    score = 0;

    seconds = 0;

    gameStarted = false;


    clearInterval(timer);


    // Atualiza tela

    timeElement.textContent =
        "00:00";

    movesElement.textContent =
        "0";

    scoreElement.textContent =
        "0";

    messageElement.textContent =
        "Encontre todos os pares!";


    // Duplica símbolos

    cards = [
        ...symbols,
        ...symbols
    ];


    // Embaralha

    shuffle(cards);


    // Cria cartas

    cards.forEach(
        (symbol, index) => {

            createCard(
                symbol,
                index
            );

        }
    );

}


// ========================================
// EMBARALHAR
// ========================================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const random =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[random]
        ] =
        [
            array[random],
            array[i]
        ];

    }

}


// ========================================
// CRIAR CARTA
// ========================================

function createCard(symbol, index) {

    const card =
        document.createElement("div");

    card.classList.add("card");


    const inner =
        document.createElement("div");

    inner.classList.add(
        "card-inner"
    );


    // Verso

    const back =
        document.createElement("div");

    back.classList.add(
        "card-back"
    );

    back.textContent = "❓";


    // Frente

    const front =
        document.createElement("div");

    front.classList.add(
        "card-front"
    );

    front.textContent =
        symbol;


    inner.appendChild(back);

    inner.appendChild(front);

    card.appendChild(inner);


    card.dataset.symbol =
        symbol;

    card.dataset.index =
        index;


    card.addEventListener(
        "click",
        () => flipCard(card)
    );


    board.appendChild(card);

}


// ========================================
// VIRAR CARTA
// ========================================

function flipCard(card) {

    // Impede clicar em cartas inválidas

    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched") ||
        card.classList.contains("flipped")
    ) {

        return;

    }


    // Começa cronômetro no primeiro clique

    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }


    card.classList.add("flipped");


    // Primeira carta

    if (!firstCard) {

        firstCard = card;

        return;

    }


    // Segunda carta

    secondCard = card;


    moves++;

    movesElement.textContent =
        moves;


    checkMatch();

}


// ========================================
// VERIFICAR PAR
// ========================================

function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    if (isMatch) {

        matched();

    } else {

        unflipCards();

    }

}


// ========================================
// ENCONTROU PAR
// ========================================

function matched() {

    firstCard.classList.add(
        "matched"
    );

    secondCard.classList.add(
        "matched"
    );


    matchedPairs++;

    score += 100;


    scoreElement.textContent =
        score;


    messageElement.textContent =
        "🎉 Par encontrado!";


    resetTurn();


    // Verifica vitória

    if (
        matchedPairs ===
        symbols.length
    ) {

        winGame();

    }

}


// ========================================
// CARTAS DIFERENTES
// ========================================

function unflipCards() {

    lockBoard = true;


    messageElement.textContent =
        "❌ Não são iguais!";


    setTimeout(() => {

        firstCard.classList.remove(
            "flipped"
        );

        secondCard.classList.remove(
            "flipped"
        );


        resetTurn();

    }, 900);

}


// ========================================
// RESETAR TURNO
// ========================================

function resetTurn() {

    [
        firstCard,
        secondCard
    ] = [null, null];

    lockBoard = false;

}


// ========================================
// CRONÔMETRO
// ========================================

function startTimer() {

    timer =
        setInterval(() => {

            seconds++;

            const minutes =
                Math.floor(
                    seconds / 60
                );

            const remainingSeconds =
                seconds % 60;


            const formattedMinutes =
                String(minutes)
                .padStart(2, "0");


            const formattedSeconds =
                String(remainingSeconds)
                .padStart(2, "0");


            timeElement.textContent =
                `${formattedMinutes}:${formattedSeconds}`;

        }, 1000);

}


// ========================================
// VITÓRIA
// ========================================

function winGame() {

    clearInterval(timer);

    gameStarted = false;

    lockBoard = true;


    // Bônus por rapidez

    let bonus = 0;


    if (seconds < 30) {

        bonus = 500;

    } else if (seconds < 60) {

        bonus = 300;

    } else {

        bonus = 100;

    }


    score += bonus;


    scoreElement.textContent =
        score;


    messageElement.textContent =
        `🏆 Você venceu! +${bonus} pontos de bônus!`;

}


// ========================================
// BOTÃO NOVO JOGO
// ========================================

restartButton.addEventListener(
    "click",
    startGame
);


// ========================================
// INICIAR
// ========================================

startGame();
