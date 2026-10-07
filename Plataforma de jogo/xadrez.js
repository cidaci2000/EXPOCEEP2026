// ========================================
// XADREZ
// ========================================

const boardElement =
    document.getElementById("board");

const turnElement =
    document.getElementById("turn");

const statusElement =
    document.getElementById("status");

const restartButton =
    document.getElementById("restart");


// ========================================
// SÍMBOLOS
// ========================================

const pieces = {

    white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙"
    },

    black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟"
    }

};


// ========================================
// TABULEIRO INICIAL
// ========================================

let board = [

    [
        { color: "black", type: "rook" },
        { color: "black", type: "knight" },
        { color: "black", type: "bishop" },
        { color: "black", type: "queen" },
        { color: "black", type: "king" },
        { color: "black", type: "bishop" },
        { color: "black", type: "knight" },
        { color: "black", type: "rook" }
    ],

    [
        { color: "black", type: "pawn" },
        { color: "black", type: "pawn" },
        { color: "black", type: "pawn" },
        { color: "black", type: "pawn" },
        { color: "black", type: "pawn" },
        { color: "black", type: "pawn" },
        { color: "black", type: "pawn" },
        { color: "black", type: "pawn" }
    ],

    [null,null,null,null,null,null,null,null],

    [null,null,null,null,null,null,null,null],

    [null,null,null,null,null,null,null,null],

    [null,null,null,null,null,null,null,null],

    [
        { color: "white", type: "pawn" },
        { color: "white", type: "pawn" },
        { color: "white", type: "pawn" },
        { color: "white", type: "pawn" },
        { color: "white", type: "pawn" },
        { color: "white", type: "pawn" },
        { color: "white", type: "pawn" },
        { color: "white", type: "pawn" }
    ],

    [
        { color: "white", type: "rook" },
        { color: "white", type: "knight" },
        { color: "white", type: "bishop" },
        { color: "white", type: "queen" },
        { color: "white", type: "king" },
        { color: "white", type: "bishop" },
        { color: "white", type: "knight" },
        { color: "white", type: "rook" }
    ]

];


// ========================================
// VARIÁVEIS
// ========================================

let currentTurn = "white";

let selected = null;

let possibleMoves = [];

let gameOver = false;


// ========================================
// DESENHAR TABULEIRO
// ========================================

function renderBoard() {

    boardElement.innerHTML = "";


    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square =
                document.createElement("div");


            square.classList.add(
                "square"
            );


            // Cor da casa

            if ((row + col) % 2 === 0) {

                square.classList.add(
                    "light"
                );

            } else {

                square.classList.add(
                    "dark"
                );

            }


            // Selecionada

            if (
                selected &&
                selected.row === row &&
                selected.col === col
            ) {

                square.classList.add(
                    "selected"
                );

            }


            // Movimento possível

            const isPossible =
                possibleMoves.some(
                    move =>
                        move.row === row &&
                        move.col === col
                );


            if (isPossible) {

                square.classList.add(
                    "possible"
                );

            }


            // Peça

            const piece =
                board[row][col];


            if (piece) {

                square.textContent =
                    pieces[
                        piece.color
                    ][
                        piece.type
                    ];

            }


            // Clique

            square.addEventListener(
                "click",
                () => handleSquareClick(
                    row,
                    col
                )
            );


            boardElement.appendChild(
                square
            );

        }

    }


    updateInfo();

}


// ========================================
// CLIQUE NA CASA
// ========================================

function handleSquareClick(row, col) {

    if (gameOver) {
        return;
    }


    const piece =
        board[row][col];


    // Se já existe uma seleção

    if (selected) {

        const validMove =
            possibleMoves.some(
                move =>
                    move.row === row &&
                    move.col === col
            );


        if (validMove) {

            movePiece(
                selected.row,
                selected.col,
                row,
                col
            );

            return;

        }


        // Clicou em outra peça própria

        if (
            piece &&
            piece.color === currentTurn
        ) {

            selectPiece(row, col);

            return;

        }


        // Cancela seleção

        selected = null;

        possibleMoves = [];

        statusElement.textContent =
            "Seleção cancelada.";

        renderBoard();

        return;

    }


    // Selecionar peça

    if (
        piece &&
        piece.color === currentTurn
    ) {

        selectPiece(row, col);

    }

}


// ========================================
// SELECIONAR PEÇA
// ========================================

function selectPiece(row, col) {

    selected = {
        row,
        col
    };


    possibleMoves =
        getPossibleMoves(
            row,
            col
        );


    statusElement.textContent =
        "Escolha uma casa.";


    renderBoard();

}


// ========================================
// MOVER PEÇA
// ========================================

function movePiece(
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    const piece =
        board[fromRow][fromCol];

    const captured =
        board[toRow][toCol];


    // Captura do rei

    if (
        captured &&
        captured.type === "king"
    ) {

        board[toRow][toCol] =
            piece;

        board[fromRow][fromCol] =
            null;

        gameOver = true;

        statusElement.textContent =
            currentTurn === "white"
                ? "🏆 Brancas venceram!"
                : "🏆 Pretas venceram!";

        selected = null;

        possibleMoves = [];

        renderBoard();

        return;

    }


    board[toRow][toCol] =
        piece;

    board[fromRow][fromCol] =
        null;


    // Promoção simples do peão

    if (
        piece.type === "pawn" &&
        (
            toRow === 0 ||
            toRow === 7
        )
    ) {

        piece.type = "queen";

    }


    // Trocar turno

    currentTurn =
        currentTurn === "white"
            ? "black"
            : "white";


    selected = null;

    possibleMoves = [];


    statusElement.textContent =
        "Escolha uma peça.";


    renderBoard();

}


// ========================================
// MOVIMENTOS POSSÍVEIS
// ========================================

function getPossibleMoves(row, col) {

    const piece =
        board[row][col];


    if (!piece) {
        return [];
    }


    switch (piece.type) {

        case "pawn":
            return pawnMoves(
                row,
                col,
                piece
            );

        case "rook":
            return rookMoves(
                row,
                col,
                piece
            );

        case "bishop":
            return bishopMoves(
                row,
                col,
                piece
            );

        case "queen":
            return [
                ...rookMoves(
                    row,
                    col,
                    piece
                ),
                ...bishopMoves(
                    row,
                    col,
                    piece
                )
            ];

        case "king":
            return kingMoves(
                row,
                col,
                piece
            );

        case "knight":
            return knightMoves(
                row,
                col,
                piece
            );

        default:
            return [];

    }

}


// ========================================
// PEÃO
// ========================================

function pawnMoves(row, col, piece) {

    const moves = [];

    const direction =
        piece.color === "white"
            ? -1
            : 1;


    // Andar uma casa

    const nextRow =
        row + direction;


    if (
        insideBoard(
            nextRow,
            col
        ) &&
        !board[nextRow][col]
    ) {

        moves.push({
            row: nextRow,
            col: col
        });


        // Primeira jogada: duas casas

        const startRow =
            piece.color === "white"
                ? 6
                : 1;


        const twoRows =
            row + direction * 2;


        if (
            row === startRow &&
            !board[twoRows][col]
        ) {

            moves.push({
                row: twoRows,
                col: col
            });

        }

    }


    // Capturas diagonais

    for (
        const dc of [-1, 1]
    ) {

        const newRow =
            row + direction;

        const newCol =
            col + dc;


        if (
            insideBoard(
                newRow,
                newCol
            )
        ) {

            const target =
                board[newRow][newCol];


            if (
                target &&
                target.color !== piece.color
            ) {

                moves.push({
                    row: newRow,
                    col: newCol
                });

            }

        }

    }


    return moves;

}


// ========================================
// TORRE
// ========================================

function rookMoves(row, col, piece) {

    return slidingMoves(
        row,
        col,
        piece,
        [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1]
        ]
    );

}


// ========================================
// BISPO
// ========================================

function bishopMoves(row, col, piece) {

    return slidingMoves(
        row,
        col,
        piece,
        [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ]
    );

}


// ========================================
// MOVIMENTO DESLIZANTE
// ========================================

function slidingMoves(
    row,
    col,
    piece,
    directions
) {

    const moves = [];


    for (const [dr, dc] of directions) {

        let newRow =
            row + dr;

        let newCol =
            col + dc;


        while (
            insideBoard(
                newRow,
                newCol
            )
        ) {

            const target =
                board[newRow][newCol];


            if (!target) {

                moves.push({
                    row: newRow,
                    col: newCol
                });

            } else {

                if (
                    target.color !==
                    piece.color
                ) {

                    moves.push({
                        row: newRow,
                        col: newCol
                    });

                }

                break;

            }


            newRow += dr;

            newCol += dc;

        }

    }


    return moves;

}


// ========================================
// CAVALO
// ========================================

function knightMoves(row, col, piece) {

    const moves = [];


    const directions = [

        [-2, -1],
        [-2, 1],

        [-1, -2],
        [-1, 2],

        [1, -2],
        [1, 2],

        [2, -1],
        [2, 1]

    ];


    for (
        const [dr, dc]
        of directions
    ) {

        const newRow =
            row + dr;

        const newCol =
            col + dc;


        if (
            !insideBoard(
                newRow,
                newCol
            )
        ) {

            continue;

        }


        const target =
            board[newRow][newCol];


        if (
            !target ||
            target.color !== piece.color
        ) {

            moves.push({
                row: newRow,
                col: newCol
            });

        }

    }


    return moves;

}


// ========================================
// REI
// ========================================

function kingMoves(row, col, piece) {

    const moves = [];


    for (
        let dr = -1;
        dr <= 1;
        dr++
    ) {

        for (
            let dc = -1;
            dc <= 1;
            dc++
        ) {

            if (
                dr === 0 &&
                dc === 0
            ) {

                continue;

            }


            const newRow =
                row + dr;

            const newCol =
                col + dc;


            if (
                !insideBoard(
                    newRow,
                    newCol
                )
            ) {

                continue;

            }


            const target =
                board[newRow][newCol];


            if (
                !target ||
                target.color !== piece.color
            ) {

                moves.push({
                    row: newRow,
                    col: newCol
                });

            }

        }

    }


    return moves;

}


// ========================================
// VERIFICAR TABULEIRO
// ========================================

function insideBoard(row, col) {

    return (
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8
    );

}


// ========================================
// INFORMAÇÕES
// ========================================

function updateInfo() {

    turnElement.textContent =
        currentTurn === "white"
            ? "Vez: Brancas"
            : "Vez: Pretas";

}


// ========================================
// NOVO JOGO
// ========================================

function restartGame() {

    board = [

        [
            { color: "black", type: "rook" },
            { color: "black", type: "knight" },
            { color: "black", type: "bishop" },
            { color: "black", type: "queen" },
            { color: "black", type: "king" },
            { color: "black", type: "bishop" },
            { color: "black", type: "knight" },
            { color: "black", type: "rook" }
        ],

        [
            { color: "black", type: "pawn" },
            { color: "black", type: "pawn" },
            { color: "black", type: "pawn" },
            { color: "black", type: "pawn" },
            { color: "black", type: "pawn" },
            { color: "black", type: "pawn" },
            { color: "black", type: "pawn" },
            { color: "black", type: "pawn" }
        ],

        [null,null,null,null,null,null,null,null],

        [null,null,null,null,null,null,null,null],

        [null,null,null,null,null,null,null,null],

        [null,null,null,null,null,null,null,null],

        [
            { color: "white", type: "pawn" },
            { color: "white", type: "pawn" },
            { color: "white", type: "pawn" },
            { color: "white", type: "pawn" },
            { color: "white", type: "pawn" },
            { color: "white", type: "pawn" },
            { color: "white", type: "pawn" },
            { color: "white", type: "pawn" }
        ],

        [
            { color: "white", type: "rook" },
            { color: "white", type: "knight" },
            { color: "white", type: "bishop" },
            { color: "white", type: "queen" },
            { color: "white", type: "king" },
            { color: "white", type: "bishop" },
            { color: "white", type: "knight" },
            { color: "white", type: "rook" }
        ]

    ];


    currentTurn = "white";

    selected = null;

    possibleMoves = [];

    gameOver = false;

    statusElement.textContent =
        "Escolha uma peça.";

    renderBoard();

}


restartButton.addEventListener(
    "click",
    restartGame
);


// ========================================
// INICIAR
// ========================================

renderBoard();
