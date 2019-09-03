const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;
const peerDiscovery = require('./peerDiscovery');
const os = require('os');


let win;
let mdns = new peerDiscovery();


function createWindow(){
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');

    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}


/*
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[   //Same devtools as the chrome has
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();

                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
*/


app.on('ready', createWindow); //Listen for app to be ready

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();

    }
});

app.on('activate', () => {
    if(win == null){
        createWindow();
    }
});

mdns.listen().on('new_hostname', (found_hostnames) => {
    console.log('found_hostnames', found_hostnames)
    // -- MORE CODE Here !

    // --!
});



