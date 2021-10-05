const { ipcRenderer } = require("electron");
let cbEditedItem;

let editedItem;
let isEditionModeActivated = false; //Edition mode not activated by default


function generateRowLine(tbodyId, data) {
  const tbody = document.querySelector("#" + tbodyId);
  data.forEach((item) => {
    const tr = document.createElement("tr");
    const thId = document.createElement("th");

    thId.scope = "row";
    thId.innerText = item.id;

    //console.log(item);
    const tdMarque = document.createElement("td");
    tdMarque.innerText = item.marques;

    const tdModel = document.createElement("td");
    tdModel.innerText = item.model;

    const tdYear = document.createElement("td");
    tdYear.innerText = item.year;

    const tdPrice = document.createElement("td");
    tdPrice.innerText = item.price;

    const tdButtons = document.createElement("td");
    tdButtons.hidden = !isEditionModeActivated;

    const editBtn = document.createElement("button");
    editBtn.innerText = "Modifier";
    editBtn.classList.add("btn", "btn-outline-warning", "mx-2");
    editBtn.addEventListener('click',()=>{

      ipcRenderer.send('open-edit-item-window',{
        id: item.id,
        type: tbodyId.split('-')[0]
      });

      // Delete the last cb on the "edited-item" listener
      if (cbEditedItem){
        ipcRenderer.removeListener('edited-item',cbEditedItem);
        cbEditedItem = null;
      }

      ipcRenderer.on('edited-item',(e,data) =>{
        tdMarque.innerText = data.item.marques;
        tdModel.innerText = data.item.model;
        tdYear.innerText = data.item.year;
        tdPrice.innerText = data.item.price;

      });

    })

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Supprimer";
    deleteBtn.classList.add("btn", "btn-outline-danger", "mx-2");
    deleteBtn.addEventListener('click',() => {
      ipcRenderer.invoke('show-confirm-delete-item', {
        id: item.id
      })
          .then(resp => {
            if (resp.choice){
              tr.remove();
            }
          })
    });

    //id, marques, model, year , price
    tdButtons.append(editBtn,deleteBtn);
    tr.append(thId, tdMarque, tdModel, tdYear, tdPrice, tdButtons);
    tbody.appendChild(tr);
  });
}

////////////////////// Init data ///////////////////////////////////
ipcRenderer.on("init-data", (e, data) => {
  //console.log(data);
  generateRowLine("cars-table", data);
});

////////////////////// Event Listener ///////////////////////////////////
//add-car
function onClickAddNewItem(e) {
  ipcRenderer.send("open-new-item-window", {
    type: e.target.id.split("-")[1],
  });
}

document.querySelector("#add-car").addEventListener("click", onClickAddNewItem);

///////////////////// Received //////////////////////////////
ipcRenderer.on("new-item-added", (e, data) => {
  generateRowLine("cars-table", data.item);
});

////////////////////////////// TOGGLE EDITION MODE LISTENER ///////////////////////////////
ipcRenderer.on('toggle-edition-mode',() => {

  isEditionModeActivated = !isEditionModeActivated;

  const trTheads = document.querySelectorAll('thead tr');
  trTheads[0].lastElementChild.hidden = !trTheads[0].lastElementChild.hidden;

  const trTBody = document.querySelectorAll('tbody tr');
  trTBody.forEach(tr => tr.lastElementChild.hidden = !tr.lastElementChild.hidden);


  // Example if we assign a class to all element to hidden
  // const elemsToHide = document.querySelectorAll('.action');
  // elemsToHide.forEach(item => item.hidden = !item.hidden);

});