import View from './view.js';
import 'regenerator-runtime/runtime';
import coin100 from 'url:../../images/coin100.svg';
import coin50 from 'url:../../images/coin50.svg';
import coin10 from 'url:../../images/coin10.svg';
import coin1 from 'url:../../images/coin1.svg';

class BetView extends View {
  _parentElement = document.querySelector('.cardplace');
  _errorMessage =
    'We could not load cards from the server. Please try Reset the game!';

  btnBetReset = document.querySelector('.btn-deal-reset');
  btnNewGame = document.querySelector('.btn-new-game');
  btnResetGame = document.querySelector('.btn-reset');
  btnSaveGame = document.querySelector('.btn-save');
  btnLoadGame = document.querySelector('.btn-load');

  _generateMarkup() {
    if (
      (this._data.deposite === 0 && this._data.bet === 0) ||
      this._data.round === 6
    ) {
      return `
    <div class="badge topmsg flex">
    Your deposite is: <strong>${
      this._data.deposite
    }</strong>  |  Round: <strong>${this._data.round - 1}</strong></div>
    <div class="roundtitle">Game Over</div>
    `;
    }
    return `
    <div class="badge topmsg flex">
    Current bet: <strong>${this._data.bet}</strong>  |  Bank: <strong>${this._data.deposite}</strong></div>

    <div class="roundtitle">Round ${this._data.round} of 5</div>

    <div class="coin__stack">
      <img src="${coin100}"
        class="coin coin100"
        data-value="100"
      />
      <img src="${coin50}"
        class="coin coin50"
        data-value="50"
      />
      <img src="${coin10}"
        class="coin coin10"
        data-value="10"
      />
      <img src="${coin1}"
        class="coin coin1"
        data-value="1"
      />
    </div>
      `;
  }

  addHandlerNewGame(handler) {
    this.btnNewGame.addEventListener('click', handler);
    this.btnResetGame.addEventListener('click', handler);
  }
  addHandlerSaveGame(handler) {
    this.btnSaveGame.addEventListener('click', handler);
  }
  addHandlerLoadGame(handler) {
    this.btnLoadGame.addEventListener('click', handler);
  }
  addHandlerBet(handler) {
    this._parentElement.addEventListener('click', handler);
  }
  addHandlerBetReset(handler) {
    this.btnBetReset.addEventListener('click', handler);
  }
}

export default new BetView();
