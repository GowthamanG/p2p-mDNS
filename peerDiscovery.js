const os = require('os');
const addr = require('network-address');

class Peer {

    constructor(hostname, ip){
        this.hostname = hostname.toString();
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

                    let peerIsInList = false;

                    for (let i = 0; i < peers.length; i++) {
                        let currentPeer = peers[i];

                        if (currentPeer.hostname === response.answers[0].data.target && currentPeer.ip === response.answers[1].data) {
                            peerIsInList = true;
                            break;
                        } else if (currentPeer.hostname === response.answers[0].data.target && currentPeer.ip !== response.answers[1].data) {
                            currentPeer.ip = response.answers[1].data;
                            peers[i] = currentPeer;
                            peerIsInList = true;
                        } else if (currentPeer.hostname !== response.answers[0].data.target && currentPeer.ip === response.answers[1].data) {
                            currentPeer.hostname = response.answers[0].data.target;
                            peers[i] = currentPeer;
                            peerIsInList = true;
                        }
                    }

                    if(peerIsInList === false)
                        peers.push(new Peer(response.answers[0].data.target, response.answers[1].data));
                }
            }
        });
    },

    stopPeerdiscovery: function(mdns){
        mdns.destroy();
    }

};

