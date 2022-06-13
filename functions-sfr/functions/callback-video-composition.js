exports.handler = function (context, event, callback) {
	const { StatusCallbackEvent, CompositionSid, RoomSid, Duration, Size } = event;
	const response = new Twilio.Response();
	response.setStatusCode(200);

	switch (StatusCallbackEvent) {
		case 'composition-enqueued':
			console.log(`Received ${StatusCallbackEvent} for composition ${CompositionSid}(${RoomSid}) `);
			break;
		case 'composition-started':
			console.log(`Received ${StatusCallbackEvent} for composition ${CompositionSid}(${RoomSid}) `);
			break;
		case 'composition-available':
			console.log(
				`Received ${StatusCallbackEvent} for composition ${CompositionSid}(${RoomSid}) of ${Duration} of ${Size} bytes `
			);
			break;
		default:
			console.log(`Received ${StatusCallbackEvent} for composition ${CompositionSid}(${RoomSid}) `);
			break;
	}
	return callback(null, response);
};
