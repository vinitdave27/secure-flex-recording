exports.handler = function (context, event, callback) {
	const { StatusCallbackEvent, RoomSid, RoomName, RoomType, RoomDuration } = event;
	const response = new Twilio.Response();
	response.setStatusCode(200);

	switch (StatusCallbackEvent) {
		case 'room-ended':
			console.log(
				`Received ${StatusCallbackEvent} for room ${RoomName}(${RoomSid}) of type ${RoomType} which lasted for ${RoomDuration} seconds`
			);
			console.log(`room end complete`);
			break;
		default:
			console.log(`Event ${StatusCallbackEvent} for roomSid ${RoomSid} (${RoomName})`);
			break;
	}
	return callback(null, response);
};
