import Events from 'events';
import findOpenPort from './connection/find-open-port';

const {createServer} = require('net');
const ngrok = require('ngrok');
const robot = require('robotjs');

// import IoServer from './servers/io-server';

export default class Server extends Events {
	constructor(opts) {
		super();
		this._handleSocketData = this._handleSocketData.bind(this);
		this._handleServerError = this._handleServerError.bind(this);
		// this.options = opts || {port: 1337, ip: '127.0.0.1'};
	}

	start() {
		return new Promise((resolve, reject) => {
			if (this.port) {
				this.connect(this.port).then((url) => {
					resolve(url);
				});
			} else {
				findOpenPort().then((port) => {
					this.port = port;
					this.connect(port).then((url) => {
						resolve(url);
					});
				});
			}
		});
	}

	stop() {
		if (this.ngrokActive) {
			ngrok.disconnect();
			this.server.close();
		}
	}

	connect(port, ip) {
		if (!this.ip && ip !== this.ip) {
			this.ip = ip || '127.0.0.10';
		}

		if (!this.port && port !== this.port) {
			this.port = port || '1234';
		}

		return new Promise((resolve, reject) => {
			try {
				this.server = createServer((socket, err) => {
					this.socket = socket;

					this.socket.on('data', this._handleSocketData);
				  document.dispatchEvent(new CustomEvent('client-ready'));
					// socket.pipe(this.socket);
				});

				// this.io = new IoServer(this.server);
			} catch (e) {
				reject(err);
			}

			this.server.on('error', this._handleServerError);

			this.server.listen(this.port, this.ip);

			ngrok.connect({proto: 'tcp', addr: this.port}, (err, url) => {
				if (err) {
					reject(err);
					return;
				}
				this.ngrokActive = true;
				resolve(url);
			});
		});
	}

	/**
	 * writes data to the client.
	 *
	 * @arg {string} type a custom string to catch on the other side
	 * @arg {object} data the data given as an object
	 */
	post(type, data) {
		this.socket.write(JSON.stringify({type: type, detail: data}));
	}

	_handleSocketData(data) {
		let json = {};
		try {
			json = data.toString();
			json = JSON.parse(json);
		} catch (e) {
			console.log(data);
		}
		if (json) {
			if (typeof json === 'string') {
				let match = json.match(/\{(.*?)\}\}/g) || json.match(/\{(.*?)\}/g);
				for (let obj of match) {
					obj = JSON.parse(obj);
					// disable mouse control untill fixed
					// robot.moveMouseSmooth(obj.data.movementX, obj.data.movementY);
				}
			} else {
				// disable mouse control untill fixed
				// robot.moveMouseSmooth(json.data.movementX, json.data.movementY);
			}
		}
	}

	_handleServerError(event) {
		if (event.code == 'EADDRINUSE') {
			console.log(this.ip + ':' + this.port + ': Already in use, retrying...');
			setTimeout(() => {
				this.server.close();
				this.server.listen(this.port, this.ip);
			}, 1000);
		}
	}
}
