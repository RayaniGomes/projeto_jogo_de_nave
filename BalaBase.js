class BalaBase {
  constructor(x, y, raio, velocidade, direcao) {
    this.x = x;
    this.y = y;
    this.raio = raio;
    this.velocidade = velocidade;
    this.direcao = direcao;
    this.ativa = true;
  }

  // Método base para movimento
  automove() {
    if (this.ativa) {
      this.x += this.velocidade * this.direcao;

      if (this.x < -20 || this.x > width + 20) {
        this.ativa = false;
      }
    }
  }

  // Verifica se está fora da tela
  estaForaDaTela() {
    return this.x < -20 || this.x > width + 20 || !this.ativa;
  }

  // Retorna hitbox circular
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      raio: this.raio
    };
  }
}

