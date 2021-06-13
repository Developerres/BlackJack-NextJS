import View from './view.js';
import 'regenerator-runtime/runtime';

class ModalView extends View {
  _parentElement = document.querySelector('.modal-container');
  _window = document.querySelector('.modal');
  _btnOpen = document.querySelector('.btn-round-history');
  _btnLeaderBoard = document.querySelector('.btn-leader-board');
  _btnClose = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');

  _generateMarkup() {
    if (this._data == null || this._data[0] == null) {
      return `
        <div class="badge">There are no Data to View yet!</div>
      `;
    }

    if (this._data[0].round === 0) {
      const dataSorted = [...this._data];

      dataSorted.sort((a, b) => b.deposite - a.deposite);

      return `
      ${dataSorted
        .map(el => {
          return `<div class="modal-content badge"><div class="modal-content__table">${el.date}</div><div class="modal-content__table">${el.deposite}</div></div>`;
        })
        .join('')}
       
    `;
    }
    if (this._data[0].round != 0) {
      return `
      ${this._data
        .map(el => {
          return `
          <div class="modal-content badge">
        <div class="modal-content__table"><p>Round: ${
          el.round - 1
        }</p><p>Deposite: ${el.deposite}</p><p>${el.gameResult}</p></div>
        <div class="modal-content__table">${el.playerCode
          .map(elem => {
            return `<img src="https://deckofcardsapi.com/static/img/${elem}.png">`;
          })
          .join('')} </div>
          <div class="modal-content__table">${el.playerScore} : ${
            el.dealerScore
          }</div>
        <div class="modal-content__table">${el.dealerCode
          .map(elem => {
            return `<img src="https://deckofcardsapi.com/static/img/${elem}.png">`;
          })
          .join('')}</div>
        </div>
        `;
        })
        .join('')}`;
    }
  }

  addHandlerRoundHistory(handler) {
    this._btnOpen.addEventListener('click', handler);
  }

  addHandlerLeaderBoard(handler) {
    this._btnLeaderBoard.addEventListener('click', handler);
  }

  addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden-modal');
    this._window.classList.toggle('hidden-modal');
  }
}

export default new ModalView();
