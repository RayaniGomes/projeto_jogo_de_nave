// Classe VidaExtra herda de PowerUpBase (Herança)
class VidaExtra extends PowerUpBase {
  // Atributos privados
  #pulso;
  #coletada;

  constructor(x, y) {
    // Chama construtor da classe pai (super) - Polimorfismo
    super(x, y, 30, color(255, 50, 50));

    // Inicializa atributos privados
    this.#pulso = 0;
    this.#coletada = false;

    // Partículas
    this.particulas = [];
    this.criarParticulas();
  }

  // Getter para estado de coleta
  get coletada() {
    return this.#coletada;
  }

  // Setter para estado de coleta
  set coletada(valor) {
    this.#coletada = valor;
  }

  // Método privado para criar partículas
  criarParticulas() {
    for (let i = 0; i < 8; i++) {
      this.particulas.push({
        angulo: (TWO_PI / 8) * i,
        distancia: random(15, 20),
        velocidade: random(0.02, 0.04),
      });
    }
  }

  // Override do método show (Polimorfismo)
  show() {
    if (!this.ativa || this.#coletada) return;

    push();
    translate(this.x, this.y);
    rotate(this.rotacao);

    // Efeito de pulso
    this.#pulso += 0.1;
    let escala = 1 + sin(this.#pulso) * 0.2;

    // Desenha coração
    fill(this.cor);
    noStroke();

    let tamanhoEscalado = (this.tamanho / 2) * escala;
    this.desenharCoracao(0, 0, tamanhoEscalado);

    // Desenha partículas brilhantes
    for (let particula of this.particulas) {
      particula.angulo += particula.velocidade;
      let px = cos(particula.angulo) * particula.distancia;
      let py = sin(particula.angulo) * particula.distancia;

      fill(255, 100, 100, 200);
      circle(px, py, 4);
    }

    // Brilho ao redor
    fill(255, 50, 50, 50);
    circle(0, 0, this.tamanho * escala * 1.5);

    pop();
  }

  desenharCoracao(x, y, tamanho) {
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

  // Override do método mover - move em direção à nave
  mover(naveX, naveY) {
    // Calcula direção para a nave
    if (naveX !== undefined && naveY !== undefined) {
      let dx = naveX - this.x;
      let dy = naveY - this.y;
      let distancia = dist(this.x, this.y, naveX, naveY);

      // Normaliza o vetor de direção
      if (distancia > 0) {
        let velocidade = 2.5; // Velocidade de movimento em direção à nave
        this.x += (dx / distancia) * velocidade;
        this.y += (dy / distancia) * velocidade;
      }
    } else {
      // Fallback: se não receber posição da nave, move para esquerda (comportamento padrão)
      super.mover();
    }

    // Rotação
    this.rotacao += 0.05;

    // Atualiza partículas
    for (let particula of this.particulas) {
      particula.angulo += particula.velocidade;
    }

    // Remove se sair muito fora da tela
    if (
      this.x < -50 ||
      this.x > width + 50 ||
      this.y < -50 ||
      this.y > height + 50
    ) {
      this.ativa = false;
    }
  }

  // Override do método coletar
  coletar(nave) {
    if (!this.#coletada && nave.adicionarVida()) {
      this.#coletada = true;
      this.ativa = false;
      return true;
    }
    return false;
  }

  // Override do método getHitbox
  getHitbox() {
    // Usa super para obter hitbox base
    return super.getHitbox();
  }
}
