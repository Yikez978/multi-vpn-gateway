
const Future = Npm.require("fibers/future");
const exec = Npm.require("child_process").exec;
const fs = require('fs');
const countries = require("i18n-iso-countries");

function shell(cmd){
      var future=new Future();
      var command=cmd;
      exec(command,function(error,stdout,stderr){
        if(error){
          console.log(error);
          throw new Meteor.Error(500,command+" failed");
        }
        future.return(stdout.toString());
      });
      return future.wait();
} 


function parseLeases(str){
	return str.match(/[^\r\n]+/g).map(l => { 
			return {
				ip: l.split(" ")[2], 
				hostname: l.split(" ")[3]
			}
		});
}



function getClients(){
	let leases = shell("cat /var/lib/misc/dnsmasq.leases");
	return parseLeases(leases);
}

function getVpnConfigs(){

	let files = fs.readdirSync('/home/joern/apps/nordvpn/nordvpn-configs').filter(f => f.endsWith(".ovpn"));
	let configs = files.map(f => {
		let servername = f.split(".")[0];
		let a2 = servername.substring(0,2);
		let country = countries.getName(a2, "en") + " #" + servername.match(/\d+/) + " (" + f.match(/(tcp)|(udp)/)[0] + ")";
		contry = country || a2;
		return {
			name: servername,
			destination: country,
			vpnconfig: f
		}});

	return configs;
}

function connectTunnel(tun, config, socket){
	console.log("Connecting " + tun + " using " + config);
}

function disconnectTunnel(tun){
	console.log("Disconnecting " + tun);
}

function routeClient(ip, tun){
	console.log("Updating firewall rules to point " + ip + " to " + tun);
}

function unrouteClient(ip){
	console.log("Updating firewall rules to point " + ip + " to defaut gateway");
}


export { getClients, getVpnConfigs , connectTunnel, disconnectTunnel};
