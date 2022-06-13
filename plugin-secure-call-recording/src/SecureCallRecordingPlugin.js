import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';

import './listener/index';

const PLUGIN_NAME = 'SecureCallRecordingPlugin';

export default class SecureCallRecordingPlugin extends FlexPlugin {
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
		if (
			process.env.REACT_APP_RECORD_CHANNEL.toLowerCase() != 'worker' &&
			process.env.REACT_APP_RECORD_CHANNEL.toLowerCase() != 'customer'
		) {
			flex.Notifications.registerNotification({
				id: 'brokenVar',
				content:
					'The Dual Channel Recording plugin will not work because the .env file has not been configured correctly.', // string
				type: 'error',
				timeout: 0,
			});

			flex.Notifications.showNotification('brokenVar', null);
			console.error(
				'ERROR: REACT_APP_RECORD_CHANNEL env variable does not have the correct value. Refer to your .env file to fix.'
			);
		}
	}
}
