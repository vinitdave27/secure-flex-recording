import { combineReducers } from 'redux';

import { reduce as CustomInsightsPlayerReducer } from './CustomInsightsPlayerState';

// Register your redux store under a unique namespace
export const namespace = 'insights-player';

// Combine the reducers
export default combineReducers({
	customInsightsPlayer: CustomInsightsPlayerReducer,
});
