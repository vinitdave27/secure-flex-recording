import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import VideoComponent from './components/VideoComponent';

const PLUGIN_NAME = 'VideoClientPlugin';

export default class VideoClientPlugin extends FlexPlugin {
	constructor() {
		super(PLUGIN_NAME);
	}

	/**
	 * This code is run when your plugin is being started
	 * Use this to modify any UI components or attach to the actions framework
	 *
	 * @param flex { typeof import('@twilio/flex-ui') }
	 * @param manager { import('@twilio/flex-ui').Manager }
	 */
	async init(flex, manager) {
		flex.TaskChannels.register(
			{
				name: 'video',
				isApplicable: (task) => task.taskChannelUniqueName === 'video',
				icons: {
					list: 'Video',
					main: 'Video',
					active: 'Video',
				},
				capabilities: new Set(['Video']),
				addedComponents: [
					{
						target: 'TaskCanvasTabs',
						options: {
							sortOrder: 0,
							align: 'start',
							if: (props) => props.task.status === 'accepted',
						},
						component: (
							<VideoComponent manager={manager} icon='Video' iconActive='Video' key='VideoComponent' />
						),
					},
				],
			},
			true
		);
	}
}
