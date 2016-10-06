
import * as Shell from './mockshell.js';
import { Tuns } from '../imports/api/tuns.js';

const net = require('net');


export class OpenVpnConnectionManager {

	constructor (tunName, vpnconfig) {
		this.tunName = tunName;
		this.vpnconfig = vpnconfig;

		this.mgmt = null;
	}

	connect() {

		console.log("Connecting " + this.tunName + " using " + this.vpnconfig);

		// Shell out connection
		let socket = "/dev/openvpn-" + this.tunName;
		Shell.connectTunnel(this.tunName, this.vpnconfig, socket)

		// Connect to mgmt server
		mgmt = net.connect({path: socket});
		// TODO Wrap env
		mgmt.on('data', Meteor.bindEnvironment((data) => {
			console.log("Got data: " + data);

            // Succesfully connected
            if (data.toString().indexOf('>UPDOWN:UP') !== -1) {
                Tuns.update({name: this.tunName}, {$set: {state: "connecting"}});
            }

            // Error
            if (data.toString().indexOf('ERROR: ') !== -1) {
            	// TODO Handle error (auto reconnect?)
                console.log("mgmt client reported error");
            }

		}));

		mgmt.on('end', Meteor.bindEnvironment(function() {
            console.log("mgmt client session ended");
            // TODO Handle error
        }));

        mgmt.on('error', Meteor.bindEnvironment(function() {
            console.log('Error connecting to control socket');
            // TODO Handle error
            // May also throw if write happens while disconnected
        }));

		// Update tunnel document
		Tuns.update({name: this.tunName}, {$set: {state: "connecting"}});

	}

	disconnect() {

		console.log("Disconnecting " + this.tunName);

		Tuns.update({name: this.tunName}, {$set: {state: "disconnecting"}});

		// Kill via mgmt server
		mgmt.write("signal SIGTERM\n");

		// Disconnect mgmt server
		if(mgmt)
			mgmt.end();

		// TODO Block until process is dead

		// Update tunnel document
		Tuns.update({name: this.tunName}, {$set: {state: "disconnected"}});

	}


}

