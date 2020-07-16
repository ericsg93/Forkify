import {elements} from './base';

//cuando es una funcion con una linea como esta significa que lo unico que hace es un return 
export const getInput = () => elements.searchInput.value

export const clearInput = () => {
    elements.searchInput.value = '';
};


export const clearResults = () =>{
    elements.searchRestList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};


export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc,cur)=>{
            if(acc+cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);

        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => {

    const markup = `
    <li>
        <a class="results__link " href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="$">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    //position, text
    elements.searchRestList.insertAdjacentHTML('beforeend',markup);
};

//type: 'prev' or 'next'
const createButton = (page,type) => {
    return `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
                <span>Page ${type === 'prev' ? page-1 : page+1}</span>    
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                </svg>
            </button>`
};

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);

    let button;

    if(page === 1 && pages > 1){
        //button to go to next page
        button = createButton(page,'next');
    }else if(page < pages){
        // Both buttons
        button = `
            ${createButton(page,'prev')}
            ${createButton(page,'next')}
        `;
    }
    else if(page === pages && pages > 1){
        //button to go to previous page
        button = createButton(page,'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page
    
    const start = (page-1)*resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(el => {
        renderRecipe(el);
    });

    //render pagination buttons
    renderButtons(page,recipes.length,resPerPage);
};

export const highlightSelected = id => {

    const resultArr = Array.from(document.querySelectorAll('.results__link--active'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}