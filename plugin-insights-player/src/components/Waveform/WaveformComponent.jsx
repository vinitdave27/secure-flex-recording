import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import * as WaveSurferTimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline';
import {
	WaveformContainer,
	Wave,
	PlayButton,
	WaveContainer,
	WaveTimeline,
	PlayIcon,
	PauseIcon,
} from './WaveformComponent.Styles.js';

const WaveformComponent = ({ media_url }) => {
	const waveform = useRef(null);
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		if (!waveform.current) {
			waveform.current = WaveSurfer.create({
				barWidth: 3,
				cursorWidth: 1,
				container: '#waveform',
				backend: 'WebAudio',
				height: 80,
				progressColor: '#2D5BFF',
				responsive: true,
				waveColor: '#EFEFEF',
				splitChannels: true,
				splitChannelsOptions: {
					overlay: true,
					channelColors: {
						0: {
							progressColor: 'green',
							waveColor: 'pink',
						},
						1: {
							progressColor: 'orange',
							waveColor: 'purple',
						},
					},
				},
				plugins: [
					WaveSurferTimelinePlugin.create({
						container: '#waveform-timeline',
					}),
				],
			});
			waveform.current.load(media_url, null, '');
			waveform.current.on('finish', () => {
				console.log('finished playing the audio.');
				setPlaying(false);
			});
			waveform.current.on('ready', () => {
				setPlaying(true);
				waveform.current.play();
				waveform.current.setVolume(0.5);
			});

			return () => {
				waveform.current = null;
			};
		}
	}, [media_url]);
	const playAudio = () => {
		setPlaying(!playing);
		waveform.current.playPause();
	};
	return (
		<WaveformContainer>
			<PlayButton onClick={playAudio}>{!playing ? <PlayIcon /> : <PauseIcon />}</PlayButton>
			<WaveContainer>
				<Wave id='waveform'></Wave>
				<WaveTimeline id='waveform-timeline'></WaveTimeline>
			</WaveContainer>
		</WaveformContainer>
	);
};

export default WaveformComponent;
