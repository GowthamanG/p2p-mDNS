const electron = require('electron');
const {ipcRenderer} = electron;
window.$ = window.jQuery = require("jquery");


let thisPeerHostName = '';
let thisPeerIp = '';

setInterval(updateTable, 2000);


function updateTable() {
    ipcRenderer.send('Peers');
    ipcRenderer.send('MyPeer');
}

ipcRenderer.on('MyPeer', function (e, item) {
    thisPeerHostName = item.hostname;
    thisPeerIp = item.ip;
});

ipcRenderer.on('Peers', function (e, item) {

    for (let i = 0; i < item.length; i++) {
        if($('#tablePeers').text().indexOf(item[i].hostname) !== -1) {
            break;
        }
        else {

            let td_hostname = $("<td></td>").text(item[i].hostname);
            let td_ipAdress = $("<td></td>").text(item[i].ip);

            if (thisPeerHostName === item[i].hostname && thisPeerIp === item[i].ip) {
                td_hostname.css("background-color", "Aquamarine");
                td_ipAdress.css("background-color", "Aquamarine");
            }

            $("#tablePeers").append($("<tr></tr>").append(td_hostname, td_ipAdress));
        }

    }
});
