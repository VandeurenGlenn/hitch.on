import {Socket} from 'net';

export default class Client {
	constructor() {
		this.socket = new Socket();
	}

	start(port, host) {
		console.log(port);
		this.socket.connect(port, host, () => {
			// this.write('client-ready');
			// this.write('client-desktop', )
		});


		this.socket.on('error', err => {
			console.error(err);
		});

		this.socket.on('data', event => {
			var ev = JSON.parse(event.toString());
			if (ev.type && ev.type === 'stream') {
				document.dispatchEvent(new CustomEvent('capturer-update', {detail: ev.detail}))
			}
			// client.end(); // kill client after server's response
		});

		this.socket.on('close', () => {
			console.log('Connection closed');
		});
	}

	write(data) {
		this.socket.write(data);
	}

	stream(data) {

	}

}
