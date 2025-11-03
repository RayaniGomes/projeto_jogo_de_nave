// Classe utilitária com métodos estáticos
class GameUtils {
  // Método estático 1: Calcula distância entre dois pontos
  static calcularDistancia(x1, y1, x2, y2) {
    return dist(x1, y1, x2, y2);
  }

  // Método estático 2: Formata pontuação com zeros à esquerda
  static formatarPontuacao(pontos) {
    return pontos.toString().padStart(6, "0");
  }

  // Método estático 3: Gera cor aleatória
  static gerarCorAleatoria() {
    return color(random(100, 255), random(100, 255), random(100, 255));
  }

  // Método estático 4: Verifica se número está em range
  static estaNoRange(valor, min, max) {
    return valor >= min && valor <= max;
  }

  // Método estático 5: Clamp value
  static limitar(valor, min, max) {
    return constrain(valor, min, max);
  }
}

