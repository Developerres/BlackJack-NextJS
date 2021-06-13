import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import betView from './views/betView.js';
import dealView from './views/dealView.js';
import modalView from './views/modalView.js';

const newGame = async function () {
  try {
    initGame();
    model.gameReset();
    model.deleteRoundHistory();
  } catch (err) {
    betView.renderError();
  }
};

const initGame = async function () {
  try {
    await model.loadDeck();
    model.resetState([
      'playerHand',
      'dealerHand',
      'playerScore',
      'dealerScore',
      'playerCode',
      'dealerCode',
      'standClicked',
      'dealClicked',
      'gameResult',
    ]);

    model.hideUI(
      dealView.btnHit,
      dealView.btnStand,
      dealView.btnDoubleDown,
      dealView.btnDeal,
      betView.btnBetReset,
      betView.btnNewGame
    );

    await model.loadCards(2, 'playerHand');
    await model.loadCards(2, 'dealerHand');
    betView.render(model.state);

    if (model.state.round === 1) model.deleteRoundHistory();
  } catch (err) {
    betView.renderError();
    console.error(err);
  }
};

const controlBet = function (event) {
  const coinImg = event.target.closest('.coin');
  if (!coinImg) return;
  model.state.bet += +coinImg.dataset.value;
  model.state.deposite -= +coinImg.dataset.value;
  betView.render(model.state);
  model.showUI(dealView.btnDeal, betView.btnBetReset);
};

const controlBetReset = function () {
  model.betReset();

  betView.coinShow();
  betView.render(model.state);

  model.hideUI(dealView.btnDeal, betView.btnBetReset);
};

const controlDeal = function () {
  model.state.round++;
  model.state.dealClicked = true;

  model.deal();

  model.hideUI(betView.btnBetReset, dealView.btnDeal);
  model.showUI(dealView.btnHit, dealView.btnStand);

  if (model.state.bet * 2 <= model.state.bet + model.state.deposite)
    model.showUI(dealView.btnDoubleDown);

  dealView.render(model.state);

  if (model.state.playerScore === 21) controlStand();
};

const controlStand = async function () {
  await model.stand();
  dealView.render(model.state);
  model.hideUI(dealView.btnHit, dealView.btnStand, dealView.btnDoubleDown);

  model.saveRound();

  setTimeout(function () {
    if (model.state.round === 6 || model.state.deposite === 0) {
      betView.render(model.state);
      model.showUI(betView.btnNewGame);
      if (model.state.deposite != 0) model.saveLeaderBoard();
      return;
    }
    initGame();
  }, 2000);
};

const controlHit = async function () {
  model.hideUI(dealView.btnDoubleDown);
  await model.hit();
  dealView.render(model.state);
  if (model.state.playerScore === 21 || model.state.playerScore > 21)
    controlStand();
};

const controlDoubleDown = function () {
  model.doubleDown();
  controlHit();
  controlStand();
};

const controlRoundHistory = function () {
  modalView.toggleWindow();
  modalView.render(model.loadRound());
};

const controlLeaderBoard = function () {
  model.loadLeaderBoard();
  modalView.toggleWindow();
  modalView.render(model.loadLeaderBoard());
};

const controlSaveGame = function () {
  model.saveGame();
};

const controlLoadGame = function () {
  model.loadSavedGame();

  if (model.state.dealClicked === true && model.state.standClicked === true) {
    model.stand();
    dealView.render(model.state);
    model.hideUI(dealView.btnHit, dealView.btnStand, dealView.btnDoubleDown);

    setTimeout(function () {
      if (model.state.round === 6 || model.state.deposite === 0) {
        betView.render(model.state);
        model.showUI(betView.btnNewGame);
        if (model.state.deposite != 0) model.saveLeaderBoard();
        return;
      }
      initGame();
    }, 2000);
  }

  if (model.state.dealClicked === true && model.state.standClicked === false) {
    dealView.render(model.state);
    model.showUI(dealView.btnHit, dealView.btnStand, dealView.btnDoubleDown);
  }

  if (model.state.dealClicked === false && model.state.bet != 0) {
    model.deleteRoundHistory();
    betView.render(model.state);
    model.showUI(dealView.btnDeal, betView.btnBetReset);
    model.hideUI(
      dealView.btnHit,
      dealView.btnStand,
      dealView.btnDoubleDown,
      betView.btnNewGame
    );
  }
  if (model.state.dealClicked === false && model.state.bet === 0) {
    model.deleteRoundHistory();
    betView.render(model.state);
    model.hideUI(
      dealView.btnDeal,
      betView.btnBetReset,
      dealView.btnHit,
      dealView.btnStand,
      dealView.btnDoubleDown,
      betView.btnNewGame
    );
  }
};

const init = function () {
  betView.addHandlerBet(controlBet);
  betView.addHandlerBetReset(controlBetReset);
  betView.addHandlerNewGame(newGame);
  betView.addHandlerSaveGame(controlSaveGame);
  betView.addHandlerLoadGame(controlLoadGame);
  dealView.addHandlerDeal(controlDeal);
  dealView.addHandlerHit(controlHit);
  dealView.addHandlerStand(controlStand);
  dealView.addHandlerDoubleDown(controlDoubleDown);
  modalView.addHandlerRoundHistory(controlRoundHistory);
  modalView.addHandlerLeaderBoard(controlLeaderBoard);
  modalView.addHandlerHideWindow();
};

initGame();

init();

(function () {
  window.onbeforeunload = function (e) {
    controlSaveGame();
    var dialogText = 'Your Game will be save!';
    e.returnValue = dialogText;
    return dialogText;
  };
})();
