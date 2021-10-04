const { ipcRenderer } = require("electron");

const newItemForm = document.querySelector("#new-item-form");
const newItemSubmitBtn = newItemForm.querySelector("#new-item-submit");

const newItemMarqueInput = newItemForm.querySelector("#item-marques");
const newItemModelInput = newItemForm.querySelector("#item-model");
const newItemAnneeInput = newItemForm.querySelector("#item-year");
const newItemPrixInput = newItemForm.querySelector("#item-price");

////////////////////////// Check inputs part ///////////////////////////
function onInputCheckValue() {
  newItemSubmitBtn.hidden = !(
    newItemMarqueInput !== "" &&
    newItemModelInput !== "" &&
    !isNaN(newItemAnneeInput.value) &&
    newItemAnneeInput.value > 0 &&
    newItemPrixInput !== ""
  );
}

newItemMarqueInput.addEventListener("input", onInputCheckValue);
newItemModelInput.addEventListener("input", onInputCheckValue);
newItemAnneeInput.addEventListener("input", onInputCheckValue);
newItemPrixInput.addEventListener("input", onInputCheckValue);

////////////////////////// Check inputs part ///////////////////////////
function onSubmitNewItemForm(e) {
  // Stop the normal behavior
  e.preventDefault();

  const newItem = {
    marques: newItemMarqueInput.value,
    model: newItemModelInput.value,
    year: newItemAnneeInput.value,
    price: newItemPrixInput.value,
  };

  ipcRenderer.invoke("new-item", newItem).then((resp) => {
    const msgDiv = document.querySelector("#response-message");
    msgDiv.innerText = resp;
    msgDiv.hidden = false;

    // Re-hide the div after 1.5sec to make it tmp
    setTimeout(() => {
      msgDiv.innerText = "";
      msgDiv.hidden = true;
    }, 1500);

    // Reset the form and hide again the submit btn
    e.target.reset();
    newItemSubmitBtn.hidden = true;
  });
}

newItemForm.addEventListener("submit", onSubmitNewItemForm);
