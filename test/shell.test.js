import * as Shell from '../server/shell.js';

describe('Shell', function () {
	it('extracts dhcp clients', function () {
		let clients = Shell.getClients();
		//console.log("got clients: " + JSON.stringify(clients));
	});

	it('extracts nordvpn configuration files', function () {
		let configs = Shell.getVpnConfigs();
		//configs.forEach(f => console.log(f.destination));
	});
});



