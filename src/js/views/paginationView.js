import icons from 'url:../../img/icons.svg';
import View from './view';

class Pagination extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      if (!e.target.closest('.btn--inline')) return;
      console.log(e.target.closest('.btn--inline').dataset.goto);
      handler(e.target.closest('.btn--inline').dataset.goto);
    });
  }

  _generateMarkup() {
    const curPage = +this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    console.log(numPages, curPage);
    if (curPage === 1 && numPages > 1) {
      return `<button class="btn--inline pagination__btn--next" data-goto = "${
        curPage + 1
      }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    if (curPage > 1 && numPages > curPage)
      return `<button class="btn--inline pagination__btn--prev" data-goto = "${
        curPage - 1
      }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button class="btn--inline pagination__btn--next" data-goto = "${
            curPage + 1
          }">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    if (curPage === numPages && numPages > 1)
      return `<button class="btn--inline pagination__btn--prev" data-goto = "${
        curPage - 1
      }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;

    return '';
  }
}

export default new Pagination();
