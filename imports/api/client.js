
export default class Client {

	constructor (hostname, ip) {
		this.hostname = hostname;
		this.ip = ip;
		this.tunId = 0;
		this.active = true;
	}
}
