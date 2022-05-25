import View from './view';
import previewView from './previewView';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;

  addHandlerLoad(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(rec => previewView.render(rec, false)).join(' ');
  }
}

export default new BookmarkView();
