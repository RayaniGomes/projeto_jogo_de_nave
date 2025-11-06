function TextoFlutuante(x, y, texto, cor, tamanho = 20) {
  this.x = x;
  this.y = y;
  this.texto = texto;
  this.cor = cor;
  this.tamanho = tamanho;
  this.vida = 60;
  this.velocidade = -2;
  this.ativa = true;

  this.atualizar = function () {
    this.y += this.velocidade;
    this.vida--;

    if (this.vida <= 0) {
      this.ativa = false;
    }
  };

  this.show = function () {
    if (!this.ativa) return;

    let alpha = map(this.vida, 60, 0, 255, 0);
    fill(red(this.cor), green(this.cor), blue(this.cor), alpha);
    textSize(this.tamanho);
    textAlign(CENTER, CENTER);
    text(this.texto, this.x, this.y);
  };
}
