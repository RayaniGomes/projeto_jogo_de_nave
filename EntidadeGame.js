class EntidadeGame {
  constructor(x, y, largura, altura, cor) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
  }

  // Método base para hitbox
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      largura: this.largura,
      altura: this.altura
    };
  }

  // Verifica colisão base
  colidiuCom(objeto) {
    let hitboxThis = this.getHitbox();
    let hitboxObjeto = objeto.getHitbox ? objeto.getHitbox() : objeto;

    if (hitboxObjeto.largura) {
      return (
        hitboxThis.x - hitboxThis.largura / 2 <
          hitboxObjeto.x + hitboxObjeto.largura / 2 &&
        hitboxThis.x + hitboxThis.largura / 2 >
          hitboxObjeto.x - hitboxObjeto.largura / 2 &&
        hitboxThis.y - hitboxThis.altura / 2 <
          hitboxObjeto.y + hitboxObjeto.altura / 2 &&
        hitboxThis.y + hitboxThis.altura / 2 >
          hitboxObjeto.y - hitboxObjeto.altura / 2
      );
    }

    if (hitboxObjeto.raio) {
      let pontoMaisProximoX = constrain(
        hitboxObjeto.x,
        hitboxThis.x - hitboxThis.largura / 2,
        hitboxThis.x + hitboxThis.largura / 2
      );
      let pontoMaisProximoY = constrain(
        hitboxObjeto.y,
        hitboxThis.y - hitboxThis.altura / 2,
        hitboxThis.y + hitboxThis.altura / 2
      );

      let distancia = dist(
        hitboxObjeto.x,
        hitboxObjeto.y,
        pontoMaisProximoX,
        pontoMaisProximoY
      );
      return distancia < hitboxObjeto.raio;
    }

    return false;
  }
}

