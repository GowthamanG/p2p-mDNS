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

let discover = peerDiscovery;

ipcMain.on('Peers', function(event){
    discover.discover(mdns);
    event.reply('Peers', discover.getPeers());
});

ipcMain.on('MyPeer', function(event){
   event.reply('MyPeer', discover.getThisPeer());
});

if(appClosed)
    discover.stopPeerdiscovery(mdns);
