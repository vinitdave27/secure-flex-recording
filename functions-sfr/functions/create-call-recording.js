const TokenValidator = require('twilio-flex-token-validator').functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
	const { AWS_API_GATEWAY_BASE_URL } = context;
	const client = context.getTwilioClient();
	const response = new Twilio.Response();

	response.appendHeader('Access-Control-Allow-Origin', '*');
	response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
	response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

	const { callSid } = event;

	if (!callSid) {
		response.appendHeader('Content-Type', 'plain/text');
		response.setBody('Missing callSid parameter');
		response.setStatusCode(400);
		return callback(null, response);
	}

	try {
		const recordingParams = {
			recordingChannels: 'dual',
			recordingStatusCallback: `${AWS_API_GATEWAY_BASE_URL}/dev/call-recording`,
			recordingStatusCallbackEvent: ['completed'],
		};

		console.log('RecordingParams: ', recordingParams);

		console.log('Creating dual recording for call SID', callSid);

		const recording = await client.calls(callSid).recordings.create(recordingParams);

		response.appendHeader('Content-Type', 'application/json');
		response.setBody({
			sid: recording.sid,
		});
	} catch (error) {
		response.appendHeader('Content-Type', 'plain/text');
		response.setBody(error.message);
		response.setStatusCode(500);
	}

	callback(null, response);
});
