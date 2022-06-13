import styled from 'react-emotion';

export const WaveformContainer = styled('div')`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 100px;
	width: 100%;
	background: transparent;
`;

export const WaveContainer = styled('div')`
	width: 100%;
`;

export const Wave = styled('div')`
	width: 100%;
	height: 90px;
	margin-left: 1em;
`;

export const WaveTimeline = styled('div')`
	margin-left: 1em;
`;

export const PlayButton = styled('div')`
	border: 1px solid black;
	cursor: pointer;
	width: 32px;
	height: 32px;
	&:hover {
		background: #ddd;
	}
`;

export const PlayIcon = (props) => {
	return (
		<svg width='32' height='32' viewBox='0 0 20 20' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
			<path
				fillRule='evenodd'
				d='M12.804 10L7 6.633v6.734L12.804 10zm.792-.696a.802.802 0 010 1.392l-6.363 3.692C6.713 14.69 6 14.345 6 13.692V6.308c0-.653.713-.998 1.233-.696l6.363 3.692z'
				clipRule='evenodd'
			/>
		</svg>
	);
};

export const PauseIcon = (props) => {
	return (
		<svg width='32' height='32' viewBox='0 0 20 20' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
			<path
				fillRule='evenodd'
				d='M8 5.5a.5.5 0 01.5.5v8a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v8a.5.5 0 01-1 0V6a.5.5 0 01.5-.5z'
				clipRule='evenodd'
			/>
		</svg>
	);
};
