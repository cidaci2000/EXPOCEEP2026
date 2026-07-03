// No início do script do seu jogo (Ex: Jogo da Cobrinha)
let pontuacaoAtual = 0; 

// ... lógica do jogo onde a pontuação aumenta ...
function comerMaca() {
    pontuacaoAtual += 10;
}

// No fim do jogo (Game Over)
function gameOver() {
    window.parent.postMessage({
        type: 'SCORE_SUBMIT',
        id_jogo: 1, 
        score: pontuacaoAtual // Agora ela existe e tem um valor!
    }, '*');
}