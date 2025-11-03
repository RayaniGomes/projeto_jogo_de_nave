// Classe para gerenciar toda a tela inicial do jogo
class TelaInicio {
  constructor() {
    this.particulas = [];
    this.inicializar();
  }

  inicializar() {
    this.criarParticulas();
  }

  criarParticulas() {
    this.particulas = [];
    for (let i = 0; i < 30; i++) {
      this.particulas.push({
        x: random(width),
        y: random(height),
        vx: random(-1, 1),
        vy: random(-1, 1),
        tamanho: random(2, 5),
        brilho: random(100, 255),
        cor: color(random(100, 255), random(100, 255), random(150, 255)),
        vida: random(100, 200),
      });
    }
  }

  atualizarParticulas() {
    for (let particula of this.particulas) {
      particula.x += particula.vx;
      particula.y += particula.vy;
      particula.brilho += sin(frameCount * 0.1 + particula.x) * 10;

      // Reposiciona se sair da tela
      if (particula.x < 0) particula.x = width;
      if (particula.x > width) particula.x = 0;
      if (particula.y < 0) particula.y = height;
      if (particula.y > height) particula.y = 0;
    }
  }

  desenhar(fundoTela, fundoEstrelado) {
    // Fundo animado com estrelas
    if (!fundoTela && fundoEstrelado) {
      fundoEstrelado.atualizar();
      fundoEstrelado.show();
    } else {
      // Fundo gradiente escuro
      for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(10, 10, 30), color(5, 5, 15), inter);
        stroke(c);
        line(0, y, width, y);
      }
    }

    // Partículas flutuantes
    this.atualizarParticulas();
    for (let particula of this.particulas) {
      fill(
        red(particula.cor),
        green(particula.cor),
        blue(particula.cor),
        constrain(particula.brilho, 100, 255)
      );
      noStroke();
      circle(particula.x, particula.y, particula.tamanho);

      // Efeito de brilho
      fill(red(particula.cor), green(particula.cor), blue(particula.cor), 50);
      circle(particula.x, particula.y, particula.tamanho * 2);
    }

    // Overlay escuro com transparência
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // Nave decorativa animada no centro-esquerda
    this.desenharNaveDecorativa();

    // TÍTULO PRINCIPAL - Efeito neon
    this.desenharTitulo();

    // Subtítulo
    fill(150, 200, 255);
    textSize(16);
    text("Sobreviva e destrua todos os inimigos!", width / 2, height / 2 - 95);

    // CONTROLES - Box estilizado
    this.desenharBoxControles();

    // RECORDE - Destaque especial
    this.desenharRecorde();

    // BOTÃO INICIAR - Efeito pulsante
    this.desenharBotaoIniciar();

    // Linha decorativa inferior
    stroke(0, 150, 255, 100);
    strokeWeight(2);
    line(width / 2 - 200, height / 2 + 180, width / 2 + 200, height / 2 + 180);
  }

  desenharNaveDecorativa() {
    push();
    let naveX = 150 + sin(frameCount * 0.05) * 20;
    let naveY = height / 2 + cos(frameCount * 0.03) * 15;
    translate(naveX, naveY);
    rotate(-PI / 2);

    // Brilho ao redor da nave
    fill(255, 50, 50, 50);
    noStroke();
    circle(0, 0, 80);

    // Desenha nave simples
    fill(255, 50, 50);
    triangle(0, -15, -30, 0, 0, 15);
    fill(255);
    circle(-8, 0, 8);
    pop();
  }

  desenharTitulo() {
    let pulsoTitulo = sin(frameCount * 0.1) * 0.3 + 0.7;
    textAlign(CENTER, CENTER);

    // Sombra do título
    fill(0, 0, 0, 150);
    textSize(50 * pulsoTitulo);
    text("JOGO DE NAVES", width / 2 + 3, height / 2 - 130 + 3);

    // Título com gradiente animado
    let tituloGrad1 = color(255, 100, 0);
    let tituloGrad2 = color(255, 255, 0);
    let tituloInter = (sin(frameCount * 0.1) + 1) / 2;
    let tituloCor = lerpColor(tituloGrad1, tituloGrad2, tituloInter);

    // Brilho do título
    fill(red(tituloCor), green(tituloCor), blue(tituloCor), 100);
    textSize(52 * pulsoTitulo);
    text("JOGO DE NAVES", width / 2, height / 2 - 130);

    // Título principal
    fill(tituloCor);
    textSize(50 * pulsoTitulo);
    text("JOGO DE NAVES", width / 2, height / 2 - 130);
  }

  desenharBoxControles() {
    let boxY = height / 2 - 30;
    let boxHeight = 120;

    // Sombra do box
    fill(0, 0, 0, 100);
    rect(width / 2 - 180, boxY - 5, 360, boxHeight + 10, 10);

    // Box de controles com borda neon
    fill(10, 20, 40, 200);
    stroke(0, 150, 255, 200);
    strokeWeight(2);
    rect(width / 2 - 180, boxY, 360, boxHeight, 10);

    // Título "CONTROLES"
    fill(0, 200, 255);
    textSize(22);
    text("CONTROLES", width / 2, boxY + 25);

    // Ícones e textos de controles
    fill(255);
    textSize(16);
    noStroke();

    // Seta para cima
    push();
    translate(width / 2 - 120, boxY + 55);
    fill(0, 255, 150);
    triangle(0, -8, -6, 0, 6, 0);
    pop();
    fill(200, 255, 200);
    text("↑↓", width / 2 - 60, boxY + 55);
    fill(255);
    text("Mover Nave", width / 2 + 40, boxY + 55);

    // Espaço
    push();
    translate(width / 2 - 120, boxY + 85);
    fill(255, 200, 0);
    rect(-15, -5, 30, 10, 3);
    fill(0);
    textSize(10);
    text("SPACE", 0, 2);
    pop();
    fill(255);
    textSize(16);
    text("Atirar", width / 2 + 40, boxY + 85);
  }

  desenharRecorde() {
    let melhor = Ranking.getMelhorPontuacao();
    if (melhor > 0) {
      push();
      let recordeY = height / 2 + 50;

      // Glow effect
      fill(255, 215, 0, 50);
      ellipse(width / 2, recordeY, 300, 40);

      // Box do recorde
      fill(20, 10, 30, 220);
      stroke(255, 215, 0, 255);
      strokeWeight(2);
      rect(width / 2 - 150, recordeY - 15, 300, 30, 5);

      // Texto do recorde
      fill(255, 215, 0);
      textSize(18);
      text("🏆 RECORDE", width / 2 - 80, recordeY);
      fill(255, 255, 100);
      textSize(20);
      text(GameUtils.formatarPontuacao(melhor), width / 2 + 70, recordeY);
      pop();
    }
  }

  desenharBotaoIniciar() {
    let botaoY = height / 2 + 130;
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
    fill(0, 255, 0, alphaHover);
    strokeWeight(bordaHover);
    rect(width / 2 - 180, botaoY - 20, 360, 40, 8);

    // Texto do botão
    fill(corBotao);
    textSize(tamanhoTextoHover);
    text("CLIQUE OU PRESSIONE ENTER", width / 2, botaoY);

    // Efeito de setas/piscar
    if (floor(frameCount / 30) % 2 === 0) {
      fill(0, 255, 0);
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
  }

  clicouNoBotao(mx, my) {
    let botaoY = height / 2 + 130;
    let botaoX = width / 2;
    let botaoLargura = 360;
    let botaoAltura = 40;

    return (
      mx >= botaoX - botaoLargura / 2 &&
      mx <= botaoX + botaoLargura / 2 &&
      my >= botaoY - botaoAltura / 2 &&
      my <= botaoY + botaoAltura / 2
    );
  }
}
