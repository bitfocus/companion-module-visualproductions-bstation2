let tcp           = require('../../tcp');
let actions       = require('./actions');
let instance_skel = require('../../instance_skel');
let debug;
let log;

class instance extends instance_skel {

	constructor(system, id, config) {
		super(system, id, config)
		this.release_time = 20; // ms to send button release
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
				switch(message.toString()) {
					case 'core-bu-0=On':
						this.system.emit('log', 'bstation', 'info', 'Button 1 pressed');
						if(!!this.config.button1Bank && !!this.config.button1Button) {
							this.press_button(this.config.button1Bank, this.config.button1Button)
						}
						break;
					case 'core-bu-1=On':
						this.system.emit('log', 'bstation', 'info', 'Button 2 pressed');
						if(!!this.config.button2Bank && !!this.config.button2Button) {
							this.press_button(this.config.button2Bank, this.config.button2Button)
						}
						break;
					case 'core-bu-2=On':
						this.system.emit('log', 'bstation', 'info', 'Button3 pressed');
						if(!!this.config.button3Bank && !!this.config.button3Button) {
							this.press_button(this.config.button3Bank, this.config.button3Button)
						}
						break;
					case 'core-bu-3=On':
						this.system.emit('log', 'bstation', 'info', 'Button 4 pressed');
						if(!!this.config.button4Bank && !!this.config.button4Button) {
							this.press_button(this.config.button4Bank, this.config.button4Button)
						}
						break;
					case 'core-bu-4=On':
						this.system.emit('log', 'bstation', 'info', 'Button 5 pressed');
						if(!!this.config.button5Bank && !!this.config.button5Button) {
							this.press_button(this.config.button5Bank, this.config.button5Button)
						}
						break;
					case 'core-bu-5=On':
						this.system.emit('log', 'bstation', 'info', 'Button 6 pressed');
						if(!!this.config.button6Bank && !!this.config.button6Button) {
							this.press_button(this.config.button6Bank, this.config.button6Button)
						}
						break;
				}
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
			},
			{
				type: 'text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: `Config which button on the streamdeck you want to control with the B-Station`
			},
			{
				type: 'textinput',
				id: 'button1Bank',
				label: 'Button 1 Bank',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button1Button',
				label: 'Button 1 Button',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button2Bank',
				label: 'Button 2 Bank',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button2Button',
				label: 'Button 2 Button',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button3Bank',
				label: 'Button 3 Bank',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button3Button',
				label: 'Button 3 Button',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button4Bank',
				label: 'Button 4 Bank',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button4Button',
				label: 'Button 4 Button',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button5Bank',
				label: 'Button 5 Bank',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button5Button',
				label: 'Button 5 Button',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button6Bank',
				label: 'Button 6 Bank',
				width: 2
			},
			{
				type: 'textinput',
				id: 'button6Button',
				label: 'Button 6 Button',
				width: 2
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

	press_button(bank, button) {
		bank = parseInt(bank);
		button = parseInt(button);

		this.system.emit('log', 'bstation', 'info', `Push button ${bank}.${button}`);
		this.system.emit('bank_pressed', bank, button, true);

		setTimeout(() => {
			this.system.emit('bank_pressed', bank, button, false);
			this.system.emit('log', 'bstation', 'info', `Release button ${bank}.${button}`);
		}, this.release_time);
	}

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
