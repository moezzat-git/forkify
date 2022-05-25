import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _openBtn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');
  _message = 'added successfully';

  constructor() {
    super();
    this._addHandlerOpen();
    this._addHandlerClose();
  }

  _toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpen() {
    this._openBtn.addEventListener('click', this._toggleWindow.bind(this));
  }

  _addHandlerClose() {
    this._closeBtn.addEventListener('click', this._toggleWindow.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)];
      handler(Object.fromEntries(data));
    });
  }
}

export default new AddRecipeView();
