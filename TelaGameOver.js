function TelaGameOver() {
  this.desenhar = function () {
    fill(0, 0, 0, 180);
    rect(600, 300, width, height);

    // Texto GAME OVER pulsante
    let pulse = sin(frameCount * 0.12);
    let baseSize = 40;
    let tamanhoTexto = baseSize + pulse * 8; 
    let alpha = map(pulse, -1, 1, 160, 255);
    fill(255, 50, 50, alpha);
    textSize(tamanhoTexto);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2 - 100);

    fill(255);
    textSize(24);
    text(
      `Pontuação Final: ${Config.formatarPontuacao(pontuacao)}`,
      width / 2,
      height / 2 - 30
    );

    let melhor = Ranking.getMelhorPontuacao();
    if (pontuacao >= melhor && melhor > 0) {
      fill(255, 255, 0);
      textSize(20);
      text("🏆 NOVO RECORDE! 🏆", width / 2, height / 2 + 10);
    }

    fill(200, 200, 255);
    textSize(18);
    text(
      `Melhor Pontuação: ${Config.formatarPontuacao(melhor)}`,
      width / 2,
      height / 2 + 40
    );

    // Botão de reiniciar
    let botaoY = height / 2 + 100;
    let mouseSobreBotaoReiniciar = this.clicouNoBotaoReiniciar(mouseX, mouseY);
    let corBotaoReiniciar = mouseSobreBotaoReiniciar
      ? color(255, 150, 150)
      : color(255, 100, 100);

    // Box do botão
    fill(20, 10, 20, 200);
    stroke(corBotaoReiniciar, 255, 255, 200);
    strokeWeight(mouseSobreBotaoReiniciar ? 2 : 1);
    rect(width / 2, botaoY, 350, 40, 5);

    fill(corBotaoReiniciar);
    textSize(mouseSobreBotaoReiniciar ? 20 : 18);
    text("REINICIAR O JOGO", width / 2, botaoY);

    fill(250);
    noStroke();
    textSize(12);
    text("Clique ou pressione R para reiniciar", width / 2, botaoY + 35);
  };

  // Retorna true se (mx,my) estiver sobre o botão de reiniciar
  this.clicouNoBotaoReiniciar = function (mx, my) {
    let botaoY = height / 2 + 80;
    let botaoX = width / 2;
    let botaoLargura = 400;
    let botaoAltura = 30;

    return (
      mx >= botaoX - botaoLargura / 2 &&
      mx <= botaoX + botaoLargura / 2 &&
      my >= botaoY - botaoAltura / 2 &&
      my <= botaoY + botaoAltura / 2
    );
  };

  // Reinicia o jogo
  this.reiniciarJogo = function () {
    player = new Nave(1180, 300, color(255, 50, 50));
    municao = [];
    balasInimigas = [];
    inimigos = [];
    efeitos = [];
    textosFlutuantes = [];
    powerUps = [];
    pontuacao = 0;
    gameOver = false;
    jogoAtivo = true;
    tipoArmaAtual = "basica";

    if (!fundoTela && fundoEstrelado) {
      if (typeof fundoEstrelado.resetar === "function") {
        fundoEstrelado.resetar();
      }
    }

    if (typeof criarInimigos === "function") {
      criarInimigos();
    }
    ultimoSpawnPowerUp = millis();
  };
}
