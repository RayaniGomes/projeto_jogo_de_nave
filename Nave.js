// Classe Nave herda de EntidadeGame (Herança)
class Nave extends EntidadeGame {
  // Atributos privados (#)
  #vidaMaxima;
  #invencivel;
  #tempoInvencibilidade;

  constructor(x, y, cor) {
    // Chama construtor da classe pai (super) - Polimorfismo
    super(x, y, 30, 20, cor);

    // Inicializa atributos privados
    this.#vidaMaxima = Config.getVidasMaximas();
    this.#invencivel = false;
    this.#tempoInvencibilidade = 0;

    // Atributos públicos
    this.velocidade = Config.getVelocidadePadrao();
    this._vida = 3; // Protected (convenção)
  }

  // Getter para vida
  get vida() {
    return this._vida;
  }

  // Setter para vida com limite máximo
  set vida(valor) {
    this._vida = GameUtils.limitar(valor, 0, this.#vidaMaxima);
  }

  // Getter para invencibilidade
  get invencivel() {
    return this.#invencivel;
  }

  // Setter para invencibilidade
  set invencivel(valor) {
    this.#invencivel = valor;
    if (valor) {
      this.#tempoInvencibilidade = millis() + Config.getTempoInvencibilidade();
    }
  }

  // Override do método show (Polimorfismo)
  show() {
    // Pisca quando está invencível
    if (this.#invencivel && floor(millis() / 200) % 2 === 0) {
      return;
    }

    // Chama método da classe base se existisse
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
    circle(this.x - 8, this.y, 6);

    // Asas
    fill(this.cor);
    rect(this.x - 5, this.y - this.altura / 2 - 5, 10, 5);
    rect(this.x - 5, this.y + this.altura / 2, 10, 5);
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

  // Adiciona vida (usado por power-up)
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

  // Override do método getHitbox (Polimorfismo)
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
