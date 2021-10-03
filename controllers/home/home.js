const { ipcRenderer } = require("electron");

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

        //id, marques, model, year , price

        tr.append(thId, tdMarque, tdModel, tdYear, tdPrice);
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
function onClickAddNewItem(e){
    ipcRenderer.send('open-new-item-window', {
        type: e.target.id.split('-')[1]
    })
}

document.querySelector("#add-car").addEventListener('click', onClickAddNewItem)

