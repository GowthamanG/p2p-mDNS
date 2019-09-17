const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;
const peerDiscovery = require('./peerDiscovery');
const multicastdns = require('multicast-dns');

let win;
let appClosed = false;

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
        appClosed = true;
    }
});

app.on('activate', () => {
    if(win == null){
        createWindow();
    }
});


let mdns = multicastdns();

ipcMain.on('Peers', function(event){
    peerDiscovery.discover(mdns);
    event.reply('Peers', peerDiscovery.getPeers());
});

if(appClosed)
    peerDiscovery.stopPeerdiscovery(mdns);
