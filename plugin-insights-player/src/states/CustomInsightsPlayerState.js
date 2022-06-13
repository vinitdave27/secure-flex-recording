const ACTION_DISMISS_CUSTOM_INSIGHTS_PLAYER = 'ACTION_DISMISS_CUSTOM_INSIGHTS_PLAYER';
const ACTION_OPEN_CUSTOM_INSIGHTS_PLAYER = 'ACTION_OPEN_CUSTOM_INSIGHTS_PLAYER';

const initialState = {
	isOpen: false,
	media_url: null,
	media_type: null,
	segmentMetadata: null,
	conversationDetails: null,
};

export class Actions {
	static dismissCustomInsightsPlayer = () => ({ type: ACTION_DISMISS_CUSTOM_INSIGHTS_PLAYER });
	static openCustomInsightsPlayer = (payload) => ({ type: ACTION_OPEN_CUSTOM_INSIGHTS_PLAYER, payload });
}

export function reduce(state = initialState, action) {
	// eslint-disable-next-line sonarjs/no-small-switch
	switch (action.type) {
		case ACTION_DISMISS_CUSTOM_INSIGHTS_PLAYER: {
			return initialState;
		}

		case ACTION_OPEN_CUSTOM_INSIGHTS_PLAYER: {
			return {
				...state,
				isOpen: true,
				media_url: action.payload.media_url,
				media_type: action.payload.media_type,
				segmentMetadata: action.payload.segmentMetadata,
				conversationDetails: action.payload.conversationDetails,
			};
		}

		default:
			return state;
	}
}
