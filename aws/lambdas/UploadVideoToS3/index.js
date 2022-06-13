const S3 = require('aws-sdk/clients/s3');
const axios = require('axios');

exports.handler = async (event, context, callback) => {
	try {
		const { functionName } = context;
		console.log(`${functionName}: ***START***`);
		console.time(functionName);

		const searchParams = new URLSearchParams(event.body);
		const eventParameters = {};
		for (const [key, value] of searchParams) {
			eventParameters[key] = value;
		}
		console.log(`${functionName}: eventParameters`, eventParameters);

		if (eventParameters.StatusCallbackEvent != 'composition-available') {
			console.log(
				`${functionName}: ${eventParameters.CompositionSid} for ${eventParameters.RoomSid} is ${eventParameters.StatusCallbackEvent}`
			);
			console.log(`${functionName} : Doing nothing`);
			console.timeEnd(functionName);
			callback(null, { statusCode: 200, body: JSON.stringify({ message: 'Do Nothing' }) });
		}
		const { RoomSid, CompositionSid, MediaUri } = eventParameters;
		console.log(`${functionName}: RoomSid: ${RoomSid} : CompositionSid: ${CompositionSid} : MediaUri: ${MediaUri}`);

		const { awsRegion, awsBucketName, twilioAPIKey, twilioAPISecret } = process.env;
		console.log(`${functionName}: awsRegion: ${awsRegion} : awsBucketName: ${awsBucketName}`);

		const base64EncodedSecret = Buffer.from(`${twilioAPIKey}:${twilioAPISecret}`).toString('base64');

		const { status, data } = await axios({
			url: `https://video.twilio.com${MediaUri}`,
			method: 'GET',
			responseType: 'stream',
			headers: {
				Authorization: `Basic ${base64EncodedSecret}`,
			},
		});

		if (status != 200) {
			console.log(
				`${functionName}: ***ERROR*** : Could not locate CompositionSid: ${CompositionSid} : MediaUri: ${MediaUri}`
			);
			var response = {
				statusCode: 500,
				body: JSON.stringify({
					error: `${functionName}: ***ERROR*** : Could not locate CompositionSid: ${CompositionSid}`,
				}),
			};
			callback(response);
		}
		console.log(`${functionName} : Retreived composition successfully.`);

		const target = { Bucket: awsBucketName, Key: `video/${CompositionSid}.mp4`, Body: data };

		console.log(`${functionName} : Starting upload to S3`);

		const managedUploadToS3 = new S3.ManagedUpload({ params: target });

		await managedUploadToS3.promise();

		console.log(`${functionName} : Upload to S3 completed`);
		console.timeEnd(functionName);
		callback(null, { statusCode: 200, body: JSON.stringify({ message: 'Upload Complete' }) });
	} catch (error) {
		console.log(error.message);
		callback({ statusCode: 500, body: JSON.stringify({ error }) });
	}
};
