
export default class Tun {

	constructor (name) {
		this.name = name;
		this.state = "connected";
		this.destination = "Italy";
		this.vpnconfig = "config.ovpn";
		this.enabled = false;
	}
}
