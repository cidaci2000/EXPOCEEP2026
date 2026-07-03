if (!localStorage.getItem('arcade_scores')) localStorage.setItem('arcade_scores', JSON.stringify([]));

let jogadorAtual = "";
let jogoAtual = "";
let scoreAtual = 0;
let jogoLoopInterval = null;

// Controle de teclas pressionadas (para movimento fluido no Space Invaders)
let teclasPressionadas = {};
window.addEventListener('keydown', (e) => { teclasPressionadas[e.keyCode] = true; });
window.addEventListener('keyup', (e) => { teclasPressionadas[e.keyCode] = false; });

function definirJogador() {
    const nick = document.getElementById('player-nickname').value.trim();
    if (!nick) return alert('Por favor, digite um Nickname!');
    jogadorAtual = nick;
    document.getElementById('user-display-name').innerText = `👤 Jogador: ${jogadorAtual}`;
    navegarPara('home-screen');
}

function mudarNickname() { jogadorAtual = ""; navegarPara('auth-screen'); }
function navegarPara(idTela) {
    document.querySelectorAll('.screen').forEach(tela => tela.classList.add('hidden'));
    document.getElementById(idTela).classList.remove('hidden');
}

const configJogos = {
    snake: { titulo: "🐍 Jogo da Cobrinha (Grande)", instrucoes: "Use as SETAS do teclado para guiar a cobra pela arena de 450x450." },
    mines: { titulo: "💣 Campo Minado (Dificuldade Alta)", instrucoes: "Grade 12x12 contendo 40 minas explosivas. Clique com o mouse para revelar." },
    invaders: { titulo: "👾 Space Invaders Pro", instrucoes: "Segure SETAS (Esquerda/Direita) para mover. Barra de ESPAÇO atira. Novos inimigos surgem a cada 10 segundos!" },
    pacman: { titulo: "🟡 Pacman Infinito com Labirinto", instrucoes: "Use as SETAS para mover. Os fantasmas andam aleatoriamente. Vença a Fase 3 para entrar no loop de pontos!" }
};

function iniciarJogo(chaveJogo) {
    jogoAtual = chaveJogo;
    clearInterval(jogoLoopInterval);
    document.getElementById('game-title').innerText = configJogos[chaveJogo].titulo;
    document.getElementById('game-instructions').innerText = configJogos[chaveJogo].instrucoes;
    document.getElementById('game-instructions').classList.remove('hidden');
    document.getElementById('btn-start-game').classList.remove('hidden');
    document.getElementById('game-play-zone').classList.add('hidden');
    atualizarTabelaRanking();
    navegarPara('game-screen');
}

function voltarParaHome() {
    clearInterval(jogoLoopInterval);
    navegarPara('home-screen');
}

function comecarPartida() {
    scoreAtual = 0;
    document.getElementById('game-current-score').innerText = scoreAtual;
    document.getElementById('game-instructions').classList.add('hidden');
    document.getElementById('btn-start-game').classList.add('hidden');
    document.getElementById('game-play-zone').classList.remove('hidden');

    const container = document.getElementById('canvas-container');
    container.innerHTML = "";

    if (jogoAtual === 'snake') rodarEngineSnake(container);
    else if (jogoAtual === 'mines') rodarEngineMines(container);
    else if (jogoAtual === 'invaders') rodarEngineInvaders(container);
    else if (jogoAtual === 'pacman') rodarEnginePacman(container);
}

function finalizarPartida() {
    clearInterval(jogoLoopInterval);
    alert(`Fim de jogo! Sua pontuação: ${scoreAtual}`);
    salvarPontuacao(jogoAtual, scoreAtual);
    iniciarJogo(jogoAtual);
}

// ==========================================
// ENGINE: COBRINHA
// ==========================================
function rodarEngineSnake(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 450; canvas.height = 450;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const box = 15;
    let snake = [{ x: 15 * box, y: 15 * box }];
    let direcao = "RIGHT";
    let comida = { x: Math.floor(Math.random()*29)*box, y: Math.floor(Math.random()*29)*box };

    const temporarioKeydown = (e) => {
        if (e.keyCode == 37 && direcao != "RIGHT") direcao = "LEFT";
        else if (e.keyCode == 38 && direcao != "DOWN") direcao = "UP";
        else if (e.keyCode == 39 && direcao != "LEFT") direcao = "RIGHT";
        else if (e.keyCode == 40 && direcao != "UP") direcao = "DOWN";
    };
    window.addEventListener('keydown', temporarioKeydown);

    jogoLoopInterval = setInterval(() => {
        ctx.fillStyle = "#121214"; ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? "#00b37e" : "#00875f";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = "#f75a68"; ctx.fillRect(comida.x, comida.y, box, box);

        let sX = snake[0].x; let sY = snake[0].y;
        if (direcao == "LEFT") sX -= box;
        if (direcao == "UP") sY -= box;
        if (direcao == "RIGHT") sX += box;
        if (direcao == "DOWN") sY += box;

        if (sX == comida.x && sY == comida.y) {
            scoreAtual += 10;
            document.getElementById('game-current-score').innerText = scoreAtual;
            comida = { x: Math.floor(Math.random()*29)*box, y: Math.floor(Math.random()*29)*box };
        } else {
            snake.pop();
        }

        let cabeca = { x: sX, y: sY };
        if (sX < 0 || sX >= canvas.width || sY < 0 || sY >= canvas.height || snake.some(s => s.x === cabeca.x && s.y === cabeca.y)) {
            window.removeEventListener('keydown', temporarioKeydown);
            finalizarPartida();
        }
        snake.unshift(cabeca);
    }, 100);
}

// ==========================================
// ENGINE: CAMPO MINADO
// ==========================================
function rodarEngineMines(container) {
    const size = 12;
    const minas = 40;
    const gridDiv = document.createElement('div');
    gridDiv.className = 'mines-grid';
    gridDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    container.appendChild(gridDiv);

    let tab = Array.from({length: size}, (_, r) => Array.from({length: size}, (_, c) => ({ r, c, mina: false, rev: false })));

    let mCont = 0;
    while(mCont < minas) {
        let r = Math.floor(Math.random()*size), c = Math.floor(Math.random()*size);
        if(!tab[r][c].mina) { tab[r][c].mina = true; mCont++; }
    }

    for(let r=0; r<size; r++) {
        for(let c=0; c<size; c++) {
            const cel = document.createElement('div');
            cel.className = 'mine-cell';
            cel.addEventListener('click', () => {
                if(tab[r][c].rev) return;
                tab[r][c].rev = true;
                if(tab[r][c].mina) {
                    cel.classList.add('mine'); cel.innerText = "💣";
                    setTimeout(finalizarPartida, 300);
                } else {
                    cel.classList.add('revealed');
                    scoreAtual += 10;
                    document.getElementById('game-current-score').innerText = scoreAtual;
                    let v = 0;
                    for(let i=-1; i<=1; i++) {
                        for(let j=-1; j<=1; j++) {
                            if(tab[r+i] && tab[r+i][c+j] && tab[r+i][c+j].mina) v++;
                        }
                    }
                    if(v > 0) cel.innerText = v;
                }
            });
            gridDiv.appendChild(cel);
        }
    }
}

// ==========================================
// ENGINE: SPACE INVADERS
// ==========================================
function rodarEngineInvaders(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 450; canvas.height = 400;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let naveX = 200;
    let mísseis = [];
    let inimigos = [];
    let ultimoSpawn = Date.now();
    let cooldownTiro = 0;

    function spawnInimigos() {
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 8; col++) {
                inimigos.push({ x: col * 45 + 50, y: row * 30 + 10, w: 30, h: 20 });
            }
        }
    }
    spawnInimigos();

    jogoLoopInterval = setInterval(() => {
        ctx.fillStyle = "#121214"; ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (teclasPressionadas[37] && naveX > 0) naveX -= 5; 
        if (teclasPressionadas[39] && naveX < canvas.width - 40) naveX += 5;
        if (teclasPressionadas[32] && cooldownTiro <= 0) {
            mísseis.push({ x: naveX + 17, y: canvas.height - 30 });
            cooldownTiro = 12;
        }
        if (cooldownTiro > 0) cooldownTiro--;

        if (Date.now() - ultimoSpawn > 10000) {
            inimigos.forEach(inva => inva.y += 40);
            spawnInimigos();
            ultimoSpawn = Date.now();
        }

        ctx.fillStyle = "#00b37e"; ctx.fillRect(naveX, canvas.height - 25, 40, 15);

        ctx.fillStyle = "#f75a68";
        inimigos.forEach(inva => {
            ctx.fillRect(inva.x, inva.y, inva.w, inva.h);
            inva.y += 0.3; 
            if (inva.y >= canvas.height - 40) finalizarPartida();
        });

        ctx.fillStyle = "#ffff00";
        for (let m = mísseis.length - 1; m >= 0; m--) {
            let mis = mísseis[m];
            ctx.fillRect(mis.x, mis.y, 4, 10);
            mis.y -= 7;

            if (mis.y < 0) { mísseis.splice(m, 1); continue; }

            for (let i = inimigos.length - 1; i >= 0; i--) {
                let inva = inimigos[i];
                if (mis.x > inva.x && mis.x < inva.x + inva.w && mis.y > inva.y && mis.y < inva.y + inva.h) {
                    inimigos.splice(i, 1);
                    mísseis.splice(m, 1);
                    scoreAtual += 25;
                    document.getElementById('game-current-score').innerText = scoreAtual;
                    break;
                }
            }
        }
    }, 1000 / 45);
}

// ==========================================
// ENGINE: PACMAN (PATRULHA ALEATÓRIA + PERSEGUIÇÃO POR PROXIMIDADE)
// ==========================================
function rodarEnginePacman(container) {
    const canvas = document.createElement('canvas');
    canvas.width = 440; canvas.height = 440;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const tileSize = 40;
    let faseAtual = 1;

    const mapa = [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,1],
        [1,0,0,0,1,1,1,0,0,0,1],
        [1,1,1,0,1,1,1,0,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,0,1],
        [1,0,0,1,0,1,0,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
    ];

    let pac = { x: 1, y: 1, px: 40, py: 40 };
    let fantasmas = [];
    let pastilhas = [];

    function inicializarObjetos() {
        pac.x = 1; pac.y = 1; pac.px = 40; pac.py = 40;
        
        fantasmas = [
            { x: 9, y: 9, px: 360, py: 360, cor: "#ff0000", vel: 2, dirX: 0, dirY: 0 }
        ];
        
        if (faseAtual >= 2) {
            fantasmas.push({ x: 1, y: 9, px: 40, py: 360, cor: "#ffb8ff", vel: 2, dirX: 0, dirY: 0 });
        }
        if (faseAtual >= 3) {
            fantasmas.push({ x: 9, y: 1, px: 360, py: 40, cor: "#00ffff", vel: 2, dirX: 0, dirY: 0 });
        }
        
        pastilhas = [];
        for(let r=0; r<mapa.length; r++){
            for(let c=0; c<mapa[r].length; c++){
                if(mapa[r][c] === 0) pastilhas.push({ r, c, coletada: false });
            }
        }
    }

    inicializarObjetos();

    const temporarioPacmanKey = (e) => {
        let proximoX = pac.x; let proximoY = pac.y;
        if (e.keyCode == 37) proximoX--;
        if (e.keyCode == 39) proximoX++;
        if (e.keyCode == 38) proximoY--;
        if (e.keyCode == 40) proximoY++;

        if(mapa[proximoY] && mapa[proximoY][proximoX] !== 1) {
            pac.x = proximoX; pac.y = proximoY;
        }
    };
    window.addEventListener('keydown', temporarioPacmanKey);

    jogoLoopInterval = setInterval(() => {
        ctx.fillStyle = "#121214"; ctx.fillRect(0, 0, canvas.width, canvas.height);

        let alvoPX = pac.x * tileSize; let alvoPY = pac.y * tileSize;
        pac.px += (alvoPX - pac.px) * 0.25; pac.py += (alvoPY - pac.py) * 0.25;

        // Renderiza paredes
        for (let r = 0; r < mapa.length; r++) {
            for (let c = 0; c < mapa[r].length; c++) {
                if (mapa[r][c] === 1) {
                    ctx.fillStyle = "#1f4068";
                    ctx.fillRect(c * tileSize, r * tileSize, tileSize - 2, tileSize - 2);
                }
            }
        }

        // Renderiza pastilhas
        pastilhas.forEach(p => {
            if (!p.coletada) {
                ctx.fillStyle = "#ffff00"; ctx.beginPath(); ctx.arc(p.c * tileSize + 20, p.r * tileSize + 20, 5, 0, Math.PI * 2); ctx.fill();
                if (pac.x === p.c && pac.y === p.r) {
                    p.coletada = true; scoreAtual += 10;
                    document.getElementById('game-current-score').innerText = scoreAtual;
                }
            }
        });

        // Desenha Pacman
        ctx.fillStyle = "#ffcc00"; ctx.beginPath();
        ctx.arc(pac.px + 20, pac.py + 20, 14, 0.2 * Math.PI, 1.8 * Math.PI); ctx.lineTo(pac.px + 20, pac.py + 20); ctx.fill();

        // Movimentação e Inteligência dos Fantasmas
        fantasmas.forEach(fan => {
            let dAlvoPX = fan.x * tileSize; let dAlvoPY = fan.y * tileSize;
            
            if(fan.px < dAlvoPX) fan.px += fan.vel;
            else if(fan.px > dAlvoPX) fan.px -= fan.vel;
            if(fan.py < dAlvoPY) fan.py += fan.vel;
            else if(fan.py > dAlvoPY) fan.py -= fan.vel;

            // Quando o fantasma se alinha perfeitamente a uma célula do grid
            if(Math.abs(fan.px - dAlvoPX) < fan.vel && Math.abs(fan.py - dAlvoPY) < fan.vel) {
                fan.px = dAlvoPX; fan.py = dAlvoPY;

                // Mapeia direções válidas (corredores sem parede)
                let direcoesPossiveis = [];
                if (mapa[fan.y][fan.x - 1] === 0) direcoesPossiveis.push({x: -1, y: 0}); 
                if (mapa[fan.y][fan.x + 1] === 0) direcoesPossiveis.push({x: 1, y: 0});  
                if (mapa[fan.y - 1] && mapa[fan.y - 1][fan.x] === 0) direcoesPossiveis.push({x: 0, y: -1}); 
                if (mapa[fan.y + 1] && mapa[fan.y + 1][fan.x] === 0) direcoesPossiveis.push({x: 0, y: 1});  

                // Calcula a distância em blocos até o Pacman (Teorema de Pitágoras)
                let distanciaDoPacman = Math.sqrt(Math.pow(fan.x - pac.x, 2) + Math.pow(fan.y - pac.y, 2));

                if (distanciaDoPacman <= 4) {
                    // MODO PERSEGUIÇÃO: Escolha a direção válida que deixa o fantasma mais perto do Pacman
                    let melhorDirecao = null;
                    let menorDistancia = Infinity;

                    direcoesPossiveis.forEach(dir => {
                        let proximoX = fan.x + dir.x;
                        let proximoY = fan.y + dir.y;
                        let distFicticia = Math.sqrt(Math.pow(proximoX - pac.x, 2) + Math.pow(proximoY - pac.y, 2));
                        
                        if (distFicticia < menorDistancia) {
                            menorDistancia = distFicticia;
                            melhorDirecao = dir;
                        }
                    });

                    if (melhorDirecao) {
                        fan.dirX = melhorDirecao.x; fan.dirY = melhorDirecao.y;
                    }
                } else {
                    // MODO ALEATÓRIO: Filtra para não voltar para trás se houver alternativas
                    if(direcoesPossiveis.length > 1) {
                        direcoesPossiveis = direcoesPossiveis.filter(d => d.x !== -fan.dirX || d.y !== -fan.dirY);
                    }
                    if(direcoesPossiveis.length > 0) {
                        let escolha = direcoesPossiveis[Math.floor(Math.random() * direcoesPossiveis.length)];
                        fan.dirX = escolha.x; fan.dirY = escolha.y;
                    }
                }

                // Aplica a direção definida
                fan.x += fan.dirX; fan.y += fan.dirY;
            }

            // Desenha o Fantasma
            ctx.fillStyle = fan.cor; ctx.fillRect(fan.px + 8, fan.py + 8, 24, 24);

            // Colisão por aproximação de pixels
            if (Math.abs(pac.px - fan.px) < 20 && Math.abs(pac.py - fan.py) < 20) {
                window.removeEventListener('keydown', temporarioPacmanKey);
                finalizarPartida();
            }
        });

        // Controle de transição/reset de fases
        if (!pastilhas.some(p => !p.coletada)) {
            if (faseAtual === 1) {
                faseAtual = 2;
                alert("Fase 1 Completa! Entrando na Fase 2 com 2 fantasmas!");
                inicializarObjetos();
            } else if (faseAtual === 2) {
                faseAtual = 3;
                alert("Fase 2 Completa! Entrando na Fase 3 Máxima com 3 fantasmas!");
                inicializarObjetos();
            } else {
                alert("Fase 3 Concluída! O mapa foi resetado para continuar pontuando!");
                inicializarObjetos();
            }
        }
    }, 1000 / 30);
}

// ==========================================
// STORAGE E RANKINGS
// ==========================================
function salvarPontuacao(idJogo, score) {
    let pontuacoes = JSON.parse(localStorage.getItem('arcade_scores'));
    pontuacoes.push({ usuario: jogadorAtual, jogo: idJogo, score: score, data: new Date().toLocaleDateString() });
    localStorage.setItem('arcade_scores', JSON.stringify(pontuacoes));
}

function atualizarTabelaRanking() {
    let pontuacoes = JSON.parse(localStorage.getItem('arcade_scores'));
    let rankingFiltrado = pontuacoes.filter(p => p.jogo === jogoAtual).sort((a, b) => b.score - a.score).slice(0, 5);
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '';
    if (rankingFiltrado.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Sem recordes ainda.</td></tr>`;
        return;
    }
    rankingFiltrado.forEach((partida, index) => {
        tbody.innerHTML += `<tr><td><strong>${index + 1}º</strong></td><td>${partida.usuario}</td><td>${partida.score} pts</td></tr>`;
    });
}