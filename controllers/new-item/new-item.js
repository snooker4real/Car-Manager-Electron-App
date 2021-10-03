const { ipcRender } = require('electron');

const newItemForm = document.querySelector("#new-item-form");
const newItemSubmitBtn = newItemForm.querySelector("#new-item-submit");

const newItemMarqueInput = newItemForm.querySelector("#item-marques");
const newItemModelInput = newItemForm.querySelector("#item-model");
const newItemAnneeInput = newItemForm.querySelector("#item-year");
const newItemPrixInput = newItemForm.querySelector("#item-price");

////////////////////////// Check inputs part ///////////////////////////
function onInputCheckValue(){
    newItemSubmitBtn.hidden = !(newItemMarqueInput !== '' && newItemModelInput !== '' && !isNaN(newItemAnneeInput.value) && newItemAnneeInput.value > 0 && newItemPrixInput !== '');
}

newItemMarqueInput.addEventListener('input', onInputCheckValue);
newItemModelInput.addEventListener('input', onInputCheckValue);
newItemAnneeInput.addEventListener('input', onInputCheckValue);
newItemPrixInput.addEventListener('input', onInputCheckValue);

////////////////////////// Check inputs part ///////////////////////////
