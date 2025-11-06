function TelaInicio() {
  this.desenhar = function () {
    fundoEstrelado.atualizar();
    fundoEstrelado.show();
    fill(0, 0, 0, 50);
    rect(0, 0, width, height);

    // TÍTULO PRINCIPAL - Efeito neon
    this.desenharTitulo();

    // Subtítulo
    fill(150, 200, 255);
    textSize(20);
    text("Sobreviva e destrua todos os inimigos!", width / 2, height / 2 - 170);

    // RECORDE - Destaque especial
    this.desenharRecorde();

    // CONTROLES - Box estilizado
    this.desenharBoxControles();

    // BOTÃO INICIAR - Efeito pulsante
    this.desenharBotaoIniciar();
  };

  this.desenharTitulo = function () {
    // Efeito neon para o título
    let pulsoTitulo = sin(frameCount * 0.08) * 0.08 + 1.0;
    textAlign(CENTER, CENTER);

    let baseSize = 56 * pulsoTitulo;
    let x = width / 2;
    let y = height / 2 - 210;

    push();
    // Camada de brilho (shadow) via contexto do canvas
    try {
      drawingContext.shadowBlur = 30;
      drawingContext.shadowColor = "rgba(0,150,255,0.9)";
    } catch (e) {}

    // Glow amplo (camadas maiores e translúcidas)
    noStroke();
    for (let i = 6; i >= 1; i--) {
      let alpha = map(i, 6, 1, 18, 160);
      fill(0, 150, 255, alpha);
      textSize(baseSize + i * 6);
      text("BLASTER RUN", x, y);
    }

    // Centro brilhante com contorno leve
    stroke(80, 200, 255);
    strokeWeight(2);
    fill(200, 255, 255);
    textSize(baseSize);
    text("BLASTER RUN", x, y);

    pop();
  };

  this.desenharBoxControles = function () {
    let boxY = height / 2 - 30;
    let boxHeight = 140;

    // Box de controles com borda neon
    fill(10, 20, 40, 200);
    stroke(0, 150, 255, 200);
    strokeWeight(2);
    rect(width / 2 - 180, boxY, 360, boxHeight, 10);

    // Título "CONTROLES"
    fill(0, 200, 255);
    textSize(22);
    text("CONTROLES", width / 2, boxY + 30);

    // Ícones e textos de controles
    fill(255);
    textSize(16);
    noStroke();

    // Seta para cima
    push();
    translate(width / 2 - 120, boxY + 60);
    fill(0, 255, 150);
    pop();
    fill(200, 255, 200);
    text("↑↓", width / 2 - 60, boxY + 60);
    fill(255);
    text("Mover Nave", width / 2 + 40, boxY + 60);

    // Espaço
    push();
    translate(width / 2 - 80, boxY + 85);
    fill(0, 255, 150);
    rect(0, -8, 40, 15, 5);
    pop();
    fill(0);
    textSize(10);
    text("SPACE", width / 2 - 60, boxY + 85);
    fill(255);
    textSize(16);
    text("Atirar", width / 2 + 40, boxY + 85);

    // troca de balas
    push();
    translate(width / 2 - 70, boxY + 110);
    fill(0, 255, 150);
    rect(0, -7, 20, 15, 5);
    pop();
    fill(0);
    textSize(10);
    text("Q", width / 2 - 60, boxY + 111);
    fill(255);
    textSize(16);
    text("Troca de balas", width / 2 + 40, boxY + 110);
  };

  this.desenharRecorde = function () {
    let melhor = Ranking.getMelhorPontuacao();

    if (melhor > 0) {
      push();
      let recordeY = height / 2 - 100;

      // Box do recorde
      fill(20, 10, 30, 220);
      stroke(255, 215, 0, 255);
      strokeWeight(2);
      rect(width / 2 - 150, recordeY - 22, 300, 40, 5);

      // Texto do recorde
      fill(255, 255, 255);
      textSize(18);
      text("🏆 RECORDE", width / 2 - 40, recordeY);
      fill(255, 255, 100);
      textSize(20);
      text(Config.formatarPontuacao(melhor), width / 2 + 60, recordeY);
      pop();
    }
  };

  this.desenharBotaoIniciar = function () {
    let botaoY = height / 2 + 200;
    let pulsoBotao = (sin(frameCount * 0.15) + 1) / 2;
    let botaoAlpha = 150 + pulsoBotao * 105;
    let botaoSize = 16 + pulsoBotao * 4;

    // Verifica se o mouse está sobre o botão (hover)
    let mouseSobreBotao = this.clicouNoBotao(mouseX, mouseY);
    let corBotao = mouseSobreBotao
      ? color(255, 255, 255)
      : color(255, 255, 255);
    let tamanhoTextoHover = mouseSobreBotao ? botaoSize + 2 : botaoSize;
    let bordaHover = mouseSobreBotao ? 4 : 3;
    let alphaHover = mouseSobreBotao ? botaoAlpha + 30 : botaoAlpha;

    // Fundo do botão
    fill(255, 140, 0, alphaHover);
    stroke(200, 120, 30, 160);
    strokeWeight(bordaHover);
    rect(width / 2 - 180, botaoY - 20, 360, 40, 8);

    // Texto do botão
    fill(corBotao);
    textSize(tamanhoTextoHover);
    text("INICIA O JOGO", width / 2, botaoY);
    
    fill(250);
    noStroke();
    textSize(12);
    text("Clique ou pressione ENTER para iniciar", width / 2, botaoY + 35);

    

    // Efeito de setas/piscar
    if (floor(frameCount * 0.1) % 2 === 0) {
      fill(255, 140, 0);
      triangle(
        width / 2 - 200,
        botaoY,
        width / 2 - 215,
        botaoY - 8,
        width / 2 - 215,
        botaoY + 8
      );
      triangle(
        width / 2 + 200,
        botaoY,
        width / 2 + 215,
        botaoY - 8,
        width / 2 + 215,
        botaoY + 8
      );
    }
  };

  this.clicouNoBotao = function (mx, my) {
    let botaoY = height / 2 + 200;
    let botaoX = width / 2;
    let botaoLargura = 360;
    let botaoAltura = 40;

    return (
      mx >= botaoX - botaoLargura / 2 &&
      mx <= botaoX + botaoLargura / 2 &&
      my >= botaoY - botaoAltura / 2 &&
      my <= botaoY + botaoAltura / 2
    );
  };
}
