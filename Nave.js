class Nave extends EntidadeGame {
  #vidaMaxima;
  #invencivel;
  #tempoInvencibilidade;

  constructor(x, y, cor) {
    super(x, y, 50, 40, cor);

    this.#vidaMaxima = Config.getVidasMaximas();
    this.#invencivel = false;
    this.#tempoInvencibilidade = 0;

    this.velocidade = Config.getVelocidadePadrao();
    this._vida = 3; // Protected (convenção)
  }

  get vida() {
    return this._vida;
  }

  set vida(valor) {
    this._vida = Config.limitar(valor, 0, this.#vidaMaxima);
  }

  get invencivel() {
    return this.#invencivel;
  }

  set invencivel(valor) {
    this.#invencivel = valor;
    if (valor) {
      this.#tempoInvencibilidade = millis() + Config.getTempoInvencibilidade();
    }
  }

  show() {
    // Pisca quando está invencível
    if (this.#invencivel && floor(millis() / 200) % 2 === 0) {
      return;
    }

    fill(this.cor);

    // Desenha a nave como um triângulo apontando para a esquerda
    triangle(
      this.x,
      this.y - this.altura / 2,
      this.x - this.largura,
      this.y,
      this.x,
      this.y + this.altura / 2
    );

    // Detalhes da nave
    fill(255);
    circle(this.x - 8, this.y, 8);

    // Asas
    fill(this.cor);
    rect(this.x - 5, this.y - this.altura / 2, 20, 7);
    rect(this.x - 5, this.y + this.altura / 2, 20, 7);
  }

  moverParaCima() {
    if (this.y > this.altura / 2 + 10) {
      this.y -= this.velocidade;
    }
  }

  moverParaBaixo() {
    if (this.y < height - this.altura / 2 - 10) {
      this.y += this.velocidade;
    }
  }

  // Método para obter a posição frontal da nave
  getPosicaoFrente() {
    return {
      x: this.x - this.largura,
      y: this.y
    };
  }

  // Adiciona vida 
  adicionarVida() {
    if (this.vida < this.#vidaMaxima) {
      this.vida++;
      return true;
    }
    return false;
  }

  receberDano() {
    if (!this.#invencivel) {
      this.vida--;
      this.invencivel = true;
      return this.vida <= 0;
    }
    return false;
  }

  atualizarInvencibilidade() {
    if (this.#invencivel && millis() > this.#tempoInvencibilidade) {
      this.#invencivel = false;
    }
  }

  // Override do método getHitbox 
  getHitbox() {
    // Usa super para obter hitbox base e adiciona propriedades específicas
    let hitbox = super.getHitbox();
    hitbox.x = this.x;
    hitbox.y = this.y;
    return hitbox;
  }

  // Alias para compatibilidade
  get xNave() {
    return this.x;
  }

  set xNave(valor) {
    this.x = valor;
  }

  get yNave() {
    return this.y;
  }

  set yNave(valor) {
    this.y = valor;
  }
}
