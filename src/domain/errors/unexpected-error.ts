export default class UnexpectedError extends Error {
  constructor() {
    super('Algo de inesperado aconteceu. Tente novamente em breve.');
    this.name = 'UnexpectedError';
  }
}
