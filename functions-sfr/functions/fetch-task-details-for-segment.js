const axios = require('axios');

function fetchYticaToken(flexToken, accountSid) {
	return axios({
		method: 'POST',
		url: `https://apigw.ytica.com/provisioning/token-generator`,
		data: { token: flexToken, account_sid: accountSid },
	}).then((response) => response.data.authorization_token);
}

function fetchInsightsConversationDetails(segmentId, yticaToken) {
	return axios({
		method: 'GET',
		url: `https://app.ytica.com/media/conversation?segment_id=${segmentId}`,
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${yticaToken}`,
		},
	}).then((response) => response.data);
}

async function fetchInsightsSegmentMediaDetails(segmentId, yticaToken) {
	return axios({
		method: 'GET',
		url: `https://app.ytica.com/media/data/${segmentId}`,
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${yticaToken}`,
		},
	}).then((d) => d.data);
}

exports.handler = async function (context, event, callback) {
	const { ACCOUNT_SID } = context;
	const { flexToken, segmentId } = event;
	const response = new Twilio.Response();
	const headers = {
		'Access-Control-Allow-Origin': '*', // change this to your client-side URL
		'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Content-Type': 'application/json',
	};
	response.setHeaders(headers);
	const yticaToken = await fetchYticaToken(flexToken, ACCOUNT_SID);
	const conversationDetails = await fetchInsightsConversationDetails(segmentId, yticaToken);
	const segmentMedia = await fetchInsightsSegmentMediaDetails(segmentId, yticaToken);

	response.setBody({ conversationDetails, segmentMedia });
	callback(null, response);
};
