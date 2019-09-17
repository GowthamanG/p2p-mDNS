const os = require('os');
const addr = require('network-address');

class Peer {

    constructor(hostname, ip){
        this.hostname = hostname.toString();
        this.ip = ip.toString();
    }

    updateHostname(hostname){

        if (this.hostname !== hostname)
            this.hostname = hostname.toString();
    }

    updateIp(ip){

        if(this.ip !== ip)
            this.ip = ip.toString();
    }
}

let peers = [];
let thisPeer = new Peer(os.hostname(), addr.ipv4());
peers.push(thisPeer);

module.exports = {

    getPeers: function(){
        return peers;
    },

    getThisPeer: function(){
        return thisPeer;
    },

    discover: function(mdns) {

        mdns.query([{
            name: thisPeer.hostname,
            type: 'A',
        }]);

        mdns.respond([{
            name: thisPeer.hostname,
            type: 'A',
            ttl: 300,
            data: thisPeer.ip
        }]);

        mdns.on('response', function (response) {

            if(response.answers[0].name !== thisPeer.hostname) {

                for (let i = 0; i < peers.length; i++) {
                    let currentPeer = peers[i];

                    if(currentPeer.hostname !== response.answers[0].name && currentPeer.ip !== response.answers[0].data){
                        let new_Peer = new Peer(response.answers[0].name, response.answers[0].data);
                        peers.push(new_Peer);
                    }else if (currentPeer.hostname === response.answers[0].name && currentPeer.ip !== response.answers[0].data) {
                        currentPeer.ip = response.answers[0].data;
                        peers[i] = currentPeer;
                    } else if (currentPeer.hostname !== response.answers[0].name && currentPeer.ip === response.answers[0].data) {
                        currentPeer.hostname = response.answers[0].name;
                        peers[i] = currentPeer;
                    }
                }
            }

            console.log(peers);
            console.log(peers.length);

        });
    },

    stopPeerdiscovery: function(mdns){
        mdns.destroy();
    }

};
/*
function getPeers(){
    return peers;
}

function createNameRandomly(name){
    let randomNumber = (Math.random() * 20) + 1;

    return name.toString().replace('.local', '_' + randomNumber + '.local');

}


function updatePeersData(){

    thisPeer.updateIp(addr.ipv4());

    peers.forEach(value => {
       mdns.query(value().hostname.toString(), 'SRV');

       mdns.on('query', function(query){
           if(query.address.toString() !== value().ip.toString())
               value.updateIp(query.address.toString());
       })
    });
}
*/