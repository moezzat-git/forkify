import * as model from './model';
import recipeView from './views/recipeView';
import recipeSearch from './views/recipeSearch';
import results from './views/resultsViews';
import pagination from './views/paginationView';
import bookmarkView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const getRecipe = async function () {
  try {
    const id = window.location.hash.replace('#', '');

    if (!id) return;
    //1. load spinner
    recipeView.renderSpinner();

    results.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmark);

    //get data from model
    await model.loadRecipe(id);
    const { recipe } = model.state;
    //render data from view
    recipeView.render(recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const getSearchResult = async function () {
  try {
    results.renderSpinner();
    const query = recipeSearch.getQuery();
    if (!query) return;

    recipeSearch.clearInput();

    await model.searchRecipe(query);

    results.render(model.getSearchResultPage());
    pagination.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const paginationHandler = function (page) {
  results.render(model.getSearchResultPage(page));
  pagination.render(model.state.search);
};

const updateServing = function (serve) {
  model.updateRecipe(serve);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  const { recipe } = model.state;
  if (!recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmark);
};

const uploadRecipe = async function (data) {
  addRecipeView.renderSpinner();
  await model.uploadRecipe(data);

  recipeView.render(model.state.recipe);
  bookmarkView.render(model.state.bookmark);
  addRecipeView.renderMessage();
  setTimeout(addRecipeView._toggleWindow(), 2500);
};

const welcome = () => console.log('Welcome to my website');

//Subscriber
const init = function () {
  bookmarkView.addHandlerLoad(controlBookmarks);
  recipeView.addHandlerRender(getRecipe);
  recipeView.addHandlerServing(updateServing);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  recipeSearch.addHandlerSearch(getSearchResult);
  pagination.addHandlerPagination(paginationHandler);
  addRecipeView.addHandlerUpload(uploadRecipe);
  welcome();
};

init();
// window.addEventListener('hashchange', getRecipe);
// window.addEventListener('load', getRecipe);
