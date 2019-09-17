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

module.exports = {

    getPeers: function(){
        return peers;
    },

    getThisPeer: function(){
        return thisPeer;
    },

    discover: function(mdns) {

        mdns.query({
            questions: [{
                name: 'discover',
                type: 'SRV'
            },{
                name: 'discover',
                type: 'A'

            }]
        });

        mdns.respond({
            answers: [{
                name: 'discover',
                type: 'SRV',
                data: {
                    target: thisPeer.hostname
                }
            }, {
                name: 'discover',
                type: 'A',
                data: thisPeer.ip
            }]

        });

        mdns.on('response', function (response) {

            if (response.answers[0].name === 'discover' && response.answers[1].name === 'discover') {

                if (peers.length === 0)
                    peers.push(new Peer(response.answers[0].data.target, response.answers[1].data));
                else {


                    for (let i = 0; i < peers.length; i++) {
                        let currentPeer = peers[i];

                        if (currentPeer.hostname !== response.answers[0].data.target.toString() && currentPeer.ip !== response.answers[1].data.toString()) {
                            let new_Peer = new Peer(response.answers[0].data.target, response.answers[1].data);
                            peers.push(new_Peer);
                        } else if (currentPeer.hostname === response.answers[0].data.target.toString() && currentPeer.ip !== response.answers[1].data.toString()) {
                            currentPeer.ip = response.answers[1].data.toString();
                            peers[i] = currentPeer;
                        } else if (currentPeer.hostname !== response.answers[0].data.target.toString() && currentPeer.ip === response.answers[1].data.toString()) {
                            currentPeer.hostname = response.answers[0].data.target.toString();
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
