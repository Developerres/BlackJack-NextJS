import View from './view.js';
import 'regenerator-runtime/runtime';
import cardBack from 'url:../../images/back.png';

class DealView extends View {
  _parentElement = document.querySelector('.cardplace');

  btnDeal = document.querySelector('.btn-deal');
  btnHit = document.querySelector('.btn-hit');
  btnStand = document.querySelector('.btn-stand');
  btnDoubleDown = document.querySelector('.btn-double-down');

  _generateMarkup() {
    return `<div class="badge topmsg flex">
  
    ${
      this._data.gameResult
        ? `${this._data.gameResult}`
        : `Current bet: <strong>${this._data.bet}</strong>  |  Bank: <strong>${this._data.deposite}</strong>`
    } 
    </div>

    <div class="cards flex">
      <div class="cards-player"> ${this._data.playerCode
        .map((el, index) => {
          return `<img class="card-${index}" src="https://deckofcardsapi.com/static/img/${el}.png">`;
        })
        .join('')}
      </div>
    <div class="cards-dealer">
    ${
      this._data.standClicked
        ? ''
        : `<img class="card-0 card-back" src="${cardBack}">`
    }
     ${this._data.dealerCode
       .map((el, index) => {
         return `<img class="card-${index}" src="https://deckofcardsapi.com/static/img/${el}.png">`;
       })
       .join('')}
      
      </div>
  </div>
  <div class="badge msg">Player has: <strong>${
    this._data.playerScore
  }</strong> ${
      this._data.standClicked
        ? ` and Dealer has: <strong>${this._data.dealerScore}</strong>`
        : ''
    } </div>
    `;
  }

  addHandlerDeal(handler) {
    this.btnDeal.addEventListener('click', handler);
  }
  addHandlerHit(handler) {
    this.btnHit.addEventListener('click', handler);
  }
  addHandlerStand(handler) {
    this.btnStand.addEventListener('click', handler);
  }
  addHandlerDoubleDown(handler) {
    this.btnDoubleDown.addEventListener('click', handler);
  }
}

export default new DealView();
