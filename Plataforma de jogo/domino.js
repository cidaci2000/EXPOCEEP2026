const mesa = document.getElementById("mesa");
const playerHand = document.getElementById("playerHand");
const computerHand = document.getElementById("computerHand");
const mensagem = document.getElementById("mensagem");

const passButton = document.getElementById("passButton");
const newGameButton = document.getElementById("newGameButton");

const scorePlayer = document.getElementById("scorePlayer");
const scoreComputer = document.getElementById("scoreComputer");

let pecas = [];
let jogador = [];
let computador = [];
let mesaPecas = [];

let vez = "jogador";

let pontosJogador = 0;
let pontosComputador = 0;


// ===============================
// CRIAR PEÇAS
// ===============================

function criarPecas() {

    pecas = [];

    for (let i = 0; i <= 6; i++) {

        for (let j = i; j <= 6; j++) {

            pecas.push({
                a: i,
                b: j
            });

        }

    }
}


// ===============================
// EMBARALHAR
// ===============================

function embaralhar(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

}


// ===============================
// NOVO JOGO
// ===============================

function novoJogo() {

    criarPecas();

    embaralhar(pecas);

    jogador = pecas.splice(0, 7);
    computador = pecas.splice(0, 7);

    mesaPecas = [];

    vez = "jogador";

    mensagem.textContent = "Sua vez!";

    renderizar();

}


// ===============================
// DESENHAR DOMINÓ
// ===============================

function criarElementoPeca(peca, escondida = false) {

    const elemento = document.createElement("div");

    elemento.classList.add("peca");

    if (escondida) {
        elemento.classList.add("peca-computador");
    }

    const metade1 = document.createElement("div");
    const metade2 = document.createElement("div");

    metade1.classList.add("metade");
    metade2.classList.add("metade");

    metade1.textContent = pecasimbolo(peca.a);
    metade2.textContent = pecasimbolo(peca.b);

    elemento.appendChild(metade1);
    elemento.appendChild(metade2);

    return elemento;
}


// ===============================
// SÍMBOLOS
// ===============================

function pecasimbolo(numero) {

    const simbolos = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
    ];

    return simbolos[numero];
}


// ===============================
// RENDERIZAR
// ===============================

function renderizar() {

    playerHand.innerHTML = "";
    computerHand.innerHTML = "";

    // Mão do jogador

    jogador.forEach((peca, index) => {

        const elemento = criarElementoPeca(peca);

        elemento.addEventListener("click", () => {

            jogarPeca(index);

        });

        playerHand.appendChild(elemento);

    });


    // Mão do computador

    computador.forEach(peca => {

        const elemento = criarElementoPeca(peca, true);

        computerHand.appendChild(elemento);

    });


    // Mesa

    const mensagemAtual = mensagem.textContent;

    mesa.innerHTML = "";

    if (mesaPecas.length === 0) {

        const texto = document.createElement("p");

        texto.textContent = "Mesa vazia";

        mesa.appendChild(texto);

    } else {

        mesaPecas.forEach(peca => {

            mesa.appendChild(
                criarElementoPeca(peca)
            );

        });

    }

    mensagem.textContent = mensagemAtual;

    scorePlayer.textContent = pontosJogador;
    scoreComputer.textContent = pontosComputador;
}


// ===============================
// VERIFICAR SE PODE JOGAR
// ===============================

function podeJogar(peca) {

    if (mesaPecas.length === 0) {
        return true;
    }

    const primeira = mesaPecas[0];
    const ultima = mesaPecas[mesaPecas.length - 1];

    const esquerda = primeira.a;
    const direita = ultima.b;

    return (
        peca.a === esquerda ||
        peca.b === esquerda ||
        peca.a === direita ||
        peca.b === direita
    );
}


// ===============================
// JOGAR PEÇA
// ===============================

function jogarPeca(index) {

    if (vez !== "jogador") {
        return;
    }

    const peca = jogador[index];

    if (!podeJogar(peca)) {

        mensagem.textContent =
            "Essa peça não pode ser jogada!";

        return;
    }

    jogador.splice(index, 1);

    adicionarNaMesa(peca);

    renderizar();

    if (jogador.length === 0) {

        finalizarJogo("jogador");

        return;
    }

    vez = "computador";

    mensagem.textContent =
        "Vez do computador...";

    setTimeout(jogadaComputador, 800);
}


// ===============================
// ADICIONAR NA MESA
// ===============================

function adicionarNaMesa(peca) {

    if (mesaPecas.length === 0) {

        mesaPecas.push(peca);

        return;
    }

    const primeira = mesaPecas[0];
    const ultima =
        mesaPecas[mesaPecas.length - 1];

    const esquerda = primeira.a;
    const direita = ultima.b;

    if (peca.b === esquerda) {

        mesaPecas.unshift(peca);

    } else if (peca.a === esquerda) {

        mesaPecas.unshift({
            a: peca.b,
            b: peca.a
        });

    } else if (peca.a === direita) {

        mesaPecas.push(peca);

    } else if (peca.b === direita) {

        mesaPecas.push({
            a: peca.b,
            b: peca.a
        });

    }

}


// ===============================
// JOGADA DO COMPUTADOR
// ===============================

function jogadaComputador() {

    if (vez !== "computador") {
        return;
    }

    let indice = -1;

    for (let i = 0; i < computador.length; i++) {

        if (podeJogar(computador[i])) {

            indice = i;
            break;

        }

    }


    // Computador não consegue jogar

    if (indice === -1) {

        mensagem.textContent =
            "Computador passou. Sua vez!";

        vez = "jogador";

        verificarBloqueio();

        return;
    }


    const peca = computador[indice];

    computador.splice(indice, 1);

    adicionarNaMesa(peca);

    renderizar();


    if (computador.length === 0) {

        finalizarJogo("computador");

        return;
    }


    vez = "jogador";

    mensagem.textContent =
        "Sua vez!";

}


// ===============================
// PASSAR
// ===============================

passButton.addEventListener("click", () => {

    if (vez !== "jogador") {
        return;
    }

    const existeJogada = jogador.some(podeJogar);

    if (existeJogada) {

        mensagem.textContent =
            "Você possui uma peça que pode jogar!";

        return;
    }

    mensagem.textContent =
        "Você passou. Vez do computador.";

    vez = "computador";

    setTimeout(jogadaComputador, 800);

});


// ===============================
// VERIFICAR BLOQUEIO
// ===============================

function verificarBloqueio() {

    const jogadorPode =
        jogador.some(podeJogar);

    if (!jogadorPode) {

        const computadorPode =
            computador.some(podeJogar);

        if (!computadorPode) {

            finalizarJogo("bloqueio");

        }

    }

}


// ===============================
// FINALIZAR
// ===============================

function finalizarJogo(vencedor) {

    vez = null;

    if (vencedor === "jogador") {

        pontosJogador++;

        mensagem.textContent =
            "🎉 Você venceu!";

    }

    else if (vencedor === "computador") {

        pontosComputador++;

        mensagem.textContent =
            "🤖 O computador venceu!";

    }

    else {

        mensagem.textContent =
            "🤝 Jogo bloqueado!";

    }

    renderizar();

}


// ===============================
// BOTÃO NOVO JOGO
// ===============================

newGameButton.addEventListener(
    "click",
    novoJogo
);


// ===============================
// INICIAR
// ===============================

novoJogo();
