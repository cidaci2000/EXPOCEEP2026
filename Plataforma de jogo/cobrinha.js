// ========================================
// JOGO DA COBRINHA
// ========================================


// CANVAS

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// ELEMENTOS

const scoreElement =
    document.getElementById("score");

const highScoreElement =
    document.getElementById("highScore");

const messageElement =
    document.getElementById("message");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const gameOverScreen =
    document.getElementById("gameOver");

const finalScoreElement =
    document.getElementById("finalScore");


// ========================================
// CONFIGURAÇÕES
// ========================================

const gridSize = 20;

const tileCount =
    canvas.width / gridSize;


// ========================================
// VARIÁVEIS
// ========================================

let snake = [];

let food = {
    x: 10,
    y: 10
};

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;

let highScore =
    Number(
        localStorage.getItem(
            "snakeHighScore"
        )
    ) || 0;

let gameRunning = false;

let gameLoop = null;

let speed = 120;


// ========================================
// MOSTRAR RECORDE
// ========================================

highScoreElement.textContent =
    highScore;


// ========================================
// INICIAR JOGO
// ========================================

function startGame() {

    clearInterval(gameLoop);


    snake = [

        {
            x: 10,
            y: 10
        },

        {
            x: 9,
            y: 10
        },

        {
            x: 8,
            y: 10
        }

    ];


    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    score = 0;

    speed = 120;

    gameRunning = true;


    scoreElement.textContent =
        score;


    gameOverScreen.classList.add(
        "hidden"
    );


    messageElement.textContent =
        "Coma a comida e cresça!";


    generateFood();


    draw();


    gameLoop =
        setInterval(
            update,
            speed
        );

}


// ========================================
// ATUALIZAR JOGO
// ========================================

function update() {

    direction = nextDirection;


    const head = {
        x: snake[0].x + direction.x,

        y: snake[0].y + direction.y
    };


    // Colisão com parede

    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {

        endGame();

        return;

    }


    // Colisão com o próprio corpo

    if (
        snake.some(
            segment =>
                segment.x === head.x &&
                segment.y === head.y
        )
    ) {

        endGame();

        return;

    }


    // Adiciona nova cabeça

    snake.unshift(head);


    // Verifica comida

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        eatFood();

    } else {

        // Remove a cauda

        snake.pop();

    }


    draw();

}


// ========================================
// COMER COMIDA
// ========================================

function eatFood() {

    score++;

    scoreElement.textContent =
        score;


    // Aumenta velocidade

    if (
        score % 5 === 0 &&
        speed > 50
    ) {

        speed -= 10;

        clearInterval(gameLoop);

        gameLoop =
            setInterval(
                update,
                speed
            );

    }


    generateFood();

}


// ========================================
// GERAR COMIDA
// ========================================

function generateFood() {

    let validPosition = false;


    while (!validPosition) {

        food = {

            x:
                Math.floor(
                    Math.random() *
                    tileCount
                ),

            y:
                Math.floor(
                    Math.random() *
                    tileCount
                )

        };


        validPosition =
            !snake.some(
                segment =>
                    segment.x === food.x &&
                    segment.y === food.y
            );

    }

}


// ========================================
// DESENHAR
// ========================================

function draw() {

    // Fundo

    ctx.fillStyle =
        "#071b0d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawGrid();

    drawFood();

    drawSnake();

}


// ========================================
// DESENHAR GRADE
// ========================================

function drawGrid() {

    ctx.strokeStyle =
        "rgba(255,255,255,.04)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x <= canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y <= canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}


// ========================================
// DESENHAR COBRA
// ========================================

function drawSnake() {

    snake.forEach(
        (segment, index) => {

            if (index === 0) {

                ctx.fillStyle =
                    "#70ff75";

            } else {

                ctx.fillStyle =
                    "#20c95c";

            }


            ctx.beginPath();

            ctx.roundRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2,
                5
            );

            ctx.fill();


            // Olhos da cabeça

            if (index === 0) {

                drawEyes(segment);

            }

        }
    );

}


// ========================================
// OLHOS
// ========================================

function drawEyes(head) {

    ctx.fillStyle = "#111";


    let eye1;
    let eye2;


    if (direction.x !== 0) {

        eye1 = {
            x:
                head.x * gridSize +
                (direction.x > 0 ? 14 : 5),

            y:
                head.y * gridSize + 6
        };


        eye2 = {
            x:
                head.x * gridSize +
                (direction.x > 0 ? 14 : 5),

            y:
                head.y * gridSize + 14
        };

    } else {

        eye1 = {
            x:
                head.x * gridSize + 6,

            y:
                head.y * gridSize +
                (direction.y > 0 ? 14 : 5)
        };


        eye2 = {
            x:
                head.x * gridSize + 14,

            y:
                head.y * gridSize +
                (direction.y > 0 ? 14 : 5)
        };

    }


    ctx.beginPath();

    ctx.arc(
        eye1.x,
        eye1.y,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2.x,
        eye2.y,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// ========================================
// DESENHAR COMIDA
// ========================================

function drawFood() {

    const centerX =
        food.x * gridSize +
        gridSize / 2;

    const centerY =
        food.y * gridSize +
        gridSize / 2;


    ctx.fillStyle =
        "#ff3b30";


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Brilho

    ctx.fillStyle =
        "#ffaaa5";


    ctx.beginPath();

    ctx.arc(
        centerX - 3,
        centerY - 3,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// ========================================
// FINALIZAR JOGO
// ========================================

function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);


    finalScoreElement.textContent =
        score;


    gameOverScreen.classList.remove(
        "hidden"
    );


    messageElement.textContent =
        "💥 A cobra bateu!";


    // Atualiza recorde

    if (score > highScore) {

        highScore = score;


        localStorage.setItem(
            "snakeHighScore",
            highScore
        );


        highScoreElement.textContent =
            highScore;

    }

}


// ========================================
// CONTROLES DO TECLADO
// ========================================

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        if (
            key === "ArrowUp" &&
            direction.y !== 1
        ) {

            nextDirection = {
                x: 0,
                y: -1
            };

        }


        if (
            key === "ArrowDown" &&
            direction.y !== -1
        ) {

            nextDirection = {
                x: 0,
                y: 1
            };

        }


        if (
            key === "ArrowLeft" &&
            direction.x !== 1
        ) {

            nextDirection = {
                x: -1,
                y: 0
            };

        }


        if (
            key === "ArrowRight" &&
            direction.x !== -1
        ) {

            nextDirection = {
                x: 1,
                y: 0
            };

        }


        // Espaço começa o jogo

        if (
            key === " " &&
            !gameRunning
        ) {

            startGame();

        }

    }
);


// ========================================
// CONTROLES DO CELULAR
// ========================================

const controlButtons =
    document.querySelectorAll(
        "[data-direction]"
    );


controlButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const dir =
                    button.dataset.direction;


                if (dir === "up" &&
                    direction.y !== 1) {

                    nextDirection = {
                        x: 0,
                        y: -1
                    };

                }


                if (dir === "down" &&
                    direction.y !== -1) {

                    nextDirection = {
                        x: 0,
                        y: 1
                    };

                }


                if (dir === "left" &&
                    direction.x !== 1) {

                    nextDirection = {
                        x: -1,
                        y: 0
                    };

                }


                if (dir === "right" &&
                    direction.x !== -1) {

                    nextDirection = {
                        x: 1,
                        y: 0
                    };

                }

            }
        );

    }
);


// ========================================
// BOTÕES
// ========================================

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


// ========================================
// DESENHO INICIAL
// ========================================

startGame();
