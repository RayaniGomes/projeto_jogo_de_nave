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
var intervaloEntreTiros = 150;
var telaInicio;

function setup() {
  createCanvas(1200, 600);
  
  player = new Nave(1180, 300, color(255, 50, 50));
  municao = [];
  balasInimigas = [];
  inimigos = [];
  efeitos = [];
  textosFlutuantes = [];
  powerUps = [];
  pontuacao = 0;

  // Inicializa fundo estrelado 
  fundoEstrelado = new FundoEstrelado(100);

  // Inicializa tela inicial
  telaInicio = new TelaInicio();
  // Inicializa tela de game over 
  telaGameOver = new TelaGameOver();

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
    desenharArmaAtual();
    desenharControlesInferiores();
  }

  // Elementos sempre desenhados
  desenharBalas();
  player.show();

  // Tela de game over
  if (gameOver) {
    telaGameOver.desenhar();
  }

  // Tela de início
  if (!jogoAtivo && !gameOver) {
    telaInicio.desenhar(fundoTela, fundoEstrelado);
  }
}

function iniciarJogo() {
  jogoAtivo = true;
  pontuacao = 0;
  ultimoTiro = 0;
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
  // Reiniciar jogo
  if (keyCode === 82 && gameOver) {
    // Tecla R
    if (
      typeof telaGameOver === "object" &&
      typeof telaGameOver.reiniciarJogo === "function"
    ) {
      telaGameOver.reiniciarJogo();
    }
    return;
  }

  // Iniciar jogo
  if (keyCode === 13 && !jogoAtivo && !gameOver) {
    // Enter
    iniciarJogo();
    return;
  }

  // Troca de arma: 1 = básica, 2 = rápida, 3 = dupla
  if (!gameOver && jogoAtivo) {
    // Troca de arma apenas ao pressionar Q (cicla para trás)
    if (key === "q" || key === "Q") {
      ciclarArma(-1);
      return;
    }
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
    if (
      typeof telaGameOver === "object" &&
      typeof telaGameOver.clicouNoBotaoReiniciar === "function"
    ) {
      if (telaGameOver.clicouNoBotaoReiniciar(mouseX, mouseY)) {
        telaGameOver.reiniciarJogo();
      }
    }
  }
}

// Calcula o bônus de velocidade para inimigos com base na pontuação
// A cada 500 pontos, retorna +3, com limite máximo de 12
function getBonusVelocidadeInimigos() {
  let passos = Math.floor(pontuacao / 500);
  let bonus = passos * 3;
  return Math.min(bonus, 12);
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
    // Só gera VidaExtra se o jogador existir e tiver menos vidas que o máximo
    if (
      typeof player !== "undefined" &&
      player &&
      player.vida < Config.getVidasMaximas()
    ) {
      let x = random(100, width - 100);
      let y = random(100, height - 100);
      powerUps.push(new VidaExtra(x, y));
    }
    // Atualiza o timer mesmo se não gerou (evita tentar spawnar a toda frame)
    ultimoSpawnPowerUp = agora;
  }
}

function atualizarPowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    let powerUp = powerUps[i];
    if (powerUp.ativa) {
      // Passa a posição da nave para o power-up e VidaExtra
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
  text(`Pontuação: ${Config.formatarPontuacao(pontuacao)}`, 20, 20);
}

function desenharMelhorPontuacao() {
  let melhor = Ranking.getMelhorPontuacao();
  fill(200, 200, 255);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Recorde: ${Config.formatarPontuacao(melhor)}`, 20, 50);
}

function desenharVidas() {
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text(`Vidas: ${player.vida}/${Config.getVidasMaximas()}`, width / 2, 20);

  // Desenha corações para vidas
  fill(255, 50, 50);
  for (let i = 0; i < player.vida; i++) {
    let x = width / 2 + 15 + i * 20;
    desenharCoracao(x, 20, 8);
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

// Troca de arma 
const _armasDisponiveis = ["basica", "rapida", "dupla"];

function trocarArma(nova) {
  if (!_armasDisponiveis.includes(nova)) return;
  if (tipoArmaAtual === nova) return;
  tipoArmaAtual = nova;
  // Feedback visual
  criarTextoFlutuante(
    player.xNave,
    player.yNave - 30,
    `Arma: ${nova.toUpperCase()}`,
    color(200, 200, 255)
  );
}

// Cicla entre as armas disponíveis
function ciclarArma(delta) {
  let idx = _armasDisponiveis.indexOf(tipoArmaAtual);
  if (idx === 1) idx = 0;
  idx = (idx + delta + _armasDisponiveis.length) % _armasDisponiveis.length;
  trocarArma(_armasDisponiveis[idx]);
}

function desenharArmaAtual() {
  // Desenha um pequeno painel no canto superior direito com o nome da arma atual
  let w = 160;
  let h = 36;
  let x = width - w - 20;
  let y = 20;

  push();
  rectMode(CORNER);
  fill(10, 10, 20, 180);
  stroke(140, 140, 255);
  strokeWeight(1);
  rect(x, y, w, h, 6);

  noStroke();
  fill(220);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Arma:", x + 8, y + h / 2);

  // Nome e pequeno ícone de bala
  fill(200, 200, 255);
  textAlign(RIGHT, CENTER);
  let nome = tipoArmaAtual.toUpperCase();
  text(nome, x + w - 10, y + h / 2);
  pop();
}

// Painel discreto no canto inferior com informações de controle
function desenharControlesInferiores() {
  push();
  rectMode(CORNER);
  noStroke();

  // Box semi-transparente
  let pad = 10;
  let w = 325;
  let h = 35;
  let x = width / 2 - w / 2; 
  let y = height - h - 20;

  fill(10, 10, 20, 160);
  stroke(120, 120, 200, 160);
  strokeWeight(1);
  rect(x, y, w, h, 6);

  // Texto dos controles
  noStroke();
  fill(220);
  textSize(13);
  textAlign(LEFT, CENTER);

  let linha1 = "↑ ↓:  Mover";
  let linha2 = "SPACE:  Atirar";
  let linha3 = "Q:  Trocar arma";

  // Desenha ícones/labels em linha
  let sx = x + pad + 6;
  let sy = y + h / 2;

  // Monta um texto compacto com separadores
  let texto = `${linha1}   •   ${linha2}   •   ${linha3}`;
  text(texto, sx, sy);

  pop();
}
