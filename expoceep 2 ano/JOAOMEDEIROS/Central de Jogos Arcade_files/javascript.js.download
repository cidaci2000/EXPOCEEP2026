const menuJogos = document.getElementById('menu-jogos');
const containerJogo = document.getElementById('container-jogo');
const areaJogo = document.getElementById('area-jogo');

// Alternar telas
function iniciarJogo(jogo) {
    menuJogos.classList.add('hidden');
    containerJogo.classList.remove('hidden');
    areaJogo.innerHTML = ''; // Limpa o jogo anterior

    if (jogo === 'velha') carregarVelha();
    if (jogo === 'memoria') carregarMemoria();
    if (jogo === 'adivinha') carregarAdivinha();
    if (jogo === 'clique') carregarClique();
}

function voltarAoMenu() {
    menuJogos.classList.remove('hidden');
    containerJogo.classList.add('hidden');
}

// ================= JOGO 1: JOGO DA VELHA =================
function carregarVelha() {
    areaJogo.innerHTML = `<h2>Jogo da Velha</h2><div class="tabuleiro" id="tabuleiro"></div><p id="status-velha">Vez do X</p>`;
    const tabuleiro = document.getElementById('tabuleiro');
    let turno = 'X';
    let estado = ['', '', '', '', '', '', '', '', ''];

    for (let i = 0; i < 9; i++) {
        const quad = document.createElement('div');
        quad.classList.add('quadrado');
        quad.addEventListener('click', () => {
            if (estado[i] === '') {
                estado[i] = turno;
                quad.innerText = turno;
                turno = turno === 'X' ? 'O' : 'X';
                document.getElementById('status-velha').innerText = `Vez do ${turno}`;
                // Nota: Verificação de vitória simplificada omitida para o código não ficar gigante.
            }
        });
        tabuleiro.appendChild(quad);
    }
}

// ================= JOGO 2: JOGO DA MEMÓRIA =================
function carregarMemoria() {
    areaJogo.innerHTML = `<h2>Jogo da Memória</h2><div class="grid-memoria" id="grid-memoria"></div>`;
    const grid = document.getElementById('grid-memoria');
    const icones = ['🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍒', '🍒', '🥑', '🥑', '🍍', '🍍'].sort(() => 0.5 - Math.random());
    let escolhidas = [];

    icones.forEach((icone, index) => {
        const carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.valor = icone;
        carta.innerText = '?';
        
        carta.addEventListener('click', () => {
            if (escolhidas.length < 2 && carta.innerText === '?') {
                carta.innerText = icone;
                escolhidas.push(carta);

                if (escolhidas.length === 2) {
                    setTimeout(() => {
                        if (escolhidas[0].dataset.valor !== escolhidas[1].dataset.valor) {
                            escolhidas[0].innerText = '?';
                            escolhidas[1].innerText = '?';
                        }
                        escolhidas = [];
                    }, 800);
                }
            }
        });
        grid.appendChild(carta);
    });
}

// ================= JOGO 3: ADIVINHA O NÚMERO =================
function carregarAdivinha() {
    const numeroSecreto = Math.floor(Math.random() * 100) + 1;
    areaJogo.innerHTML = `
        <h2>Adivinhe o Número (1 a 100)</h2>
        <input type="number" id="palpite" placeholder="Seu palpite">
        <button class="btn-acao" id="btn-chutar">Chutar</button>
        <p id="dica"></p>
    `;

    document.getElementById('btn-chutar').addEventListener('click', () => {
        const palpite = parseInt(document.getElementById('palpite').value);
        const dica = document.getElementById('dica');
        if (palpite === numeroSecreto) dica.innerText = "🎉 Parabéns! Você acertou!";
        else if (palpite > numeroSecreto) dica.innerText = "Muito alto! Tente menos.";
        else dica.innerText = "Muito baixo! Tente mais.";
    });
}

// ================= JOGO 4: CLICKER VELOZ =================
function carregarClique() {
    let cliques = 0;
    let tempo = 10;
    let jogando = false;

    areaJogo.innerHTML = `
        <h2>Clicker Veloz</h2>
        <p>Tempo: <span id="tempo">10</span>s</p>
        <p>Cliques: <span id="contador">0</span></p>
        <button class="btn-acao" id="btn-clicar" style="width:100%; height:80px; font-size:1.5rem;">CLIQUE AQUI!</button>
    `;

    const btn = document.getElementById('btn-clicar');
    const acaoClique = () => {
        if (!jogando) {
            jogando = true;
            const intervalo = setInterval(() => {
                tempo--;
                document.getElementById('tempo').innerText = tempo;
                if (tempo <= 0) {
                    clearInterval(intervalo);
                    btn.disabled = true;
                    alert(`Fim de jogo! Você fez ${cliques} cliques.`);
                }
            }, 1000);
        }
        cliques++;
        document.getElementById('contador').innerText = cliques;
    };
    btn.addEventListener('click', acaoClique);
}