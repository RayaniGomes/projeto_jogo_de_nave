class Inimigo extends EntidadeGame {
  constructor(x, y, tipo = "basico") {
    // Configurações baseadas no tipo de inimigo
    let config = Inimigo.#getConfigTipo(tipo);

    super(x, y, config.largura, config.altura, config.cor);

    this.#tipo = tipo;
    this.#ultimoTiro = 0;

    this.vida = config.vida;
    this.ativa = true;
    this.velocidade = config.velocidade;
    this.pontos = Config.getPontosPorTipo(tipo);
    this.intervaloTiro = config.intervaloTiro;
  }

  #tipo;
  #ultimoTiro;

  static #getConfigTipo(tipo) {
    const configs = {
      basico: {
        largura: 35,
        altura: 35,
        velocidade: 1.5,
        cor: color(150, 50, 200),
        vida: 1,
        intervaloTiro: 2000,
        pontos: 10,
      },
      rapido: {
        largura: 30,
        altura: 30,
        velocidade: 2.5,
        cor: color(50, 150, 255),
        vida: 1,
        intervaloTiro: 1500,
        pontos: 15,
      },
      forte: {
        largura: 45,
        altura: 45,
        velocidade: 1,
        cor: color(255, 100, 50),
        vida: 2,
        intervaloTiro: 3000,
        pontos: 25,
      },
    };
    return configs[tipo] || configs.basico;
  }

  get tipo() {
    return this.#tipo;
  }

  set tipo(valor) {
    if (["basico", "rapido", "forte"].includes(valor)) {
      this.#tipo = valor;
    }
  }

  show() {
    if (!this.ativa) return;

    this.desenharCorpo();
    this.desenharDetalhes();

    // Barra de vida dos inimigos fortes
    if (this.#tipo === "forte" && this.vida < 2) {
      this.desenharBarraVida();
    }
  }

  desenharCorpo() {
    fill(this.cor);
    rectMode(CENTER);
    rect(this.x, this.y, this.largura, this.altura, 5);
  }

  desenharDetalhes() {
    // Olhos do inimigo
    fill(255);
    circle(this.x - 5, this.y - 5, 6);
    circle(this.x - 5, this.y + 5, 6);

    // Pupilas
    fill(0);
    circle(this.x - 5, this.y - 5, 3);
    circle(this.x - 5, this.y + 5, 3);

    // Boca/Canhão
    fill(100);
    rect(this.x + 8, this.y, 5, 3);
  }

  desenharBarraVida() {
    let barraWidth = this.largura;
    let barraHeight = 4;
    let barraY = this.y - this.altura / 2 - 8;

    // Fundo da barra
    fill(100);
    rect(this.x, barraY, barraWidth, barraHeight);

    // Vida atual
    fill(this.vida === 2 ? color(0, 255, 0) : color(255, 255, 0));
    let vidaWidth = map(this.vida, 0, 2, 0, barraWidth);
    rect(this.x - (barraWidth - vidaWidth) / 2, barraY, vidaWidth, barraHeight);
  }

  mover() {
    if (!this.ativa) return;

    // Aplica velocidade base do inimigo mais o bônus calculado pela pontuação
    let bonus = 0;
    if (typeof getBonusVelocidadeInimigos === "function") {
      try {
        bonus = getBonusVelocidadeInimigos();
      } catch (e) {
        bonus = 0;
      }
    }

    this.x += this.velocidade + bonus;

    // Movimento vertical suave
    this.y += sin(frameCount * 0.1) * 0.5;

    // Se o inimigo sair da tela, reposiciona
    if (this.x > width + 50) {
      this.reposicionar();
    }
  }

  reposicionar() {
    this.x = -50;
    this.y = random(50, height - 50);
    this.ativa = true;
    this.vida = this.#tipo === "forte" ? 2 : 1;
  }

  atirar() {
    if (!this.ativa) return null;

    let agora = millis();

    // Verifica se pode atirar baseado no intervalo
    if (agora - this.#ultimoTiro > this.intervaloTiro) {
      this.#ultimoTiro = agora;

      // Cria uma bala na posição do canhão do inimigo
      let balaX = this.x + this.largura / 2;
      let balaY = this.y;

      return new BalaInimiga(balaX, balaY);
    }

    return null;
  }

  receberDano() {
    this.vida--;
    if (this.vida <= 0) {
      this.ativa = false;
      return true; // Inimigo derrotado
    }
    return false; // Ainda tem vida
  }

  getHitbox() {
    return super.getHitbox();
  }
}
