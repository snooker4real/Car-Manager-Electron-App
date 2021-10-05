const { ipcRenderer } = require("electron");

const editItemForm = document.querySelector("#edit-item-form");
const editItemSubmitBtn = editItemForm.querySelector("#edit-item-submit");

const editItemMarqueInput = editItemForm.querySelector("#item-marques");
const editItemModelInput = editItemForm.querySelector("#item-model");
const editItemAnneeInput = editItemForm.querySelector("#item-year");
const editItemPrixInput = editItemForm.querySelector("#item-price");

////////////////////////// Check inputs part ///////////////////////////
function onInputCheckValue() {
    editItemSubmitBtn.hidden = !(
        editItemMarqueInput !== "" &&
        editItemModelInput !== "" &&
        !isNaN(editItemAnneeInput.value) &&
        editItemAnneeInput.value > 0 &&
        editItemPrixInput !== ""
    );
}

editItemMarqueInput.addEventListener("input", onInputCheckValue);
editItemModelInput.addEventListener("input", onInputCheckValue);
editItemAnneeInput.addEventListener("input", onInputCheckValue);
editItemPrixInput.addEventListener("input", onInputCheckValue);


////////////////////////// Submit Form part ///////////////////////////
function onSubmiteditItemForm(e) {
    // Stop the normal behavior
    e.preventDefault();

    const editItem = {
        marques: editItemMarqueInput.value,
        model: editItemModelInput.value,
        year: editItemAnneeInput.value,
        price: editItemPrixInput.value,
    };

    ipcRenderer.invoke("edit-item", editItem)
        .then((resp) => {
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
        editItemSubmitBtn.hidden = true;
    });
}

editItemForm.addEventListener("submit", onSubmiteditItemForm);
