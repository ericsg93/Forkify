import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchview from './views/searchView';
import * as recipeview from './views/recipeView';
import * as listview from './views/listview';
import * as likeview from './views/likeview';
import {elements, renderLoader, clearLoader} from './views/base';


/** Global state of the app
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes
 */

const state = {};



//SEARCH CONTROLLER
const controlSearch = async() => {
    //1. Get the query from the view
    const query = searchview.getInput(); 
    
    if(query){
        //2. New search object and add it to state
        state.search = new Search(query);
        
        //3. Prepare UI for results
        searchview.clearInput();
        searchview.clearResults();
        renderLoader(elements.searchRes);

        try {
            
             //4 Search for recipes
            await state.search.getResult();

            //5. Render results on UI
            clearLoader();
            searchview.renderResults(state.search.result);
    
        } catch (error) {
            alert("Something wrong with the search ...");
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){

        searchview.clearResults();
        //numero en base 10
        const goToPage = parseInt(btn.dataset.goto,10);
        searchview.renderResults(state.search.result,goToPage);
    }
});


//RECIPE CONTROLLER
const controlRecipe = async () => {
    //window.location = href de la pantalla, con el hash se concentra solo al #...
    const id = window.location.hash.replace("#",'');
    
    if(id){
        //Prepare the UI for changes
        recipeview.recipeclearResults();
        renderLoader(elements.recipe);

        //Create a new recipe object
        state.recipe = new Recipe(id);

        // Highlight selected search item
        if(state.search){
            searchview.highlightSelected(id);

        }
      
        try {

            // Get the recipe data and parse ingredients
            await state.recipe.getRecipe();
            //console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();


            //Render recipe
            clearLoader();
            recipeview.renderRecipe(state.recipe, state.like.isLiked(id));
            
        } catch (error) {
            alert("Error procesing recipe");
            console.log(error);
        }
       
    }

};

//evento para cambio de # (hash)
//window.addEventListener('hashchange', controlRecipe);
//evento para cuando la pagina carga
//window.addEventListener('load', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));


//LIST CONTROLLER

const controlList = () => {
    //create a new list if there is none yet
    if(!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
       
        const item = state.list.addItem(el.count, el.unit, el.ingrediente);
        listview.renderList(item);
    });
}


//Handling delete list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        
        //delete from state object
        state.list.deleteItem(id);
        
        //delete from UI
        listview.deleteItem(id);
    }else{
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }
    
});

//LIKE CONTROLLER
const controlLike = () => {

    if(!state.like) state.like = new Likes();
    
    const currentID = state.recipe.id;

    if(currentID){

          //User has not liked current recipe
        if(!state.like.isLiked(currentID)){

        //Add like to the state
        const newLike = state.like.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        //Toggle the like button
        likeview.toogleLikeBtn(true);
        
        //Add like to the UI list
        console.log(state.like);
        likeview.renderLike(newLike);

    //User has liked the current recipe
    }else{

        // Remove like to the state
        state.like.deleteLike(currentID);

        //Toggle the light button
        likeview.toogleLikeBtn(false);

        //Remove like from UI list.
        likeview.deleteLike(currentID);

    }

    likeview.toggleLikeMenu(state.like.getNumLikes());

    }
  

};


//Restore liked recipes on page load 
window.addEventListener('load',() =>{
    state.like = new Likes();

    //restore likes
    state.like.readStorage();

    //Toggle like menu button
    likeview.toggleLikeMenu(state.like.getNumLikes());

    //render existing likes
    state.like.likes.forEach(like => likeview.renderLike(like));
});

//Handling recipe button click
elements.recipe.addEventListener('click', e => {
    
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeview.recipeclearResults();
            recipeview.renderRecipe(state.recipe, state.like.isLiked(state.recipe.id));
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeview.recipeclearResults();
        recipeview.renderRecipe(state.recipe, state.like.isLiked(state.recipe.id));
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //add ingredients to shopping list
        controlList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});

