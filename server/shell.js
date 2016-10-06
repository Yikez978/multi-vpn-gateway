

function parseLeases(str){
	return str.match(/[^\r\n]+/g).map(l => { 
			return {
				ip: l.split(" ")[2], 
				hostname: l.split(" ")[3]
			}
		});
}



function getClients(){

	// cat /var/lib/misc/dnsmasq.leases

	let leasesMock = "1469811963 6c:40:08:a7:cc:9c 10.0.2.103 joern-mbpr-2 01:6c:40:08:a7:cc:9c\n"
		+ "1469814906 04:69:f8:79:1a:9c 10.0.2.145 Stine-sin-iPad 01:04:69:f8:79:1a:9c";


	return parseLeases(leasesMock);

}

function getVpnConfigs(){
  return [{name: "italy4", destination: "Italy", vpnconfig: "configfile1.ovpn"},
    {name: "sweeden4", destination: "Sweeden", vpnconfig: "configfile2.ovpn"},
    {name: "usa4", destination: "USA", vpnconfig: "configfile3.ovpn"},
    {name: "latviator4", destination: "Latvia (tor)", vpnconfig: "configfile4.ovpn"},
    {name: "malta3", destination: "Malta", vpnconfig: "configfile6.ovpn"},
    {name: "norway4", destination: "Norway", vpnconfig: "configfile5.ovpn"}];
}

function connectTunnel(tun, config){
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
