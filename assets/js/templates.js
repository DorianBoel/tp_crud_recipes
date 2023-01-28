const _ce = (tag) => document.createElement(tag);

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

function editModalTemplate(recipe) {
    let ingredients = recipe.ingredients
        .map((el) => el.name + (el.quantity ? `, ${el.quantity}` : ""))
        .join("\n");
    return `
        <div id="editModal${recipe.id}" class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Modification</p>
                    <button class="delete" aria-label="close"></button>
                </header>
                <div class="is-scroll">
                    <section class="modal-card-body">
                        <form id="editForm${recipe.id}">
                            <div class="field">
                                <label class="label" for="editName${recipe.id}">Nom</label>
                                <div class="control">
                                    <input id="editName${recipe.id}" name="name" class="input" type="text" placeholder="Nom de la recette"required value="${recipe.name}">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label" for="editLink${recipe.id}">Image</label>
                                <div class="control">
                                    <input id="editLink${recipe.id}" name="link" class="input" type="text" placeholder="Lien vers l'image" value="${recipe.link}">
                                </div>
                            </div>
                            <div class="field is-horizontal has-addons field-gap is-align-items-center mt-5">
                                <label class="label mb-0" for="editServings${recipe.id}">Pour</label>
                                <div class="control">
                                    <input id="editServings${recipe.id}" name="servings" class="input is-small" type="number" min="1"required value="${recipe.servings}">
                                </div>
                                <label class="label" for="editServings${recipe.id}">personnes</label>
                            </div>
                            <div class="field">
                                <label class="label" for="editDesc${recipe.id}">Description (200 caractères max)</label>
                                <div class="control">
                                    <textarea id="editDesc${recipe.id}" name="description" class="textarea" placeholder="Description de la recette" maxlength="200">${recipe.description}</textarea>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label" for="editIngredients${recipe.id}">Ingrédients (1 par ligne)</label>
                                <div class="control">
                                    <textarea id="editIngredients${recipe.id}" name="ingredients" class="textarea" placeholder="Oignon, 250 g&#10;Boeuf, 1 kg&#10;Sel&#10;Poivre">${ingredients}</textarea>
                                </div>
                            </div>
                        </form>
                    </section>
                    <footer class="modal-card-foot is-justify-content-end">
                        <button class="button" aria-label="close">Annuler</button>
                        <button id="editSubmit${recipe.id}" class="button is-success">Valider</button>
                    </footer>
                </div>
            </div>
        </div>`;
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
                    <button id="deleteSubmit${id}" class="button is-danger">Supprimer</button>
                </footer>
            </div>
        </div>`;
}

function recipeCardTemplate(recipe) {
    let servings = `<span class="has-text-weight-bold">${recipe.servings}</span> personne${recipe.servings > 1 ? "s" : ""}`;
    return `
        <header class="card-header is-align-items-center is-clipped">
            <p class="card-header-title">
                ${recipe.name}
            </p>
            <button class="card-header-icon button is-info is-inverted js-modal-trigger" data-target="editModal${recipe.id}">
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
                        Pour ${servings}
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
            <div id="ingredientsCollapsible${recipe.id}" class="content is-collapsible mt-3">
                <ul class="mt-0">
                    ${getIngredientList(recipe.ingredients)}
                </ul>
            </div>
        </div>
        ${editModalTemplate(recipe)}
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

export default newRecipeCard;
