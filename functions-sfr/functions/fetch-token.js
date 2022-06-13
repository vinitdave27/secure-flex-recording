exports.handler = function (context, event, callback) {
	const { ACCOUNT_SID, API_KEY, API_SECRET } = context;

	const { identity, roomName } = event;

	const AccessToken = Twilio.jwt.AccessToken;

	const token = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET, { identity });

	const VideoGrant = AccessToken.VideoGrant;
	const videoGrant = new VideoGrant({ room: roomName });

	token.addGrant(videoGrant);

	const response = new Twilio.Response();
	const headers = {
		'Access-Control-Allow-Origin': '*', // change this to your client-side URL
		'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Content-Type': 'application/json',
	};
	response.setHeaders(headers);
	response.setBody({ accessToken: token.toJwt(), identity });

	return callback(null, response);
};
