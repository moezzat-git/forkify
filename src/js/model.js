import { API_URL, RESULT_PER_PAGE, API_KEY } from './config';
import { getJson, sendJson } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}`);

    let { recipe } = data.data;
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      imageUrl: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      serving: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title,
    };

    if (state.bookmark.find(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
  } catch (err) {
    throw err;
  }
};

export const searchRecipe = async function (query) {
  try {
    state.search.query = query;

    const res = await fetch(`${API_URL}?search=${query}`);
    const data = await res.json();

    state.search.results = data.data.recipes.map(rec => ({
      id: rec.id,
      imageUrl: rec.image_url,
      publisher: rec.publisher,
      title: rec.title,
    }));
    console.log(data);
    state.search.page = 1;
  } catch (err) {
    console.log(err);
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateRecipe = function (data) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * data) / state.recipe.serving)
  );

  state.recipe.serving = data;

  console.log(state.recipe);
};

const persistBookmark = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  recipe.bookmarked = true;
  persistBookmark();
};

export const removeBookmark = function (recipe) {
  state.bookmark = state.bookmark.filter(rec => rec.id !== recipe.id);
  recipe.bookmarked = false;
  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};

init();

// localStorage.clear('Bookmark');

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJson(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    console.log(state.recipe);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
