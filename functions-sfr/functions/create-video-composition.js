function getCompositionPromise(context, event, client) {
	return new Promise((resolve, reject) => {
		client.video.compositions
			.create({
				roomSid: event.roomSid,
				audioSources: '*',
				videoLayout: { grid: { video_sources: ['*'] } },
				//statusCallback: `https://${context.DOMAIN_NAME}/callback-video-composition`,
				statusCallback: `https://zok3papu2d.execute-api.us-east-1.amazonaws.com/dev/video-recording`,
				format: 'mp4',
			})
			.then((composition) => resolve(composition))
			.catch((error) => reject(error));
	});
}
exports.handler = function (context, event, callback) {
	const { roomSid } = event;
	const client = context.getTwilioClient();

	const response = new Twilio.Response();
	const headers = {
		'Access-Control-Allow-Origin': '*', // change this to your client-side URL
		'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Content-Type': 'application/json',
	};
	response.setHeaders(headers);

	getCompositionPromise(context, event, client)
		.then((composition) => {
			console.log(`Composition ${composition.sid} has been queued for room ${roomSid}`);
			response.setBody({ compositionSid: composition.sid });
			callback(null, response);
		})
		.catch((error) => callback(error));
};
