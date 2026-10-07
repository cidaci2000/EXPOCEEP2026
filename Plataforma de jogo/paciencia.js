// ==========================================
// PACIÊNCIA
// ==========================================

const tableauElement =
    document.getElementById("tableau");

const stockElement =
    document.getElementById("stock");

const wasteElement =
    document.getElementById("waste");

const foundationElements =
    document.querySelectorAll(".foundation");

const messageElement =
    document.getElementById("message");

const movesElement =
    document.getElementById("moves");

const newGameButton =
    document.getElementById("newGame");


// ==========================================
// CONFIGURAÇÃO
// ==========================================

const suits = [
    "♥",
    "♦",
    "♣",
    "♠"
];

const values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
];


// ==========================================
// VARIÁVEIS
// ==========================================

let deck = [];

let stock = [];

let waste = [];

let foundations = {
    "♥": [],
    "♦": [],
    "♣": [],
    "♠": []
};

let tableau = [
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

let selectedCard = null;

let moves = 0;


// ==========================================
// CRIAR BARALHO
// ==========================================

function createDeck() {

    deck = [];

    for (const suit of suits) {

        for (
            let i = 0;
            i < values.length;
            i++
        ) {

            deck.push({
                suit: suit,

                value: values[i],

                number: i + 1,

                faceUp: false,

                id:
                    suit +
                    values[i] +
                    Math.random()
            });

        }

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

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] =
        [
            array[j],
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


    stock = [];

    waste = [];


    foundations = {
        "♥": [],
        "♦": [],
        "♣": [],
        "♠": []
    };


    tableau = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];


    selectedCard = null;

    moves = 0;


    // Distribui as cartas

    for (
        let column = 0;
        column < 7;
        column++
    ) {

        for (
            let row = 0;
            row <= column;
            row++
        ) {

            const card =
                deck.pop();

            card.faceUp =
                row === column;

            tableau[column].push(
                card
            );

        }

    }


    // Restante vai para o estoque

    stock = [...deck];

    deck = [];


    messageElement.textContent =
        "Organize todas as cartas!";


    render();

}


// ==========================================
// CRIAR CARTA HTML
// ==========================================

function createCardElement(card) {

    const element =
        document.createElement("div");

    element.classList.add("card");


    if (!card.faceUp) {

        element.classList.add(
            "face-down"
        );

        return element;

    }


    const isRed =
        card.suit === "♥" ||
        card.suit === "♦";


    element.classList.add(
        isRed
            ? "red"
            : "black"
    );


    element.innerHTML = `

        <div class="top-left">
            ${card.value}${card.suit}
        </div>

        <div class="center">
            ${card.suit}
        </div>

        <div class="bottom-right">
            ${card.value}${card.suit}
        </div>

    `;


    if (
        selectedCard &&
        selectedCard.card.id === card.id
    ) {

        element.classList.add(
            "selected"
        );

    }


    return element;

}


// ==========================================
// RENDERIZAR
// ==========================================

function render() {

    renderTableau();

    renderStock();

    renderWaste();

    renderFoundations();


    movesElement.textContent =
        `Movimentos: ${moves}`;

}


// ==========================================
// TABULEIRO
// ==========================================

function renderTableau() {

    tableauElement.innerHTML = "";


    tableau.forEach(
        (column, columnIndex) => {

            const columnElement =
                document.createElement("div");

            columnElement.classList.add(
                "column"
            );


            column.forEach(
                (card, cardIndex) => {

                    const element =
                        createCardElement(card);


                    element.style.top =
                        `${cardIndex * 30}px`;


                    element.addEventListener(
                        "click",
                        () => {

                            handleCardClick(
                                card,
                                columnIndex,
                                cardIndex
                            );

                        }
                    );


                    columnElement.appendChild(
                        element
                    );

                }
            );


            tableauElement.appendChild(
                columnElement
            );

        }
    );

}


// ==========================================
// ESTOQUE
// ==========================================

function renderStock() {

    stockElement.innerHTML =
        stock.length > 0
            ? "🂠"
            : "";

}


// ==========================================
// DESCARTE
// ==========================================

function renderWaste() {

    wasteElement.innerHTML = "";


    if (waste.length === 0) {
        return;
    }


    const card =
        waste[waste.length - 1];


    const element =
        createCardElement(card);


    element.style.position =
        "absolute";


    element.addEventListener(
        "click",
        () => {

            selectWasteCard(card);

        }
    );


    wasteElement.appendChild(
        element
    );

}


// ==========================================
// FUNDAÇÕES
// ==========================================

function renderFoundations() {

    foundationElements.forEach(
        foundation => {

            const suit =
                foundation.dataset.suit;


            foundation.innerHTML = "";


            const cards =
                foundations[suit];


            if (cards.length === 0) {

                foundation.textContent =
                    suit;

                return;

            }


            const card =
                cards[cards.length - 1];


            const element =
                createCardElement(card);


            element.style.position =
                "absolute";


            foundation.appendChild(
                element
            );

        }
    );

}


// ==========================================
// CLICAR NO ESTOQUE
// ==========================================

stockElement.addEventListener(
    "click",
    () => {

        if (stock.length > 0) {

            const card =
                stock.pop();

            card.faceUp = true;

            waste.push(card);

            moves++;

            messageElement.textContent =
                "Carta retirada do estoque.";

            render();

        } else {

            // Recoloca o descarte no estoque

            if (waste.length > 0) {

                stock =
                    waste.reverse();

                waste = [];


                stock.forEach(
                    card => {

                        card.faceUp =
                            false;

                    }
                );


                moves++;

                messageElement.textContent =
                    "Estoque restaurado.";

                render();

            }

        }

    }
);


// ==========================================
// CARTA DO DESCARTE
// ==========================================

function selectWasteCard(card) {

    if (selectedCard) {

        selectedCard = null;

        render();

    }


    selectedCard = {
        card: card,

        source: "waste"
    };


    messageElement.textContent =
        "Escolha uma coluna para colocar a carta.";

    render();

}


// ==========================================
// CLICAR EM CARTA
// ==========================================

function handleCardClick(
    card,
    columnIndex,
    cardIndex
) {

    // Carta virada

    if (!card.faceUp) {

        // Só pode virar a última

        if (
            cardIndex ===
            tableau[columnIndex].length - 1
        ) {

            card.faceUp = true;

            moves++;

            messageElement.textContent =
                "Carta revelada.";

            render();

        }

        return;

    }


    // Se já existe uma carta selecionada

    if (selectedCard) {

        moveSelectedCard(
            columnIndex,
            cardIndex
        );

        return;

    }


    // Selecionar carta

    selectedCard = {

        card: card,

        source: "tableau",

        column: columnIndex,

        index: cardIndex

    };


    messageElement.textContent =
        "Escolha onde colocar a carta.";

    render();

}


// ==========================================
// MOVER CARTA
// ==========================================

function moveSelectedCard(
    targetColumn,
    targetIndex
) {

    const movingCard =
        selectedCard.card;


    const targetColumnCards =
        tableau[targetColumn];


    // Movendo para coluna vazia

    if (
        targetColumnCards.length === 0
    ) {

        if (
            movingCard.value !== "K"
        ) {

            messageElement.textContent =
                "Somente o Rei pode ocupar uma coluna vazia.";

            selectedCard = null;

            render();

            return;

        }

    } else {

        const targetCard =
            targetColumnCards[
                targetColumnCards.length - 1
            ];


        if (
            !canPlaceOn(
                movingCard,
                targetCard
            )
        ) {

            messageElement.textContent =
                "Movimento inválido.";

            selectedCard = null;

            render();

            return;

        }

    }


    // Retirar da origem

    if (
        selectedCard.source ===
        "tableau"
    ) {

        const sourceColumn =
            tableau[
                selectedCard.column
            ];


        const movingCards =
            sourceColumn.splice(
                selectedCard.index
            );


        tableau[targetColumn].push(
            ...movingCards
        );


        // Revelar carta de baixo

        if (
            sourceColumn.length > 0
        ) {

            const last =
                sourceColumn[
                    sourceColumn.length - 1
                ];


            last.faceUp = true;

        }

    }


    // Retirar do descarte

    else if (
        selectedCard.source ===
        "waste"
    ) {

        waste.pop();

        tableau[targetColumn].push(
            movingCard
        );

    }


    moves++;

    selectedCard = null;


    messageElement.textContent =
        "Carta movida.";


    render();

    checkWin();

}


// ==========================================
// VERIFICAR SE PODE COLOCAR
// ==========================================

function canPlaceOn(
    movingCard,
    targetCard
) {

    // Alternar vermelho/preto

    const movingRed =
        isRed(movingCard);

    const targetRed =
        isRed(targetCard);


    if (
        movingRed === targetRed
    ) {

        return false;

    }


    // Deve ser um número menor

    return (
        movingCard.number ===
        targetCard.number - 1
    );

}


// ==========================================
// COR DA CARTA
// ==========================================

function isRed(card) {

    return (
        card.suit === "♥" ||
        card.suit === "♦"
    );

}


// ==========================================
// FUNDAÇÃO
// ==========================================

foundationElements.forEach(
    foundation => {

        foundation.addEventListener(
            "click",
            () => {

                const suit =
                    foundation.dataset.suit;


                moveToFoundation(suit);

            }
        );

    }
);


// ==========================================
// MOVER PARA FUNDAÇÃO
// ==========================================

function moveToFoundation(suit) {

    if (!selectedCard) {
        return;
    }


    const card =
        selectedCard.card;


    if (card.suit !== suit) {

        messageElement.textContent =
            "Essa carta pertence a outro naipe.";

        selectedCard = null;

        render();

        return;

    }


    const foundation =
        foundations[suit];


    const expectedNumber =
        foundation.length + 1;


    if (
        card.number !==
        expectedNumber
    ) {

        messageElement.textContent =
            "A fundação deve começar com Ás e seguir em ordem.";

        selectedCard = null;

        render();

        return;

    }


    // Retirar origem

    if (
        selectedCard.source ===
        "tableau"
    ) {

        const column =
            tableau[
                selectedCard.column
            ];


        column.splice(
            selectedCard.index
        );


        if (column.length > 0) {

            column[
                column.length - 1
            ].faceUp = true;

        }

    }


    else if (
        selectedCard.source ===
        "waste"
    ) {

        waste.pop();

    }


    foundation.push(card);


    moves++;

    selectedCard = null;


    messageElement.textContent =
        "Carta colocada na fundação.";


    render();

    checkWin();

}


// ==========================================
// VERIFICAR VITÓRIA
// ==========================================

function checkWin() {

    let total = 0;


    for (const suit of suits) {

        total +=
            foundations[suit].length;

    }


    if (total === 52) {

        messageElement.textContent =
            "🏆 Parabéns! Você venceu a Paciência!";

    }

}


// ==========================================
// NOVO JOGO
// ==========================================

newGameButton.addEventListener(
    "click",
    newGame
);


// ==========================================
// INICIAR
// ==========================================

newGame();
