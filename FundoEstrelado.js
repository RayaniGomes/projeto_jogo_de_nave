// Sistema de fundo estrelado dinâmico
class FundoEstrelado {
  constructor(numEstrelas = 100) {
    this.estrelas = [];

    for (let i = 0; i < numEstrelas; i++) {
      this.estrelas.push({
        x: random(width),
        y: random(height),
        tamanho: random(1, 3),
        velocidade: random(0.5, 2),
        brilho: random(100, 255)
      });
    }
  }

  atualizar() {
    for (let estrela of this.estrelas) {
      estrela.x -= estrela.velocidade;

      // Efeito de brilho pulsante
      estrela.brilho += sin(frameCount * 0.1 + estrela.x) * 5;

      // Reposiciona quando sai da tela
      if (estrela.x < 0) {
        estrela.x = width;
        estrela.y = random(height);
      }
    }
  }

  show() {
    // Fundo gradiente
    for (let y = 0; y < height; y++) {
      let inter = map(y, 0, height, 0, 1);
      let c = lerpColor(color(0, 0, 50), color(0, 0, 20), inter);
      stroke(c);
      line(0, y, width, y);
    }

    // Desenha estrelas
    noStroke();
    for (let estrela of this.estrelas) {
      fill(255, constrain(estrela.brilho, 100, 255));
      circle(estrela.x, estrela.y, estrela.tamanho);

      // Efeito de brilho extra para estrelas maiores
      if (estrela.tamanho > 2) {
        fill(255, 50);
        circle(estrela.x, estrela.y, estrela.tamanho * 2);
      }
    }
  }

  resetar() {
    for (let estrela of this.estrelas) {
      estrela.x = random(width);
      estrela.y = random(height);
    }
  }
}

