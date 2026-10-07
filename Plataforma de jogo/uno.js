// ==========================================
// UNO
// ==========================================

const playerHandElement =
    document.getElementById("playerHand");

const computerHandElement =
    document.getElementById("computerHand");

const currentCardElement =
    document.getElementById("currentCard");

const messageElement =
    document.getElementById("message");

const drawButton =
    document.getElementById("drawButton");

const unoButton =
    document.getElementById("unoButton");

const newGameButton =
    document.getElementById("newGameButton");

const playerScoreElement =
    document.getElementById("playerScore");

const computerScoreElement =
    document.getElementById("computerScore");


// ==========================================
// VARIÁVEIS
// ==========================================

let deck = [];

let playerHand = [];

let computerHand = [];

let currentCard = null;

let currentColor = null;

let playerTurn = true;

let gameOver = false;

let playerScore = 0;

let computerScore = 0;

let playerCalledUno = false;


// ==========================================
// CORES
// ==========================================

const colors = [
    "red",
    "blue",
    "green",
    "yellow"
];


// ==========================================
// CRIAR BARALHO
// ==========================================

function createDeck() {

    deck = [];

    // Cartas numéricas

    for (const color of colors) {

        // Um zero

        deck.push({
            color: color,
            value: "0",
            type: "number"
        });

        // 1 até 9

        for (let number = 1; number <= 9; number++) {

            deck.push({
                color: color,
                value: String(number),
                type: "number"
            });

            deck.push({
                color: color,
                value: String(number),
                type: "number"
            });

        }

        // +2

        deck.push({
            color: color,
            value: "+2",
            type: "draw2"
        });

        deck.push({
            color: color,
            value: "+2",
            type: "draw2"
        });

        // Bloqueio

        deck.push({
            color: color,
            value: "⊘",
            type: "skip"
        });

        deck.push({
            color: color,
            value: "⊘",
            type: "skip"
        });

        // Inverter

        deck.push({
            color: color,
            value: "↔",
            type: "reverse"
        });

        deck.push({
            color: color,
            value: "↔",
            type: "reverse"
        });

    }


    // Coringa

    for (let i = 0; i < 4; i++) {

        deck.push({
            color: "wild",
            value: "★",
            type: "wild"
        });

    }


    // +4

    for (let i = 0; i < 4; i++) {

        deck.push({
            color: "wild",
            value: "+4",
            type: "wild4"
        });

    }

}


// ==========================================
// EMBARALHAR
// ==========================================

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


// ==========================================
// NOVO JOGO
// ==========================================

function newGame() {

    createDeck();

    shuffle(deck);

    playerHand = [];

    computerHand = [];

    gameOver = false;

    playerTurn = true;

    playerCalledUno = false;


    // 7 cartas para cada jogador

    for (let i = 0; i < 7; i++) {

        playerHand.push(
            deck.pop()
        );

        computerHand.push(
            deck.pop()
        );

    }


    // Primeira carta

    do {

        currentCard = deck.pop();

    } while (
        currentCard.type === "wild4" ||
        currentCard.type === "wild"
    );


    currentColor =
        currentCard.color;


    messageElement.textContent =
        "Sua vez!";


    render();

}


// ==========================================
// CRIAR CARTA HTML
// ==========================================

function createCard(card) {

    const element =
        document.createElement("div");

    element.classList.add(
        "card"
    );


    if (card.color === "wild") {

        element.classList.add("wild");

    } else {

        element.classList.add(
            card.color
        );

    }


    element.textContent =
        card.value;


    return element;

}


// ==========================================
// RENDERIZAR
// ==========================================

function render() {

    playerHandElement.innerHTML = "";

    computerHandElement.innerHTML = "";

    currentCardElement.innerHTML = "";


    // Mão do jogador

    playerHand.forEach(
        (card, index) => {

            const element =
                createCard(card);


            element.addEventListener(
                "click",
                () => {

                    playCard(index);

                }
            );


            playerHandElement.appendChild(
                element
            );

        }
    );


    // Mão do computador

    computerHand.forEach(() => {

        const element =
            document.createElement("div");

        element.classList.add(
            "computer-card"
        );

        element.textContent =
            "UNO";

        computerHandElement.appendChild(
            element
        );

    });


    // Carta atual

    currentCardElement.appendChild(
        createCard(currentCard)
    );


    playerScoreElement.textContent =
        playerScore;

    computerScoreElement.textContent =
        computerScore;


    drawButton.disabled =
        !playerTurn || gameOver;

}


// ==========================================
// VERIFICAR SE PODE JOGAR
// ==========================================

function canPlay(card) {

    // Coringa sempre pode ser jogado

    if (
        card.type === "wild" ||
        card.type === "wild4"
    ) {

        return true;

    }


    // Mesma cor

    if (
        card.color === currentColor
    ) {

        return true;

    }


    // Mesmo valor

    if (
        card.value === currentCard.value
    ) {

        return true;

    }


    return false;

}


// ==========================================
// JOGAR CARTA
// ==========================================

function playCard(index) {

    if (
        !playerTurn ||
        gameOver
    ) {

        return;

    }


    const card =
        playerHand[index];


    if (!canPlay(card)) {

        messageElement.textContent =
            "❌ Você não pode jogar essa carta.";

        return;

    }


    playerHand.splice(index, 1);

    currentCard = card;


    if (
        card.type === "wild" ||
        card.type === "wild4"
    ) {

        chooseColor();

    } else {

        currentColor =
            card.color;

        applyCardEffect(card);

    }


    // Verifica UNO

    if (playerHand.length === 1) {

        if (!playerCalledUno) {

            messageElement.textContent =
                "⚠️ Você ficou com uma carta! Clique em UNO!";

        }

    }


    // Vitória

    if (playerHand.length === 0) {

        finishGame("player");

        return;

    }


    playerTurn = false;

    render();


    setTimeout(
        computerTurn,
        1000
    );

}


// ==========================================
// ESCOLHER COR
// ==========================================

function chooseColor() {

    const choice =
        prompt(
            "Escolha uma cor:\n\n" +
            "1 - Vermelho\n" +
            "2 - Azul\n" +
            "3 - Verde\n" +
            "4 - Amarelo"
        );


    const colorsMap = {

        "1": "red",

        "2": "blue",

        "3": "green",

        "4": "yellow"

    };


    currentColor =
        colorsMap[choice] || "red";


    if (
        currentCard.type === "wild4"
    ) {

        drawCardsComputer(4);

    }


    applyCardEffect(
        currentCard
    );

}


// ==========================================
// EFEITOS DAS CARTAS
// ==========================================

function applyCardEffect(card) {

    if (card.type === "draw2") {

        drawCardsComputer(2);

    }

}


// ==========================================
// COMPRAR CARTAS DO COMPUTADOR
// ==========================================

function drawCardsComputer(amount) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        if (deck.length === 0) {

            refillDeck();

        }


        if (deck.length > 0) {

            computerHand.push(
                deck.pop()
            );

        }

    }

}


// ==========================================
// COMPRAR CARTA
// ==========================================

drawButton.addEventListener(
    "click",
    () => {

        if (
            !playerTurn ||
            gameOver
        ) {

            return;

        }


        if (deck.length === 0) {

            refillDeck();

        }


        if (deck.length === 0) {

            return;

        }


        const card =
            deck.pop();


        playerHand.push(card);

        playerCalledUno = false;


        messageElement.textContent =
            "Você comprou uma carta.";


        render();

    }
);


// ==========================================
// BOTÃO UNO
// ==========================================

unoButton.addEventListener(
    "click",
    () => {

        if (
            playerHand.length === 1
        ) {

            playerCalledUno = true;

            messageElement.textContent =
                "🔥 UNO!";

        }

    }
);


// ==========================================
// TURNO DO COMPUTADOR
// ==========================================

function computerTurn() {

    if (gameOver) {
        return;
    }


    let playableIndex = -1;


    for (
        let i = 0;
        i < computerHand.length;
        i++
    ) {

        if (
            canPlay(
                computerHand[i]
            )
        ) {

            playableIndex = i;

            break;

        }

    }


    // Se não puder jogar, compra

    if (playableIndex === -1) {

        if (deck.length === 0) {

            refillDeck();

        }


        if (deck.length > 0) {

            computerHand.push(
                deck.pop()
            );

        }


        messageElement.textContent =
            "🤖 O computador comprou uma carta.";

        playerTurn = true;

        render();

        return;

    }


    // Jogar carta

    const card =
        computerHand.splice(
            playableIndex,
            1
        )[0];


    currentCard = card;


    // Escolher cor para coringa

    if (
        card.type === "wild" ||
        card.type === "wild4"
    ) {

        currentColor =
            chooseComputerColor();

    } else {

        currentColor =
            card.color;

    }


    // +2

    if (
        card.type === "draw2"
    ) {

        drawCardsPlayer(2);

    }


    // +4

    if (
        card.type === "wild4"
    ) {

        drawCardsPlayer(4);

    }


    // Vitória

    if (
        computerHand.length === 0
    ) {

        finishGame("computer");

        return;

    }


    messageElement.textContent =
        "🤖 Computador jogou uma carta.";


    playerTurn = true;

    render();

}


// ==========================================
// ESCOLHER COR DO COMPUTADOR
// ==========================================

function chooseComputerColor() {

    const count = {

        red: 0,

        blue: 0,

        green: 0,

        yellow: 0

    };


    computerHand.forEach(
        card => {

            if (
                count[card.color] !== undefined
            ) {

                count[card.color]++;

            }

        }
    );


    let bestColor = "red";

    for (const color of colors) {

        if (
            count[color] >
            count[bestColor]
        ) {

            bestColor = color;

        }

    }


    return bestColor;

}


// ==========================================
// COMPRAR PARA O JOGADOR
// ==========================================

function drawCardsPlayer(amount) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        if (deck.length === 0) {

            refillDeck();

        }


        if (deck.length > 0) {

            playerHand.push(
                deck.pop()
            );

        }

    }

}


// ==========================================
// REABASTECER BARALHO
// ==========================================

function refillDeck() {

    if (deck.length > 0) {
        return;
    }


    // Nesta versão mantemos a carta atual
    // e criamos novas cartas para continuar.

    createDeck();

    shuffle(deck);

}


// ==========================================
// FINALIZAR JOGO
// ==========================================

function finishGame(winner) {

    gameOver = true;


    if (winner === "player") {

        playerScore++;

        messageElement.textContent =
            "🎉 VOCÊ VENCEU!";

    } else {

        computerScore++;

        messageElement.textContent =
            "🤖 O COMPUTADOR VENCEU!";

    }


    render();

}


// ==========================================
// NOVO JOGO
// ==========================================

newGameButton.addEventListener(
    "click",
    newGame
);


// ==========================================
// COMEÇAR
// ==========================================

newGame();
