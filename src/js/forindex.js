
const recipeContainer = document.querySelector('.results');
const recipeDetails = document.querySelector('.recipe');
const searchInput = document.querySelector('.search__field');
const handleItemClick = (event) => {
  const selectedRecipeId = event.currentTarget.getAttribute('data-recipe-id');
  // Call the detailsData function and pass the selected recipe ID
  detailsData(selectedRecipeId);
};

let currentPage = 1;
const recipesPerPage = 5;
let data = [];
let filteredData = [];
let filteredPagination = [];

const showRecipe = async function () {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    data = await res.json();
    filteredData = data; // Set initial filtered data to all recipes

    const renderRecipes = (recipes) => {
      const start = (currentPage - 1) * recipesPerPage;
      const end = currentPage * recipesPerPage;
      const paginatedRecipes = recipes.slice(start, end);

      let markup = '';

      paginatedRecipes.forEach((apidata) => {
        markup += `
          <li class="preview" data-recipe-id="${apidata.id}">
            <a class="preview__link preview__link--active" href="#">
              <figure class="preview__fig">
             
              </figure>
             
              <div class="preview__data">
                <h4 class="preview__title">   ${apidata.id}   ${apidata.title}</h4>
                <p class="preview__publisher">${apidata.body}</p>
              </div>
            </a>
          </li>`;
      });

      recipeContainer.innerHTML = '';
      recipeContainer.insertAdjacentHTML('afterbegin', markup);

      // Add click event listener to each li element
      const liElements = recipeContainer.querySelectorAll('li');
      liElements.forEach((li) => {
        li.addEventListener('click', handleItemClick);
      });
    };

    const applyFilters = () => {
      const searchTerm = searchInput.value.toLowerCase();
      filteredData = data.filter((recipe) => {
        if (searchTerm === '') {
          return true; // Show all recipes if search term is empty
        } else if (recipe.title.toLowerCase().includes(searchTerm)) {
          return true; // Show recipes whose titles include the search term
        }
        return false; // Hide recipes that don't match the search term
      });

      // Update filtered pagination when filters are applied
      const totalFilteredRecipes = filteredData.length;
      const totalFilteredPages = Math.ceil(totalFilteredRecipes / recipesPerPage);
      filteredPagination = Array.from({ length: totalFilteredPages }, (_, index) => index + 1);
    };

    const totalRecipes = data.length;
    const totalPages = Math.ceil(totalRecipes / recipesPerPage);

    applyFilters(); // Apply filters initially
    renderRecipes(filteredData);

    searchInput.addEventListener('input', () => {
      applyFilters();
      currentPage = 1; // Reset to first page when search term changes
      renderRecipes(filteredData);
    });

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next Page';
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages || filteredPagination.length > 0) {
        currentPage++;

        // Check if filtered pagination is available and use it
        if (filteredPagination.length > 0) {
          if (currentPage > filteredPagination.length) {
            currentPage = 1; // Start from the first page after reaching the end
          }
          renderRecipes(filteredData);
        } else {
          renderRecipes(data);
        }
      }
    });

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous Page';
    prevButton.addEventListener('click', () => {
      if (currentPage > 1 || filteredPagination.length > 0) {
        currentPage--;

        // Check if filtered pagination is available and use it
        if (filteredPagination.length > 0) {
          if (currentPage < 1) {
            currentPage = filteredPagination.length; // Start from the last page when reaching the beginning
          }
          renderRecipes(filteredData);
        } else {
          renderRecipes(data);
        }
      }
    });

    const refreshButton = document.createElement('button');
    refreshButton.innerText = 'Refresh Page';
    refreshButton.addEventListener('click', () => {
      location.reload();
    });

    recipeContainer.insertAdjacentElement('afterend', nextButton);
    recipeContainer.insertAdjacentElement('afterend', prevButton);
    recipeContainer.insertAdjacentElement('afterend', refreshButton);
  } catch (err) {
    alert(err);
  }
};

const detailsData = (recipeId) => {
  fetch(`https://jsonplaceholder.typicode.com/posts/${recipeId}`)
    .then((response) => response.json())
    .then((data) => {
      let markupDetails = '';
      markupDetails += `
        <div class="preview" data-recipe-id="${data.id}">
          <div class="preview__data">
            <h4 class="preview__title">${data.title}</h4>
            <p class="preview__publisher">${data.body}</p>
          </div>
        </div>`;
      recipeDetails.innerHTML = '';
      recipeDetails.insertAdjacentHTML('afterbegin', markupDetails);
    })
    .catch((error) => {
      console.log(error);
    });
};

showRecipe();




