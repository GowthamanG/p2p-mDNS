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

        mdns.respond([{
            name: thisPeer.hostname,
            type: 'A',
            data: thisPeer.ip
        }]);

        mdns.on('response', function (response) {

            if (response.answers[0].name !== thisPeer.hostname) {
                if (!peers.includes(new Peer(response.answers[0].name, response.answers[0].data)))
                    peers.push(new Peer(response.answers[0].name, response.answers[0].data));
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