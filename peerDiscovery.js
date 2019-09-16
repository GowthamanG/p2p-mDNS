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
            type: 'A'
        }]);

        mdns.on('query', function(query){
            if(query.questions[0].name !== thisPeer.hostname && query.questions.type === 'A'){
                mdns.respond([{
                    name: thisPeer.hostname,
                    type: 'A',
                    data: thisPeer.ip
                }]);
            }
        });

        mdns.on('response', function (response) {

            let new_Peer = new Peer(response.answers[0].name, response.answers[0].data);

            if(response.answers[0].name !== thisPeer.hostname) {
                if (peers.includes(new_Peer) === false) {
                    peers.push(new_Peer);
                } else {
                    for (let i = 0; i < peers.length; i++) {
                        let currentPeer = peers[i];

                        if (currentPeer.hostname === response.answers[0].name && currentPeer.port !== response.answers[0].data) {
                            currentPeer.port = response.answers[0].data;
                            peers[i] = currentPeer;
                        } else if (currentPeer.hostname !== response.answers[0].name && currentPeer.port === response.answers[0].data) {
                            currentPeer.hostname = response.answers[0].name;
                            peers[i] = currentPeer;
                        }
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