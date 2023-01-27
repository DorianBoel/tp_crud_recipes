import bulmaCollapsible from "./bulmaCollapsible.js";

(function() {
    const FETCH_URL = "http://localhost:3000/recipes";

    const _id = (id) => document.getElementById(id);
    const _ce = (tag) => document.createElement(tag);

    let recipes;

    async function fetchData() {
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
            (ingredient) => `${ingredient.name} - ${ingredient.quantity}${ingredient.unit}`
        );
        list += ingredientsText.join("</li><li>");
        return list + "</li>";
    }

    function recipeCardTemplate(recipe) {
        return  `
        <header class="card-header">
            <p class="card-header-title">
                ${recipe.name}
            </p>
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
            <p>${recipe.description}</p>
            <hr class="mt-auto">
            <a class="has-text-info" href="#ingredients-collapsible${recipe.id}" data-action="collapse">
                <div class="is-flex is-align-items-center">
                    <span>
                        Liste d'ingrédients
                    </span>
                    <span class="icon">
                        <i class="fas fa-angle-right" aria-hidden="true"></i>
                    </span>
                </div>
            </a>
            <div id="ingredients-collapsible${recipe.id}" class="is-collapsible mt-3">
                <ul class="mt-0">
                    ${getIngredientList(recipe.ingredients)}
                </ul>
            </div>
        </div>`;
    }

    function newRecipeCard(recipe) {
        let column = _ce("div");
        let card = _ce("div");
        card.innerHTML = recipeCardTemplate(recipe);
        card.classList.add("card", "is-flex", "is-flex-direction-column");
        column.appendChild(card);
        column.classList.add("column", "is-one-third-tablet", "is-one-quarter-desktop", "is-one-fifth-widescreen", "is-flex");
        return column;
    }

    function displayRecipes(recipes) {
        let recipesContainer = _id("recipes");
        for (let recipe of recipes) {
            recipesContainer.appendChild(newRecipeCard(recipe));
        }
    }

    const init = async function() {
        let loaded = false;
        fetchData()
            .then((data) => {
                recipes = data;
                displayRecipes(recipes);
                loaded = true;
                bulmaCollapsible.attach('.is-collapsible');
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setTimeout(() => {
                    _id("loading").classList.add("is-hidden");
                    let display = loaded ? "recipes" : "error";
                    _id(display).classList.remove("is-hidden");
                }, 400);
            });
    }

    document.addEventListener("DOMContentLoaded", init);
/*
    function getFlagImg(countryCode) {
        return `<img src="https://flagcdn.com/24x18/${countryCode}.png" loading="lazy">`;
    }

    function getTitleContent(agent, unit, year) {
        return `Pays les plus polluants pour le ${agent} (${unit}) en ${year}`;
    }

    function newTableRow(countryData) {
        let tr = _ce("tr");
        let [
            tdFlag,
            tdName,
            tdValue,
            tdPercent
        ] = Array(4).fill().map(() => _ce("td"));
        tdFlag.innerHTML = getFlagImg(countryData.code);
        tdName.innerHTML = countryData.nom;
        tdValue.innerHTML = countryData.valeur;
        tdPercent.innerHTML = countryData.pourcentage;
        for (let td of [tdFlag, tdName, tdValue, tdPercent]) {
            tr.appendChild(td);
        }
        return tr;
    }

    function displayCountryData(countryData) {
        let tBody = _id("tableBody");
        for (let country of countryData) {
            let tr = newTableRow(country);
            tBody.appendChild(tr);
        }
    }

    function validateInputs(minValue, maxValue) {
        let errors = [];
        if (minValue >= maxValue) {
            errors.push("La valeur maximum doit être supérieure à la valeur minimum");
        }
        if (errors.length) {
            throw { validationErrors: errors };
        }
    }

    function displayValidationErrors(validationErrors) {
        _id("errorsMax").innerHTML = "<span>" + validationErrors.join("</span><br><span>") + "</span>";
        _id("max").classList.add("is-danger");
    }

    function filterData() {
        let minInput = _id("min");
        let maxInput = _id("max");
        minInput.classList.remove("is-danger")
        maxInput.classList.remove("is-danger")
        _id("errorsMax").innerHTML = "";
        let minValue = minInput.value || 0;
        let maxValue = maxInput.value || Number.MAX_VALUE;
        try {
            validateInputs(minValue, maxValue);
        } catch(err) {
            displayValidationErrors(err.validationErrors);
            return;
        }
        let filtered = jsonData.pays.filter(
            (el) => minValue <= el.pourcentage && el.pourcentage <= maxValue
        );
        _id("tableBody").innerHTML = "";
        displayCountryData(filtered);
    }
*/
})();
