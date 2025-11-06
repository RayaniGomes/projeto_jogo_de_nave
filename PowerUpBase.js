class PowerUpBase {
  constructor(x, y, tamanho, cor) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.cor = cor;
    this.ativa = true;
    this.rotacao = 0;
  }

  // Movimento base
  mover() {
    this.x -= 1;
    this.rotacao += 0.05;

    if (this.x < -50) {
      this.ativa = false;
    }
  }

  // Retorna hitbox
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      raio: this.tamanho / 2
    };
  }
}

