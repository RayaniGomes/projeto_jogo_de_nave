// Variáveis globais
var fundoTela;
var player;
var municao = [];
var balasInimigas = [];
var inimigos = [];
var pontuacao = 0;
var jogoAtivo = false;
var gameOver = false;
var efeitos = [];
var textosFlutuantes = [];
var powerUps = [];
var fundoEstrelado;
var ultimoSpawnPowerUp = 0;
var tipoArmaAtual = "basica";
var ultimoTiro = 0; // Controle de tiro contínuo
var intervaloEntreTiros = 150; // Milissegundos entre cada tiro
var telaInicio; // Instância da tela inicial

function preload() {
  // Não tenta carregar imagem para evitar erros de fetch
  // O jogo usará o fundo estrelado dinâmico por padrão
  fundoTela = null;
}

function setup() {
  createCanvas(800, 400);

  player = new Nave(750, 200, color(255, 50, 50));
  municao = [];
  balasInimigas = [];
  inimigos = [];
  efeitos = [];
  textosFlutuantes = [];
  powerUps = [];
  pontuacao = 0;

  // Inicializa fundo estrelado (sempre usado)
  fundoEstrelado = new FundoEstrelado(100);

  // Inicializa controle de tiro
  ultimoTiro = 0;

  // Inicializa tela inicial
  telaInicio = new TelaInicio();

  criarInimigos();
  ultimoSpawnPowerUp = millis();
}

function draw() {
  // Fundo do jogo
  if (fundoTela) {
    background(fundoTela);
  } else {
    fundoEstrelado.atualizar();
    fundoEstrelado.show();
  }

  if (jogoAtivo && !gameOver) {
    // Atualizações do jogo
    player.atualizarInvencibilidade();
    gameControls();
    atualizarInimigos();
    atualizarBalasInimigas();
    atualizarPowerUps();
    removerBalas();
    verificarColisoes();
    atualizarEfeitos();
    atualizarTextosFlutuantes();

    // Spawn de power-ups a cada 30 segundos
    spawnPowerUp();

    // Desenha elementos do jogo
    desenharInimigos();
    desenharPowerUps();
    desenharBalasInimigas();
    desenharEfeitos();
    desenharTextosFlutuantes();
    desenharPontuacao();
    desenharVidas();
    desenharMelhorPontuacao();
  }

  // Elementos sempre desenhados
  desenharBalas();
  player.show();

  // Tela de game over
  if (gameOver) {
    desenharGameOver();
  }

  // Tela de início
  if (!jogoAtivo && !gameOver) {
    telaInicio.desenhar(fundoTela, fundoEstrelado);
  }
}

function gameControls() {
  if (keyIsDown(UP_ARROW)) {
    player.moverParaCima();
  }
  if (keyIsDown(DOWN_ARROW)) {
    player.moverParaBaixo();
  }

  // Tiro contínuo enquanto a barra de espaço estiver pressionada
  if (keyIsDown(32) && jogoAtivo && !gameOver) {
    // Barra de espaço (código 32)
    let agora = millis();
    if (agora - ultimoTiro >= intervaloEntreTiros) {
      atirar();
      ultimoTiro = agora;
    }
  }
}

function keyPressed() {
  // Tiro contínuo agora é controlado em gameControls()
  // Mantemos keyPressed apenas para outras ações

  // Reiniciar jogo
  if (keyCode === 82 && gameOver) {
    // Tecla R
    reiniciarJogo();
  }

  // Iniciar jogo
  if (keyCode === 13 && !jogoAtivo && !gameOver) {
    // Enter
    iniciarJogo();
  }
}

function mousePressed() {
  // Verifica se clicou no botão de iniciar
  if (!jogoAtivo && !gameOver) {
    if (telaInicio.clicouNoBotao(mouseX, mouseY)) {
      iniciarJogo();
    }
  }

  // Verifica se clicou no botão de reiniciar (game over)
  if (gameOver) {
    if (clicouNoBotaoReiniciar(mouseX, mouseY)) {
      reiniciarJogo();
    }
  }
}

function iniciarJogo() {
  jogoAtivo = true;
  pontuacao = 0;
  ultimoTiro = 0; // Reset do timer de tiro
}

function clicouNoBotaoReiniciar(mx, my) {
  // Área aproximada do botão de reiniciar na tela de game over
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
}

function atirar() {
  let posicaoFrente = player.getPosicaoFrente();

  // Sistema de múltiplos tiros baseado no tipo de arma
  if (tipoArmaAtual === "dupla") {
    // Tiro duplo
    let novaBala1 = new Bala(
      posicaoFrente.x,
      posicaoFrente.y - 10,
      "jogador",
      "dupla"
    );
    let novaBala2 = new Bala(
      posicaoFrente.x,
      posicaoFrente.y + 10,
      "jogador",
      "dupla"
    );
    municao.push(novaBala1);
    municao.push(novaBala2);
  } else {
    // Tiro simples ou rápido
    let novaBala = new Bala(
      posicaoFrente.x,
      posicaoFrente.y,
      "jogador",
      tipoArmaAtual
    );
    municao.push(novaBala);
  }
}

function desenharBalas() {
  for (let i = 0; i < municao.length; i++) {
    municao[i].show();
    municao[i].automove();
  }
}

function desenharBalasInimigas() {
  for (let i = 0; i < balasInimigas.length; i++) {
    balasInimigas[i].show();
    balasInimigas[i].automove();
  }
}

function atualizarBalasInimigas() {
  // Remove balas inimigas que saíram da tela
  for (let i = balasInimigas.length - 1; i >= 0; i--) {
    if (balasInimigas[i].estaForaDaTela()) {
      balasInimigas.splice(i, 1);
    }
  }
}

function removerBalas() {
  for (let i = municao.length - 1; i >= 0; i--) {
    if (municao[i].estaForaDaTela()) {
      municao.splice(i, 1);
    }
  }
}

function criarInimigos() {
  let tipos = ["basico", "rapido", "forte"];

  for (let i = 0; i < 8; i++) {
    let tipo = random(tipos);
    let x = random(-200, 0);
    let y = random(50, height - 50);
    inimigos.push(new Inimigo(x, y, tipo));
  }
}

function desenharInimigos() {
  for (let inimigo of inimigos) {
    if (inimigo.ativa) {
      inimigo.show();
    }
  }
}

function atualizarInimigos() {
  for (let inimigo of inimigos) {
    if (inimigo.ativa) {
      inimigo.mover();

      // Inimigo atira
      let novaBala = inimigo.atirar();
      if (novaBala) {
        balasInimigas.push(novaBala);
      }
    } else {
      // Chance de respawn
      if (random() < 0.005) {
        inimigo.reposicionar();
        inimigo.vida = inimigo.tipo === "forte" ? 2 : 1;
      }
    }
  }
}

function verificarColisoes() {
  // Colisões: balas jogador vs inimigos
  for (let i = municao.length - 1; i >= 0; i--) {
    for (let j = inimigos.length - 1; j >= 0; j--) {
      let bala = municao[i];
      let inimigo = inimigos[j];

      if (inimigo.ativa && inimigo.colidiuCom(bala)) {
        // Remove a bala
        municao.splice(i, 1);

        // Aplica dano no inimigo
        let inimigoDerrotado = inimigo.receberDano();

        if (inimigoDerrotado) {
          pontuacao += inimigo.pontos;
          criarExplosao(inimigo.x, inimigo.y, inimigo.cor);
          criarTextoFlutuante(
            inimigo.x,
            inimigo.y,
            `+${inimigo.pontos}`,
            color(255, 255, 0)
          );
        } else {
          criarEfeitoDano(inimigo.x, inimigo.y);
        }

        break;
      }
    }
  }

  // Colisões: balas inimigas vs jogador
  for (let i = balasInimigas.length - 1; i >= 0; i--) {
    if (player.colidiuCom(balasInimigas[i])) {
      balasInimigas.splice(i, 1);

      if (player.receberDano()) {
        gameOver = true;
        Ranking.salvarMelhorPontuacao(pontuacao);
        criarExplosao(player.xNave, player.yNave, color(255, 0, 0));
      } else {
        criarEfeitoDano(player.xNave, player.yNave);
        criarTextoFlutuante(
          player.xNave,
          player.yNave,
          "OUCH!",
          color(255, 0, 0)
        );
      }
      break;
    }
  }

  // Colisões: inimigos vs jogador
  for (let inimigo of inimigos) {
    if (inimigo.ativa && player.colidiuCom(inimigo)) {
      inimigo.ativa = false;

      if (player.receberDano()) {
        gameOver = true;
        Ranking.salvarMelhorPontuacao(pontuacao);
        criarExplosao(player.xNave, player.yNave, color(255, 0, 0));
      } else {
        criarEfeitoDano(player.xNave, player.yNave);
        criarTextoFlutuante(
          player.xNave,
          player.yNave,
          "OUCH!",
          color(255, 0, 0)
        );
      }
      break;
    }
  }

  // Colisões: power-ups vs jogador
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    if (powerUp.ativa && player.colidiuCom(powerUp)) {
      if (powerUp.coletar(player)) {
        criarExplosao(powerUp.x, powerUp.y, color(255, 100, 255));
        criarTextoFlutuante(
          powerUp.x,
          powerUp.y,
          "+1 VIDA",
          color(255, 50, 50)
        );
        powerUps.splice(i, 1);
      }
    }
  }
}

function criarExplosao(x, y, cor) {
  for (let i = 0; i < 15; i++) {
    efeitos.push({
      x: x,
      y: y,
      vx: random(-3, 3),
      vy: random(-3, 3),
      tamanho: random(2, 6),
      cor: cor,
      vida: 30,
      tipo: "explosao",
    });
  }
}

function criarEfeitoDano(x, y) {
  for (let i = 0; i < 8; i++) {
    efeitos.push({
      x: x,
      y: y,
      vx: random(-2, 2),
      vy: random(-2, 2),
      tamanho: random(1, 3),
      cor: color(255, 100, 100),
      vida: 15,
      tipo: "dano",
    });
  }
}

function criarTextoFlutuante(x, y, texto, cor) {
  textosFlutuantes.push(new TextoFlutuante(x, y, texto, cor, 24));
}

function atualizarEfeitos() {
  for (let i = efeitos.length - 1; i >= 0; i--) {
    let efeito = efeitos[i];

    efeito.x += efeito.vx;
    efeito.y += efeito.vy;
    efeito.vida--;

    if (efeito.vida <= 0) {
      efeitos.splice(i, 1);
    }
  }
}

function atualizarTextosFlutuantes() {
  for (let i = textosFlutuantes.length - 1; i >= 0; i--) {
    textosFlutuantes[i].atualizar();
    if (!textosFlutuantes[i].ativa) {
      textosFlutuantes.splice(i, 1);
    }
  }
}

function desenharEfeitos() {
  for (let efeito of efeitos) {
    fill(efeito.cor);
    noStroke();
    circle(efeito.x, efeito.y, efeito.tamanho);
  }
}

function desenharTextosFlutuantes() {
  for (let texto of textosFlutuantes) {
    texto.show();
  }
}

function spawnPowerUp() {
  let agora = millis();
  if (agora - ultimoSpawnPowerUp > Config.getIntervaloPowerUp()) {
    let x = random(100, width - 100);
    let y = random(100, height - 100);
    powerUps.push(new VidaExtra(x, y));
    ultimoSpawnPowerUp = agora;
  }
}

function atualizarPowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    if (powerUp.ativa) {
      // Passa a posição da nave para o power-up
      // VidaExtra usa esses parâmetros, outros power-ups ignoram
      if (powerUp instanceof VidaExtra) {
        powerUp.mover(player.xNave, player.yNave);
      } else {
        powerUp.mover();
      }
      powerUp.show();
    } else {
      powerUps.splice(i, 1);
    }
  }
}

function desenharPowerUps() {
  for (let powerUp of powerUps) {
    if (powerUp.ativa) {
      powerUp.show();
    }
  }
}

function desenharPontuacao() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Pontuação: ${GameUtils.formatarPontuacao(pontuacao)}`, 20, 20);
}

function desenharMelhorPontuacao() {
  let melhor = Ranking.getMelhorPontuacao();
  fill(200, 200, 255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Recorde: ${GameUtils.formatarPontuacao(melhor)}`, 20, 50);
}

function desenharVidas() {
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text(`Vidas: ${player.vida}/${Config.getVidasMaximas()}`, width - 20, 20);

  // Desenha corações para vidas
  fill(255, 50, 50);
  for (let i = 0; i < player.vida; i++) {
    let x = width - 100 + i * 25;
    desenharCoracao(x, 25, 8);
  }
}

function desenharCoracao(x, y, tamanho) {
  beginShape();
  vertex(x, y);
  bezierVertex(
    x - tamanho,
    y - tamanho,
    x - tamanho * 2,
    y + tamanho,
    x,
    y + tamanho * 2
  );
  bezierVertex(x + tamanho * 2, y + tamanho, x + tamanho, y - tamanho, x, y);
  endShape(CLOSE);
}

function desenharGameOver() {
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  fill(255, 50, 50);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 80);

  fill(255);
  textSize(24);
  text(
    `Pontuação Final: ${GameUtils.formatarPontuacao(pontuacao)}`,
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
    `Melhor Pontuação: ${GameUtils.formatarPontuacao(melhor)}`,
    width / 2,
    height / 2 + 40
  );

  // Botão de reiniciar
  let botaoY = height / 2 + 80;
  let mouseSobreBotaoReiniciar = clicouNoBotaoReiniciar(mouseX, mouseY);
  let corBotaoReiniciar = mouseSobreBotaoReiniciar
    ? color(255, 150, 150)
    : color(255, 100, 100);

  // Box do botão
  fill(20, 10, 20, 200);
  stroke(corBotaoReiniciar, mouseSobreBotaoReiniciar ? 255 : 200);
  strokeWeight(mouseSobreBotaoReiniciar ? 3 : 2);
  rect(width / 2 - 200, botaoY - 15, 400, 30, 5);

  fill(corBotaoReiniciar);
  textSize(mouseSobreBotaoReiniciar ? 20 : 18);
  text("CLIQUE OU PRESSIONE R PARA REINICIAR", width / 2, botaoY);
}

// Funções da tela inicial foram movidas para TelaInicio.js

function reiniciarJogo() {
  player = new Nave(750, 200, color(255, 50, 50));
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
  ultimoTiro = 0; // Reset do timer de tiro contínuo

  if (!fundoTela && fundoEstrelado) {
    fundoEstrelado.resetar();
  }

  criarInimigos();
  ultimoSpawnPowerUp = millis();
}
