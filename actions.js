const { combineRgb } = require("@companion-module/base")

exports.GetActions = (instance) => {
	const actions = {}

	actions['send'] = {
		name: 'Send Command',
		options: [
			{
				type: 'textinput',
				id: 'id_send',
				label: 'Command:',
				tooltip: 'Use %hh to insert Hex codes',
				default: '',
				width: 6,
			},
		],
		callback: (action) => {
			cmd = action.options.id_send
			let sendBuf = Buffer.from(cmd + '\n', 'latin1')

			if (sendBuf != '') {
				instance.tcp.send(sendBuf)
			}
		},
	}
	actions['blink'] = {
		name: 'Blink B-Station',
		options: [],
		callback: () => {
			cmd = `core-blink`
			let sendBuf = Buffer.from(cmd + '\n', 'latin1')

			if (sendBuf != '') {
				instance.tcp.send(sendBuf)
			}
		},
	}
	actions['buttonLED'] = {
		name: 'LED Button On/Off',
		options: [
			{
				type: 'number',
				id: 'button',
				label: 'Button number',
				default: 1,
				min: 1,
				max: 6,
			},
			{
				type: 'dropdown',
				id: 'onOff',
				label: 'On or Off',
				default: 'On',
				choices: [
					{ id: '1', label: 'On' },
					{ id: '0', label: 'Off' },
				],
			},
		],
		callbck: (action) => {
			cmd = `core-ld-${action.options.button}=${action.options.onOff}.0`
			let sendBuf = Buffer.from(cmd + '\n', 'latin1')
			if (sendBuf != '') {
				instance.tcp.send(sendBuf)
			}
		},
	}
	actions['buttonLEDColor'] = {
		name: 'LED Button Color',
		options: [
			{
				type: 'number',
				id: 'button',
				label: 'Button number',
				default: 1,
				min: 1,
				max: 6,
			},
			{
				type: 'colorpicker',
				id: 'color',
				label: 'Color',
				default: combineRgb(255, 255, 255),
			},
		],
		callback: () => {
			cmd = `core-ld-${action.options.button}=${c_to_rgb(action.options.color)}`
			let sendBuf = Buffer.from(cmd + '\n', 'latin1')
			if (sendBuf != '') {
				instance.tcp.send(sendBuf)
			}
		}
	}

	return actions
}
