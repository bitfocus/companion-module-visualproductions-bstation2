exports.getActions = function () {

	let actions = {}

		actions['send']= {
			label: 'Send Command',
			options: [
				{
					type: 'textinput',
					id: 'id_send',
					label: 'Command:',
					tooltip: 'Use %hh to insert Hex codes',
					default: '',
					width: 6
				}
			]
		}
		actions['blink'] = { label: 'Blink B-Station' }
		actions['buttonLED'] = {
			label: 'LED Button On/Off',
			options: [
				{
					type: 'number',
					id: 'button',
					label: 'Button number',
					default: 1,
					min: 1,
					max: 6
				},
				{
					type: 'dropdown',
					id: 'onOff',
					label: 'On or Off',
					default: 'On',
					choices: [{ id: '1', label: 'On' }, { id: '0', label: 'Off' }]
				}
			]
		}
		actions['buttonLEDColor'] = {
			label: 'LED Button Color',
			options: [
				{
					type: 'number',
					id: 'button',
					label: 'Button number',
					default: 1,
					min: 1,
					max: 6
				},
				{
					type: 'colorpicker',
					id: 'color',
					label: 'Color',
					default: rgb(255, 255, 255)
				}
			]
		}

		return actions;
}