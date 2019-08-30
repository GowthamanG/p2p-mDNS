const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;
const multicast = require('multicast-dns');


let win;

let mdns = multicast({
    multicast: true,
    port: 5353,
    ip: '224.0.0.251',
    ttl: 255,
    loopback: true,
    reuseAddr: true
});

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
        mdns.destroy();
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
        mdns.destroy();
        app.quit();

    }
});

app.on('activate', () => {
    if(win == null){
        createWindow();
    }
});

mdns.on('response', function(response){
    console.log('got a response packet: ', response);
});

mdns.on('query', function(query){
    console.log('got a query packet: ', query);
});

mdns.query({
    questions:[{
        name: 'MyMacBook.local',
        type: 'A'
    }]
});
