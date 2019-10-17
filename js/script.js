const electron = require('electron');
const {ipcRenderer} = electron;
window.$ = window.jQuery = require("jquery");


let thisPeerHostName = '';
let thisPeerIp = '';

setInterval(updateTable, 2000);


function updateTable() {
    $("#tablePeers").empty();
    ipcRenderer.send('Peers');
    ipcRenderer.send('MyPeer');
}

ipcRenderer.on('MyPeer', function (e, item) {
    thisPeerHostName = item.hostname;
    thisPeerIp = item.ip;
});

ipcRenderer.on('Peers', function (e, item) {

    let th_1 = $("<th></th>").text("Hostname");
    let th_2 = $("<th></th>").text("IPv4 Adress");

    $("#tablePeers").append($("<tr></tr>").append(th_1, th_2));

    for (let i = 0; i < item.length; i++) {

        let tr_hostname = $("<td></td>").text(item[i].hostname);
        let tr_ipAdress = $("<td></td>").text(item[i].ip);

        if (thisPeerHostName === item[i].hostname && thisPeerIp === item[i].ip) {
            tr_hostname.css("background-color", "Aquamarine");
            tr_ipAdress.css("background-color", "Aquamarine");
        }

        $("#tablePeers").append($("<tr></tr>").append(tr_hostname, tr_ipAdress));
    }
});
