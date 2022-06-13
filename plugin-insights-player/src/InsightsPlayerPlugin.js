import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import reducers, { namespace } from './states';
import CustomInsightsPlayerContainer from './components/CustomInsightsPlayer/CustomInsightsPlayer.Container';
import { Actions as InsightsPlayerActions } from './states/CustomInsightsPlayerState';

const PLUGIN_NAME = 'InsightsPlayerPlugin';

export default class InsightsPlayerPlugin extends FlexPlugin {
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
		this.registerReducers(manager);

		flex.MainContainer.Content.add(<CustomInsightsPlayerContainer key='custom-insights-player' />);

		flex.Actions.replaceAction('InsightsPlayer:play', async (payload, original) => {
			const { conversationDetails, segmentMedia } = await fetch(
				`${process.env.REACT_APP_TWILIO_FUNCTIONS_BASE_URL}/fetch-task-details-for-segment`,
				{
					method: 'POST',
					headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
					body: JSON.stringify({
						segmentId: payload.segmentId,
						flexToken: manager.store.getState().flex.session.ssoTokenPayload.token,
					}),
				}
			)
				.then((data) => data.json())
				.catch((e) => console.error(`${PLUGIN_NAME} : !!!ERROR!!! : `, e.message));

			console.log(`${PLUGIN_NAME} : conversationDetails: `, conversationDetails);
			console.log(`${PLUGIN_NAME} : segmentMedia: `, segmentMedia);

			let videoMediaObjFromSegment = segmentMedia.metadata.media.filter(
				(mediaObj) => mediaObj.type === 'Embedded' && mediaObj.title === 'VideoRecording'
			);

			console.log(`${PLUGIN_NAME} : videoMediaObjFromSegment: `, videoMediaObjFromSegment);

			let voiceMediaObjFromSegment = segmentMedia.metadata.media.filter(
				(mediaObj) => mediaObj.type === 'VoiceRecording'
			);

			console.log(`${PLUGIN_NAME} : voiceMediaObjFromSegment: `, voiceMediaObjFromSegment);

			let media_type;

			if (videoMediaObjFromSegment.length !== 0) media_type = 'video';

			if (voiceMediaObjFromSegment.length !== 0) media_type = 'voice';

			console.log(`${PLUGIN_NAME} : media_type: `, media_type);

			if (videoMediaObjFromSegment.length === 0 && voiceMediaObjFromSegment.length === 0) original(payload);

			let url;
			if (videoMediaObjFromSegment.length === 1) url = videoMediaObjFromSegment[0].url;
			else if (voiceMediaObjFromSegment.length === 1) url = voiceMediaObjFromSegment[0].url_secure;

			let { media_url } = await fetch(`${url}`, { method: 'GET' })
				.then((data) => data.json())
				.catch((e) => console.error(`${PLUGIN_NAME} : !!!ERROR!!!`, e.message));

			console.log(`${PLUGIN_NAME} : media_url: `, media_url);

			manager.store.dispatch(
				InsightsPlayerActions.openCustomInsightsPlayer({
					media_url,
					media_type: media_type,
					segmentMetadata: segmentMedia.metadata,
					conversationDetails,
				})
			);
		});
	}

	/**
	 * Registers the plugin reducers
	 *
	 * @param manager { Flex.Manager }
	 */
	registerReducers(manager) {
		if (!manager.store.addReducer) {
			// eslint-disable-next-line
			console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
			return;
		}

		manager.store.addReducer(namespace, reducers);
	}
}
