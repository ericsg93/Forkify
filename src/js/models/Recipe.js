import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try {

            const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
    
        } catch (error) {
            alert("Recipe not found");
        }
    }

    calcTime(){
        //Assuming that FOR EVERY 3 INGREDIENTS WE NEED 15 MINUTES
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    //separar string de ingredientes
    parseIngredients(){

        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitShort, 'kg', 'g'];

        //Uniform units
        const newIngredients = this.ingredients.map(el => {
            let ingrediente = el.toLowerCase();

            unitsLong.forEach((valor,index) => {
                ingrediente = ingrediente.replace(valor,unitShort[index]);
            });

        //Remove parenthesis
        ingrediente = ingrediente.replace(/ *\([^)]*\) */g,' ');

        //Parse ingredients into count, unit and ingredient
        const arrIng = ingrediente.split(' ');
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIngrediente;
        
        if(unitIndex > -1){

        //Existe una unidad de medida en el array
            const arrCount = arrIng.slice(0,unitIndex); // Ex. 4 1/2 cups
            let count;

            if(arrCount.length === 1){
                count = eval(arrCount[0].replace('-','+'));
            }else{
                count = eval(arrCount.slice(0,unitIndex).join('+'));
            }

            objIngrediente = {
                count,
                unit: arrIng[unitIndex],
                ingrediente: arrIng.slice(unitIndex+1).join(" ")
            }

        }else if(parseInt(arrIng[0],10)){
            //el primer dato del array es un numero
            objIngrediente = {
                count: parseInt(arrIng[0],10),
                unit: "",
                ingrediente : arrIng.slice(1).join(" ")
            }

        }else if(unitIndex === -1){
            //No hay una unidad de medida en el array y no hay numero en el primer dato
            objIngrediente = {
                count: 1,
                unit: "",
                ingrediente //,metodo ES6 para decir ingrediente:ingrediente
            }
        }
        
        return objIngrediente;

        });
       
        this.ingredients = newIngredients;
    }


    updateServings(type){
        //Servings
        const newServings = type === 'dec' ? this.servings-1 : this.servings +1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *=  (newServings/this.servings);
        });    

        this.servings = newServings;
        
    }

}