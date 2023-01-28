import bulmaCollapsible from "./dependencies/bulmaCollapsible.js";
import bulmaModal from "./dependencies/bulmaModal.js";
import newRecipeCard from "./templates.js";

(function() {
    const FETCH_URL = "http://localhost:3000/recipes";

    const _id = (id) => document.getElementById(id);

    let recipes;

    function parseIngredients(ingredients) {
        return ingredients.split(/[\r\n]+/).map((el) => {
            let ingredient = {};
            let values = el.split(",");
            ingredient.name = values[0].trim();
            if (values.length > 1) {
                ingredient.quantity = values[1].trim();
            }
            return ingredient;
        });
    }

    function newRecipe(id = null) {
        let recipe = Object.fromEntries(new FormData(_id(id ? `editForm${id}` : "createForm")));
        return Object.assign(recipe, { ingredients: parseIngredients(recipe.ingredients) });
    }

    function displayRecipes(recipes) {
        let recipesContainer = _id("recipes");
        recipesContainer.innerHTML = "";
        for (let recipe of recipes) {
            recipesContainer.appendChild(newRecipeCard(recipe));
            let id = recipe.id;
            _id(`deleteSubmit${id}`).addEventListener("click", () => deleteRecipe(id));
            _id(`editSubmit${id}`).addEventListener("click", (evt) => {
                evt.preventDefault();
                editRecipe(id);
            });
        }
        bulmaModal();
        bulmaCollapsible.attach('.is-collapsible');
    }

    async function getRecipes() {
        return fetch(FETCH_URL)
            .then((res) => res.json());
    }

    async function addRecipe() {
        let recipe = newRecipe();
        fetch(FETCH_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        })
        .then((res) => res.json())
        .then((newRecipe) => {
            recipes.push(newRecipe);
            _id("createForm").reset();
            displayRecipes(recipes);
        })
        .catch(console.error);
    }

    async function editRecipe(id) {
        let recipe = newRecipe(id);
        fetch(`${FETCH_URL}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        })
        .then((res) => res.json())
        .then((updatedRecipe) => {
            let idx = recipes.findIndex((recipe) =>
                recipe.id === id
            );
            recipes[idx] = updatedRecipe;
            displayRecipes(recipes);
        })
        .catch(console.error);
    }

    async function deleteRecipe(id) {
        fetch(`${FETCH_URL}/${id}`, {
            method: "DELETE",
        })
        .then(() => {
            recipes = recipes.filter((recipe) =>
                recipe.id !== id
            );
            displayRecipes(recipes);
        })
        .catch(console.error);
    }

    const init = async function() {
        let loaded = false;
        getRecipes()
            .then((data) => {
                recipes = data;
                displayRecipes(recipes);
                loaded = true;
            })
            .then(() => {
                _id("createSubmit").addEventListener("click", (evt) => {
                    evt.preventDefault();
                    addRecipe();
                });
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setTimeout(() => {
                    _id("loading").classList.add("is-hidden");
                    let display = loaded ? "loaded" : "error";
                    _id(display).classList.remove("is-hidden");
                }, 400);
            });
    }

    document.addEventListener("DOMContentLoaded", init);
})();
