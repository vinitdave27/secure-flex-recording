import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Actions } from '../../states/CustomInsightsPlayerState';
import CustomInsightsPlayer from './CustomInsightsPlayer';

const mapStateToProps = (state) => ({
	isOpen: state['insights-player'].customInsightsPlayer.isOpen,
	media_url: state['insights-player'].customInsightsPlayer.media_url,
	media_type: state['insights-player'].customInsightsPlayer.media_type,
	segmentMetadata: state['insights-player'].customInsightsPlayer.segmentMetadata,
	conversationDetails: state['insights-player'].customInsightsPlayer.conversationDetails,
});

const mapDispatchToProps = (dispatch) => ({
	dismissCustomInsightsPlayer: bindActionCreators(Actions.dismissCustomInsightsPlayer, dispatch),
	openCustomInsightsPlayer: bindActionCreators(Actions.openCustomInsightsPlayer, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomInsightsPlayer);
