const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let homeWindow;
let newItemWindow;

const cars = [
    {
        id: 1,
        marques: "BMW",
        model: "M3",
        year: "2021",
        price: "100000 € TTC",
    },
    {
        id: 2,
        marques: "Audi",
        model: "A4",
        year: "2020",
        price: "34000 € TTC",
    },
    {
        id: 3,
        marques: "Mercedes",
        model: "C300",
        year: "2020",
        price: "416000 € TTC",
    },
    {
        id: 4,
        marques: "Toyota",
        model: "Corolla",
        year: "2020",
        price: "19600 € TTC",
    },
    {
        id: 5,
        marques: "Nissan",
        model: "GTR",
        year: "2020",
        price: "111000 € TTC",
    },
    {
        id: 6,
        marques: "Honda",
        model: "Civic",
        year: "2020",
        price: "600000 € TTC",
    },
    {
        id: 7,
        marques: "Mazda",
        model: "3",
        year: "2020",
        price: "25100 € TTC",
    },
    {
        id: 8,
        marques: "Mitsubishi",
        model: "Lancer",
        year: "2020",
        price: "11600 € TTC",
    },
    {
        id: 9,
        marques: "Suzuki",
        model: "Swift",
        year: "2020",
        price: "15790 € TTC",
    },
];

function createWindow(viewName, dataToSend, width=1400, height=1200){
    //Create the browser window
    const win = new BrowserWindow({
        width,
        height,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname,"preload.js")
        },
    });

    // and load the home.html of the app
    win.loadFile(path.join(__dirname,"views",viewName, viewName +".html"))
        .then(() => {
                win.send("init-data", cars);
    })

    //Only for debugging phases
    // Show every time u launch the app the dev tools
    // win.webContents.openDevTools();
    return win;
}

app.whenReady().then(() => {
    homeWindow = createWindow('home', cars);
})

// Stuff for MacOS
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        homeWindow = createWindow('home',cars);
    }
});

///////////////////////// New Item window listeners /////////////////////////////
ipcMain.on('open-new-item-window', (e,data) =>{
    if (newItemWindow){
        newItemWindow.focus();
        return;
    }

    newItemWindow = createWindow('new-item',null,1000,700);

    ipcMain.handle('new-item',(e,newItem) => {
        let id = 1;

        // Create an id for the new item
        if (cars.length > 0){
            // Select the last element of the array
            // Then select the id and add 1 to it
            id = cars[cars.length - 1].id + 1;
        }
        newItem.id = id;

        // Push the new item into the selected array
        cars.push(newItem);

        // Send the array to the home view

        homeWindow.send('new-item-added', {
            item: [newItem],
            type: data.type,
            cars
        })

        // Send a response
        return 'Item ajouté avec succès ✔️'
    })
    newItemWindow.on('closed', () => {
        newItemWindow = null;
        ipcMain.removeHandler('new-item')
    })
});
