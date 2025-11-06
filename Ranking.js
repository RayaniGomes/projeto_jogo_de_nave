class Ranking {
  static #melhorPontuacao = 0;

  // Método para obter melhor pontuação
  static getMelhorPontuacao() {
    let salvo = localStorage.getItem("melhorPontuacao");
    if (salvo) {
      return parseInt(salvo);
    }
    return this.#melhorPontuacao;
  }

  // Método para salvar melhor pontuação
  static salvarMelhorPontuacao(pontos) {
    let atual = this.getMelhorPontuacao();
    if (pontos > atual) {
      this.#melhorPontuacao = pontos;
      localStorage.setItem("melhorPontuacao", pontos.toString());
      return true; 
    }
    return false;
  }

  // Método para resetar ranking
  static resetarRanking() {
    this.#melhorPontuacao = 0;
    localStorage.removeItem("melhorPontuacao");
  }

  // Método para verificar se é novo recorde
  static eNovoRecorde(pontos) {
    return pontos > this.getMelhorPontuacao();
  }
}

