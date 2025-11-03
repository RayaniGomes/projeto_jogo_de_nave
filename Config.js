// Configurações do jogo com métodos estáticos
class Config {
  // Método estático 1: Obter configuração de vidas máximas
  static getVidasMaximas() {
    return 5;
  }

  // Método estático 2: Obter intervalo de spawn de power-ups (ms)
  static getIntervaloPowerUp() {
    return 30000; // 30 segundos
  }

  // Método estático 3: Obter velocidade padrão
  static getVelocidadePadrao() {
    return 5;
  }

  // Método estático 4: Obter tempo de invencibilidade
  static getTempoInvencibilidade() {
    return 2000; // 2 segundos
  }

  // Método estático 5: Obter pontuação por tipo de inimigo
  static getPontosPorTipo(tipo) {
    const pontos = {
      basico: 10,
      rapido: 15,
      forte: 25
    };
    return pontos[tipo] || 10;
  }
}

