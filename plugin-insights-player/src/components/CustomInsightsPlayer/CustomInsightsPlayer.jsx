import React from 'react';
import PropTypes from 'prop-types';

import {
	Content,
	CustomInsightsPlayerCloseButton,
	CustomInsightsPlayerWrapper,
	Footer,
	FooterAgentInfo,
	FooterCallerInfo,
	FooterInfo,
	FooterTimeInfo,
	Header,
	HeaderInfo,
	HeaderSegmentSelector,
	CloseIcon,
} from './CustomInsightsPlayer.Styles';
import { Icon } from '@twilio/flex-ui';
import WaveformComponent from '../Waveform/WaveformComponent';

function secondsToHms(value) {
	const sec = parseInt(value, 10); // convert value to number if it's string
	let hours = Math.floor(sec / 3600); // get hours
	let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
	let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
	// add 0 if value < 10; Example: 2 => 02
	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
}

// It is recommended to keep components stateless and use redux for managing states
const CustomInsightsPlayer = (props) => {
	console.log('attempting to load...');
	if (!props.isOpen) {
		return null;
	}

	return (
		<CustomInsightsPlayerWrapper>
			<Header>
				<HeaderInfo>
					<div style={{ display: 'flex', alignItems: 'baseline' }}>
						{props.conversationDetails && props.conversationDetails.segment_count === 1 && (
							<span>
								{new Date(props.conversationDetails._embedded.segment[0].timestamp).toLocaleString()}
							</span>
						)}
					</div>
					<HeaderSegmentSelector>
						<div>
							<span className='Twilio'>Segments</span>
						</div>
						<div style={{ marginLeft: '9px' }}>
							{props.conversationDetails && props.conversationDetails.segment_count === 1 && (
								<span>{secondsToHms(props.conversationDetails._embedded.segment[0].talk_time)}</span>
							)}
						</div>
					</HeaderSegmentSelector>
				</HeaderInfo>
			</Header>
			<Content>
				{props.media_url && props.media_type === 'video' && (
					<video controls controlsList='nodownload'>
						<source src={props.media_url} type='video/mp4' />
					</video>
				)}
				{props.media_url && props.media_type === 'voice' && (
					// <audio controls>
					// 	<source src={props.media_url} type='audio/mp3' />
					// </audio>
					<WaveformComponent media_url={props.media_url} />
				)}
			</Content>
			<Footer>
				<FooterInfo>
					<FooterAgentInfo>
						<Icon icon='DefaultAvatar' />
						<div>
							<div className='Twilio'>
								<strong>{props.segmentMetadata.agent_name}</strong> in{' '}
								<strong>{props.segmentMetadata.queue}</strong>
							</div>
						</div>
					</FooterAgentInfo>
					<FooterCallerInfo>
						{props.media_type === 'video' ? <Icon icon='Video' /> : <Icon icon='Call' />}
						<span className='Twilio'>
							{props.segmentMetadata.customer_name} via {props.segmentMetadata.queue}
						</span>
					</FooterCallerInfo>
					<FooterTimeInfo>
						<div>
							<strong>{secondsToHms(props.conversationDetails._embedded.segment[0].talk_time)}</strong>
						</div>
						<Icon icon='Clock' />
						<div>{secondsToHms(props.conversationDetails._embedded.segment[0].talk_time)}</div>
					</FooterTimeInfo>
				</FooterInfo>
			</Footer>
			<CustomInsightsPlayerCloseButton onClick={props.dismissCustomInsightsPlayer}>
				<CloseIcon />
			</CustomInsightsPlayerCloseButton>
		</CustomInsightsPlayerWrapper>
	);
};

CustomInsightsPlayer.displayName = 'CustomTaskList';

CustomInsightsPlayer.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	dismissBar: PropTypes.func.isRequired,
};

export default CustomInsightsPlayer;
