// Classe Bala herda de BalaBase (Herança)
class Bala extends BalaBase {
  // Atributo privado
  #tipoArma;

  constructor(x, y, tipo = "jogador", tipoArma = "basica") {
    // Configurações baseadas no tipo e arma
    let config = Bala.#getConfigBala(tipo, tipoArma);

    // Chama construtor da classe pai (super) - Polimorfismo
    super(x, y, config.raio, config.velocidade, config.direcao);

    // Inicializa atributo privado
    this.#tipoArma = tipoArma;

    // Atributos públicos
    this.tipo = tipo;
    this.cor = config.cor;
    this.corBrilho = config.corBrilho;
  }

  // Método estático privado para configuração
  static #getConfigBala(tipo, tipoArma) {
    const configs = {
      jogador: {
        basica: {
          raio: 3,
          velocidade: 8,
          direcao: -1,
          cor: color(255, 255, 0),
          corBrilho: color(255, 200, 0, 150)
        },
        rapida: {
          raio: 4,
          velocidade: 12,
          direcao: -1,
          cor: color(100, 255, 255),
          corBrilho: color(50, 200, 255, 150)
        },
        dupla: {
          raio: 3,
          velocidade: 8,
          direcao: -1,
          cor: color(255, 150, 0),
          corBrilho: color(255, 100, 0, 150)
        }
      },
      inimigo: {
        basica: {
          raio: 3,
          velocidade: 6,
          direcao: 1,
          cor: color(255, 50, 50),
          corBrilho: color(255, 0, 0, 150)
        }
      }
    };

    const tipoConfig = configs[tipo] || configs.jogador;
    return tipoConfig[tipoArma] || tipoConfig.basica;
  }

  // Getter para tipo de arma
  get tipoArma() {
    return this.#tipoArma;
  }

  // Setter para tipo de arma
  set tipoArma(valor) {
    if (["basica", "rapida", "dupla"].includes(valor)) {
      this.#tipoArma = valor;
    }
  }

  // Override do método show (Polimorfismo)
  show() {
    if (this.ativa) {
      fill(this.cor);
      circle(this.x, this.y, this.raio * 2);

      // Efeito de brilho
      fill(this.corBrilho);
      circle(this.x, this.y, this.raio * 1.5);
    }
  }

  // Override do método automove (Polimorfismo)
  automove() {
    // Chama método da classe pai usando super
    super.automove();
  }

  // Override do método getHitbox (Polimorfismo)
  getHitbox() {
    // Usa super para obter hitbox base
    return super.getHitbox();
  }
}

// Classe BalaInimiga herda de BalaBase (Herança)
class BalaInimiga extends BalaBase {
  constructor(x, y) {
    // Chama construtor da classe pai (super)
    super(x, y, 3, 6, 1); // raio, velocidade, direcao

    // Atributos específicos
    this.cor = color(255, 50, 50);
    this.corBrilho = color(255, 0, 0, 150);
  }

  // Override do método show
  show() {
    if (this.ativa) {
      fill(this.cor);
      circle(this.x, this.y, this.raio * 2);

      fill(this.corBrilho);
      circle(this.x, this.y, this.raio * 1.5);
    }
  }
}
