import bulmaCollapsible from "./bulmaCollapsible.js";
import bulmaModal from "./bulmaModal.js";

(function() {
    const FETCH_URL = "http://localhost:3000/recipes";

    const _id = (id) => document.getElementById(id);
    const _ce = (tag) => document.createElement(tag);
    const _qsa = (selector) => document.querySelectorAll(selector);

    let recipes;

    async function getRecipes() {
        return fetch(FETCH_URL)
            .then((res) => res.json());
    }

    function getServingsInfo(num) {
        return `<span class="has-text-weight-bold">${num}</span> personne${num > 1 ? "s" : ""}`;
    }

    function getIngredientList(ingredients) {
        let list = "";
        if (!ingredients.length) {
            return list;
        }
        list += "<li>";
        let ingredientsText = ingredients.map(
            (ingredient) =>
                ingredient.name + (ingredient.quantity ? ` - ${ingredient.quantity}` : "")
        );
        list += ingredientsText.join("</li><li>");
        return list + "</li>";
    }

    function deleteModalTemplate(id) {
        return `
            <div id="deleteModal${id}" class="modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Suppression</p>
                        <button class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        Voulez-vous vraiment supprimer cette recette ?
                    </section>
                    <footer class="modal-card-foot is-justify-content-end">
                        <button class="button" aria-label="close">Annuler</button>
                        <button class="button is-danger" aria-label="delete" data-recipe-id="${id}">Supprimer</button>
                    </footer>
                </div>
            </div>`;
    }

    function recipeCardTemplate(recipe) {
        return `
            <header class="card-header is-align-items-center">
                <p class="card-header-title">
                    ${recipe.name}
                </p>
                <button class="card-header-icon button is-link is-inverted js-modal-trigger" data-target="editModal${recipe.id}">
                    <span class="icon">
                        <i class="fas fa-pen-to-square" aria-hidden="true"></i>
                    </span>
                </button>
                <button class="card-header-icon button is-danger is-inverted js-modal-trigger" data-target="deleteModal${recipe.id}">
                    <span class="icon">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                    </span>
                </button>
            </header>
            <div class="card-image">
                <figure class="image is-4by3 m-0 cover">
                    <img src="${recipe.link}">
                </figure>
            </div>
            <div class="card-content is-flex is-flex-direction-column is-flex-grow-1 pt-2 pr-2">
                <div class="media is-justify-content-end mb-2">
                    <div class="media-right">
                        <p class="subtitle is-size-7 has-text-grey-light">
                            Pour ${getServingsInfo(recipe.servings)}
                        </p>
                    </div>
                </div>
                <p class="mb-2">${recipe.description}</p>
                <hr class="mt-auto">
                <a class="has-text-info" href="#ingredientsCollapsible${recipe.id}" data-action="collapse">
                    <div class="is-flex is-align-items-center">
                        <span>
                            Liste d'ingrédients
                        </span>
                        <span class="icon">
                            <i class="fas fa-angle-right" aria-hidden="true"></i>
                        </span>
                    </div>
                </a>
                <div id="ingredientsCollapsible${recipe.id}" class="is-collapsible mt-3">
                    <ul class="mt-0">
                        ${getIngredientList(recipe.ingredients)}
                    </ul>
                </div>
            </div>
            ${deleteModalTemplate(recipe.id)}
            `;
    }

    function newRecipeCard(recipe) {
        let column = _ce("div");
        let card = _ce("div");
        card.innerHTML = recipeCardTemplate(recipe);
        card.classList.add("card", "is-flex", "is-flex-direction-column", "is-flex-grow-1");
        column.appendChild(card);
        column.classList.add("column", "is-one-third-tablet", "is-one-quarter-desktop", "is-one-fifth-widescreen", "is-flex");
        return column;
    }

    function displayRecipes(recipes) {
        let recipesContainer = _id("recipes");
        recipesContainer.innerHTML = "";
        for (let recipe of recipes) {
            recipesContainer.appendChild(newRecipeCard(recipe));
        }
        for (let el of _qsa("[id^='deleteModal'] button[aria-label='delete']")) {
            el.addEventListener("click", () => deleteRecipe(el.dataset.recipeId));
        }
        bulmaModal();
        bulmaCollapsible.attach('.is-collapsible');
    }

    function newRecipe(name, link, servings, description, ingredientsList) {
        let ingredients = ingredientsList.split(/[\r\n]+/).map((el) => {
            let ingredient = {};
            let values = el.split(",");
            ingredient.name = values[0].trim();
            if (values.length > 1) {
                ingredient.quantity = values[1].trim();
            }
            return ingredient;
        });
        return {
            name,
            servings,
            description,
            link,
            ingredients
        };
    }

    function addRecipe() {
        let name = _id("createName").value;
        let link = _id("createLink").value;
        let servings = _id("createServings").value;
        let desc = _id("createDesc").value;
        let ingredients = _id("createIngredients").value;
        let recipe = newRecipe(name, link, servings, desc, ingredients);
        fetch(FETCH_URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        })
        .then((res) => res.json())
        .then((recipe) => recipes.push(recipe))
        .then(() => {
            _id("createForm").reset();
            displayRecipes(recipes);
        })
        .catch(console.error);
    }

    function deleteRecipe(id) {
        fetch(`${FETCH_URL}/${id}`, {
            method: "DELETE",
        })
        .then((res) => res.json())
        .then(() => {
            recipes = recipes.filter((recipe) => recipe.id.toString() !== id);
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
                _id("createForm").addEventListener("submit", (evt) => {
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
