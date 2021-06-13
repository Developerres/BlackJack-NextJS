export default class View {
  _data;

  render(data) {
    this._data = data;
    let markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);

    if (document.querySelector('.coin')) this._coinHide();
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="badge error">
          ${message}
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _coinHide() {
    const coin = document.querySelectorAll('.coin');
    coin.forEach(el => {
      if (el.dataset.value > this._data.deposite) el.classList.add('hidden');
    });
  }

  coinShow() {
    const coin = document.querySelectorAll('.coin');
    coin.forEach(el => el.classList.remove('hidden'));
  }
}
