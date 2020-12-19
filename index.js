let tcp           = require('../../tcp');
let actions       = require('./actions');
let instance_skel = require('../../instance_skel');
let debug;
let log;

class instance extends instance_skel {

	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...actions,
		});

		this.actions()
	}

	actions(system) {
		this.setActions(this.getActions());
	}

	updateConfig(config) {
		this.config = config

		if (this.tcp !== undefined) {
			this.tcp.destroy();
			delete this.tcp;
		}

		if (this.socket !== undefined) {
			this.socket.destroy();
			delete this.socket;
		}
		this.init_tcp();
	};

	init() {
		debug = this.debug;
		log = this.log;

		this.init_tcp();
	};

	init_tcp() {
		if (this.tcp !== undefined) {
			this.tcp.destroy();
			delete this.tcp;
		}

		this.status(this.STATE_WARNING, 'Connecting');

		if (this.config.host !== undefined) {
			this.tcp = new tcp(this.config.host, this.config.port);

			this.tcp.on('error', (err) => {
				debug("Network error", err);
				this.status(this.STATE_ERROR, err);
				this.log('error', "Network error: " + err.message);
			});

			// If we get data, thing should be good
			this.tcp.on('data', (message) => {
				console.log(message.toString());
				this.status(this.STATE_OK);
			});

			this.tcp.on('status_change', (status, message) => {
				this.status(status, message);
			});
		}
	};

	// Return config fields for web config
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: `This module controls the B-Station2 buttons`
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 2,
				default: 7000,
				regex: this.REGEX_PORT
			}
		]
	};

	// When module gets deleted
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy();
		}

		if (this.tcp !== undefined) {
			this.tcp.destroy();
		}

		debug("destroy", this.id);;
	};

	action(action) {
		let cmd;

		function c_to_rgb(c) {
			let b = c % 256,
				g_0 = (c % 65536 - b),
				r_0 = c - g_0 - b,
				g = g_0 / 256,
				r = r_0 / 65536;

			return "#" + r.toString(16) + g.toString(16) + b.toString(16);
		}

		switch (action.action) {

			case 'send':
				cmd = unescape(action.options.id_send);
				break;

			case 'blink':
				cmd = `core-blink`;
				break;

			case 'buttonLED':
				cmd = `core-ld-${action.options.button}=${action.options.onOff}.0`;
				break;

			case 'buttonLEDColor':
				cmd = `core-ld-${action.options.button}=${c_to_rgb(action.options.color)}`;
				break;
		}

		let sendBuf = Buffer.from(cmd + '\n', 'latin1');

		if (sendBuf != '') {
			this.tcp.send(sendBuf);
		}
	}
}

exports = module.exports = instance;
