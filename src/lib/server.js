const {createServer} = require('net');
const ngrok = require('ngrok');
import Events from 'events';
import findOpenPort from './connection/find-open-port';

export default class Server extends Events {
	constructor(opts) {
		super();
		findOpenPort().then((port) => {
			this.port = port;
		});
		// this.options = opts || {port: 1337, ip: '127.0.0.1'};
	}

	start() {
		return new Promise((resolve, reject) => {
			if (!this.port) {
				findOpenPort().then((port) => {
					this.port = port;
					this.connect(port).then((url) => {
						resolve(url);
					});
				});
			} else {
				this.connect(this.port).then((url) => {
					resolve(url);
				});
			}
		});
	}

	connect(port, ip) {
		if (ip === undefined) {
			ip = '127.0.0.1';
		}

		return new Promise((resolve, reject) => {
			try {
				this.server = createServer((socket, err) => {
					this.socket = socket;
					// this.emit('client-ready');
				  document.dispatchEvent(new CustomEvent('client-ready'));
					socket.pipe(socket);
				});
			} catch (e) {
				reject(err);
			}

			this.server.on('data', (err, data) => {
				console.log('error: ' + err);
				console.log('data: ' + data);
			});

			this.server.listen(port, ip);

			ngrok.connect({proto: 'tcp', addr: port}, (err, url) => {
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
}
