const S3 = require('aws-sdk/clients/s3');
const axios = require('axios');
const querystring = require('querystring');

exports.handler = async (event, context, callback) => {
	try {
		const { functionName } = context;
		console.log(`${functionName}: ***START***`);
		console.time(functionName);

		const eventParameters = querystring.decode(event.body) || event.queryStringParameters;
		const { RecordingSid, RecordingUrl } = eventParameters;
		console.log(`${functionName}: RecordingSid: ${RecordingSid} : RecordingUrl: ${RecordingUrl}`);

		const { awsRegion, awsBucketName } = process.env;
		console.log(`${functionName}: awsRegion: ${awsRegion} : awsBucketName: ${awsBucketName}`);

		const { status, data } = await axios({ url: `${RecordingUrl}.mp3`, method: 'GET', responseType: 'stream' });

		if (status != 200) {
			console.log(
				`${functionName}: ***ERROR*** : Could not locate RecordingSid: ${RecordingSid} : RecordingUrl: ${RecordingUrl}`
			);
			var response = {
				statusCode: 500,
				body: JSON.stringify({
					error: `${functionName}: ***ERROR*** : Could not locate RecordingSid: ${RecordingSid}`,
				}),
			};
			callback(response);
		}
		console.log(`${functionName} : Retreived call recording successfully.`);

		const target = { Bucket: awsBucketName, Key: `calls/${RecordingSid}.mp3`, Body: data };

		console.log(`${functionName} : Starting upload to S3`);

		const managedUploadToS3 = new S3.ManagedUpload({ params: target });

		await managedUploadToS3.promise();
		console.log(`${functionName} : Upload to S3 completed`);
		console.timeEnd(functionName);
		callback(null, { statusCode: 200, body: JSON.stringify({ message: 'Upload Complete' }) });
	} catch (error) {
		console.log(error);
		let response = {
			statusCode: 500,
			body: JSON.stringify(error),
		};
		callback(response);
	}
};
