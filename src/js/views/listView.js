import {elements} from './base';

export const renderList = list => {
    const markup = 
    `
    <li  class="shopping__item" data-itemid=${list.id}>
        <div class="shopping__count">
            <input type="number" value="${list.count}" step="${list.count}" class="shopping__count-value">
            <p>${list.unit}</p>
        </div>
        <p class="shopping__description">${list.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;

    elements.shopping.insertAdjacentHTML('afterbegin', markup);
};


export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid=${id}]`);
    item.parentElement.removeChild(item);
};