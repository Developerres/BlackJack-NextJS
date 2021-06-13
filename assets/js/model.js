import { API_URL, DECK_COUNT } from './config.js';

export const state = {
  deckId: '',
  deposite: 1000,
  startDeposite: 1000,
  bet: 0,
  playerHand: [],
  dealerHand: [],
  playerScore: '',
  dealerScore: '',
  round: 1,
  playerCode: [],
  dealerCode: [],
  standClicked: false,
  dealClicked: false,
  gameResult: '',
};

export const loadDeck = async function () {
  try {
    const response = await fetch(
      `${API_URL}new/shuffle/?deck_count=${DECK_COUNT}`
    );
    const deck = await response.json();
    if (!deck.success)
      throw new Error("Something went wrong! The deck won't load!");
    state.deckId = deck.deck_id;
  } catch (err) {
    console.log("Something went wrong! The deck won't load!");
    throw err;
  }
};

export const loadCards = async function (amount, owner) {
  try {
    const res = await fetch(`${API_URL}${state.deckId}/draw/?count=${amount}`);
    const data = await res.json();
    if (!data.success)
      throw new Error("Something went wrong! The cards won't load!");

    data.cards.map(el =>
      owner === 'playerHand'
        ? state.playerHand.push(el.value) && state.playerCode.push(el.code)
        : state.dealerHand.push(el.value) && state.dealerCode.push(el.code)
    );
  } catch (err) {
    console.log("Something went wrong! The cards won't load!");
    throw err;
  }
};

export const score = function (owner) {
  const scoreArr = owner === 'playerHand' ? state.playerHand : state.dealerHand;

  let scoreSum = scoreArr
    .map(el => {
      if (el.length === 1 || el.length === 2) return +el;
      if (el.length === 3) return 11;
      if (el.length > 3) return 10;
    })
    .reduce((partial_sum, a) => partial_sum + a, 0);

  let scoreArrLength = scoreArr.filter(elem => elem === 'ACE').length;
  while (scoreArrLength > 0 && scoreSum > 21) {
    scoreSum -= 10;
    scoreArrLength -= 1;
  }
  return scoreSum;
};

export const scoring = function () {
  const scoringWin = function () {
    state.gameResult = 'You are WIN';
    state.deposite += Math.round(state.bet * 1.5);
    state.startDeposite = state.deposite;
    state.bet = 0;
  };

  const scoringLose = function () {
    state.gameResult = 'You are Lose';
    state.bet = 0;
    state.startDeposite = state.deposite;
  };

  if (state.playerScore === 21 && state.dealerScore !== 21) scoringWin();
  if (state.playerScore < 21 && state.playerScore > state.dealerScore)
    scoringWin();
  if (
    state.playerScore < 21 &&
    state.dealerScore <= 21 &&
    state.playerScore < state.dealerScore
  )
    scoringLose();
  if (state.playerScore < 21 && state.dealerScore > 21) scoringWin();
  if (state.playerScore > 21 && state.dealerScore <= 21) scoringLose();
  if (state.playerScore === state.dealerScore && state.playerScore < 21) {
    state.gameResult = 'Push';
    state.deposite += state.bet;
    state.startDeposite = state.deposite;
    state.bet = 0;
  }
};

export const hit = async function () {
  await loadCards(1, 'playerHand');
  state.playerScore = score('playerHand');

  if (state.playerScore > 21) scoring();
};

export const stand = async function () {
  state.standClicked = true;
  while (state.dealerScore <= 16) {
    await loadCards(1, 'dealerHand');
    state.dealerScore = score('dealerHand');
  }
  scoring();
};

export const doubleDown = function () {
  state.deposite = state.deposite - state.bet;
  state.bet = state.bet * 2;
};

export const showUI = function (...arg) {
  arg.map(el => el.classList.remove('hidden'));
};

export const hideUI = function (...arg) {
  arg.map(el => el.classList.add('hidden'));
};

export const betReset = function () {
  state.bet = 0;
  state.deposite = state.startDeposite;
};

export const deal = function () {
  state.playerScore = score('playerHand');
  state.dealerScore = score('dealerHand');
  if (state.playerScore === 21) stand();
};

export const resetState = function (stateData) {
  for (const key in state) {
    if (stateData.indexOf(key) != -1) {
      if (typeof state[key] === 'string') {
        state[key] = '';
      }
      if (typeof state[key] === 'number') {
        state[key] = 0;
      }
      if (typeof state[key] === 'object') {
        state[key] = [];
      }
      if (typeof state[key] === 'boolean') {
        state[key] = false;
      }
    }
  }
};

export const gameReset = function () {
  state.deposite = state.startDeposite = 1000;
  state.bet = 0;
  state.round = 1;
};

export const saveRound = function () {
  const roundStorage = localStorage.getItem('round');

  const roundData = roundStorage ? JSON.parse(roundStorage) : [];
  roundData.push({ ...state });
  localStorage.setItem('round', JSON.stringify(roundData));
};

export const loadRound = function () {
  let roundState;
  const roundStorage = localStorage.getItem('round');
  if (roundStorage) roundState = JSON.parse(roundStorage);
  return roundState;
};

export const deleteRoundHistory = function () {
  localStorage.removeItem('round');
};

export const saveLeaderBoard = function () {
  const date = new Date();
  // prettier-ignore
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // prettier-ignore
  const dateGame = (date.getDate() + '').padStart(2, '0') + ' - ' + months[date.getMonth()] + ' - ' + date.getFullYear() + " " + (date.getHours() + '').padStart(2, '0') + " : " + (date.getMinutes() + '').padStart(2, '0');

  const leaderState = {
    date: dateGame,
    deposite: state.deposite,
    round: 0,
  };

  const leaderStorage = localStorage.getItem('leaderBoard');

  const leaderData = leaderStorage ? JSON.parse(leaderStorage) : [];
  leaderData.push(leaderState);
  localStorage.setItem('leaderBoard', JSON.stringify(leaderData));
};

export const loadLeaderBoard = function () {
  let leaderState = { round: 0 };
  const leaderStorage = localStorage.getItem('leaderBoard');
  if (leaderStorage) leaderState = JSON.parse(leaderStorage);

  return leaderState;
};

export const saveGame = function () {
  const roundStorage = localStorage.getItem('round');
  const saveGameRound = roundStorage
    ? JSON.parse(roundStorage)
    : [{ ...state }];

  localStorage.setItem('saveGameRound', JSON.stringify(saveGameRound));
};

const setState = function (stateData) {
  for (const property in state) {
    state[property] = stateData[property];
  }
};

export const loadSavedGame = function () {
  let loadSavedGameData = false;

  const saveGameRound = localStorage.getItem('saveGameRound');

  if (saveGameRound) {
    loadSavedGameData = JSON.parse(saveGameRound);
    localStorage.setItem('round', JSON.stringify(loadSavedGameData));

    const roundHistoryState = [JSON.parse(localStorage.getItem('round'))];
    const loadedState =
      roundHistoryState.flat()[roundHistoryState.flat().length - 1];

    setState(loadedState);
  }

  return loadSavedGameData;
};
