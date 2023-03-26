const { combineRgb } = require('@companion-module/base')

const FeedbackId = {
	buttonState:'buttonState',
}

exports.GetFeedbacks = (instance) => {
	const feedbacks = {
		[FeedbackId.buttonState]: {
			type: 'boolean',
			name: 'buttonState',
			description: 'When a button is pressed',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'dropdown',
					label: 'Which button',
					id: 'button',
					default: 1,
					choices: [
						{ id: '1', label: 'Button 1' },
						{ id: '2', label: 'Button 2' },
						{ id: '3', label: 'Button 3' },
						{ id: '4', label: 'Button 4' },
						{ id: '5', label: 'Button 5' },
						{ id: '6', label: 'Button 6' },
					],
				},
			],
			callback: (feedback) => {
				if (instance.buttonState[feedback.options.button] === true) {
					return true
				} else {
					return false
				}
			},
		},
	}

	return feedbacks
}
