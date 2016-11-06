import {Socket} from 'net';

export default class Client extends Socket {
	constructor() {
		super();
		this._onServerError = this._onServerError.bind(this);
	}
	start(port) {
		this.socket = this.connect(port, '0.tcp.ngrok.io', () => {
			// this.write('client-ready');
			// this.write('client-desktop', )
		});

		this.socket.on('data', event => {
			console.log(event);
			var ev = JSON.parse(event.toString());
			if (ev.type) {
				let type;
				if (ev.type === 'stream') {
					type = 'capturer-update';
				}
				document.dispatchEvent(new CustomEvent(type, {detail: ev.detail}));
			}
		});

		this.socket.on('close', () => {
			console.log('Connection closed');
		});


		this.socket.on('error', err => {
			console.error(err);
		});
	}

	writeMouse(data) {
		this.socket.write(data);
	}

	stream(data) {

	}

	_onServerError(error) {
		console.log(error);
		this.socket.destroy();
	}

}
