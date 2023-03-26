const { InstanceBase, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const { GetActions } = require('./actions')
const { GetFeedbacks } = require('./feedbacks')

class instance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async configUpdated(config) {
		this.config = config
		if (this.tcp !== undefined) {
			this.tcp.destroy()
			delete this.tcp
		}

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}
		this.init_tcp()
	}

	async init(config) {
		this.config = config
		this.buttonState = {
			'1': false,
			'2': false,
			'3': false,
			'4': false,
			'5': false,
			'6': false,
		}

		this.setActionDefinitions(GetActions(this))
		this.setFeedbackDefinitions(GetFeedbacks(this))
		this.init_tcp()
	}

	init_tcp() {
		if (this.tcp !== undefined) {
			this.tcp.destroy()
			delete this.tcp
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host !== undefined) {
			this.tcp = new TCPHelper(this.config.host, this.config.port)

			this.tcp.on('error', (err) => {
				debug('Network error', err)
				this.updateStatus(InstanceStatus.UnknownError, err)
				this.log('error', 'Network error: ' + err.message)
			})

			// If we get data, thing should be good
			this.tcp.on('data', (message) => {
				switch (message.toString()) {
					case 'core-bu-0=On':
						this.log('info', 'Button 1 pressed')
						this.buttonState['1'] = true
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-0=Off':
						this.log('info', 'Button 1 Released')
						this.buttonstate['1'] = false
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-1=On':
						this.log('info', 'Button 2 pressed')
						this.buttonState['2'] = true
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-1=Off':
						this.log('info', 'Button 2 Released')
						this.buttonstate['2'] = false
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-2=On':
						this.log('info', 'Button 3 pressed')
						this.buttonState['3'] = true
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-2=Off':
						this.log('info', 'Button 3 Released')
						this.buttonstate['3'] = false
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-3=On':
						this.log('info', 'Button 4 pressed')
						this.buttonState['4'] = true
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-3=Off':
						this.log('info', 'Button 4 Released')
						this.buttonstate['4'] = false
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-4=On':
						this.log('info', 'Button 5 pressed')
						this.buttonState['5'] = true
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-4=Off':
						this.log('info', 'Button 5 Released')
						this.buttonstate['5'] = false
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-5=On':
						this.log('info', 'Button 6 pressed')
						this.buttonState['6'] = true
						this.checkFeedbacks('buttonsActive')
						break
					case 'core-bu-5=Off':
						this.log('info', 'Button 6 Released')
						this.buttonstate['6'] = false
						this.checkFeedbacks('buttonsActive')
						break
				}
				this.updateStatus(InstanceStatus.Ok)
			})

			this.tcp.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: `This module controls the B-Station2. Use Triggers and feedback to create an action based on which button is pressed`,
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 2,
				default: 7000,
				regex: this.REGEX_PORT,
			},
		]
	}

	// When module gets deleted
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		if (this.tcp !== undefined) {
			this.tcp.destroy()
		}

		debug('destroy', this.id)
	}

	action(action) {
		let cmd

		function c_to_rgb(c) {
			let b = c % 256,
				g_0 = (c % 65536) - b,
				r_0 = c - g_0 - b,
				g = g_0 / 256,
				r = r_0 / 65536

			return '#' + r.toString(16) + g.toString(16) + b.toString(16)
		}
	}
}

runEntrypoint(instance, [])
