import styled from 'react-emotion';

export const CustomInsightsPlayerWrapper = styled('div')`
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100%;
	box-shadow: rgb(0 0 0 / 35%) 0px -2px 10px;
	z-index: 10;
	background: rgb(255, 255, 255);
	border-top: 1px solid rgb(221, 221, 221);
	color: black;
	min-height: 220px;
	height: auto;
`;

export const Header = styled('div')`
	display: flex;
	padding-right: 38px;
`;

export const HeaderInfo = styled('div')`
	padding: 16px 12px;
	-webkit-box-align: baseline;
	align-items: baseline;
	background-color: rgb(255, 255, 255);
	color: rgb(34, 34, 34);
	position: relative;
	overflow-x: hidden;
	display: flex;
	flex-flow: row nowrap;
	-webkit-box-flex: 0;
	flex-grow: 1;
	flex-shrink: 0;
`;

export const HeaderSegmentSelector = styled('div')`
	display: flex;
	-webkit-box-align: baseline;
	align-items: baseline;
	margin-left: auto;
`;

export const Content = styled('div')`
	padding: 16px;
	border-top: 1px solid rgb(238, 238, 238);
	border-bottom: 1px solid rgb(238, 238, 238);
	background-color: rgb(255, 255, 255);
	color: rgb(34, 34, 34);
	border-right-color: rgb(238, 238, 238);
	border-left-color: rgb(238, 238, 238);
	display: flex;
	flex-flow: row nowrap;
	-webkit-box-flex: 0;
	flex-grow: 0;
	flex-shrink: 0;
	justify-content: center;
`;

export const Footer = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	-webkit-box-flex: 1;
	flex-grow: 1;
	flex-shrink: 1;
`;

export const FooterInfo = styled('div')`
	padding: 16px;
	background-color: rgb(255, 255, 255);
	color: rgb(34, 34, 34);
	position: relative;
	overflow-x: hidden;
	display: flex;
	flex-flow: row nowrap;
	-webkit-box-flex: 1;
	flex-grow: 1;
	flex-shrink: 0;
`;

export const FooterAgentInfo = styled('div')`
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-flex: 0;
	flex-grow: 0;
	margin-right: 16px;
`;

export const FooterCallerInfo = styled('div')`
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-flex: 0;
	flex-grow: 0;
`;

export const FooterTimeInfo = styled('div')`
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: end;
	justify-content: flex-end;
	-webkit-box-flex: 1;
	flex-grow: 1;
`;

export const CustomInsightsPlayerCloseButton = styled('div')`
	position: absolute;
	top: 10px;
	right: 10px;
`;

export const CloseIcon = (props) => {
	return (
		<svg width='32' height='32' viewBox='0 0 20 20' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
			<path
				fillRule='evenodd'
				d='M16 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1zM4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4z'
				clipRule='evenodd'
			/>
			<path
				fillRule='evenodd'
				d='M9.293 10L6.646 7.354l.708-.708L10 9.293l2.646-2.647.708.708L10.707 10l2.647 2.646-.708.708L10 10.707l-2.646 2.647-.708-.707L9.293 10z'
				clipRule='evenodd'
			/>
		</svg>
	);
};
