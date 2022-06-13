const AWS = require('aws-sdk');
const Signer = require('./helpers/signer.js');

const secretsManager = new AWS.SecretsManager({ region: process.env.awsRegion });

const getKeyFromSecretsManager = (awsSecretsManagerSecretName) => {
	return new Promise((resolve, reject) => {
		secretsManager.getSecretValue({ SecretId: awsSecretsManagerSecretName }, (err, data) => {
			if (err) {
				console.log('Get Secret Error', err);
				return reject(err);
			}
			console.log('Private Key retrieved');
			return resolve(data.SecretString);
		});
	});
};

exports.handler = async (event, context, callback) => {
	try {
		const { functionName } = context;
		const expiration = Math.floor(new Date().getTime() / 1000) + 60 * 15;
		const { awsCloudFrontBaseUrl, awsCloudFrontKeyPairId, awsSecretsManagerSecretName } = process.env;
		console.log(`${functionName}: ***START***`);
		console.time(functionName);

		const { RecordingSid, Type } = event.queryStringParameters;
		const sourceIp = event.requestContext.identity.sourceIp;
		console.log(
			`${functionName}: RecordingSid : ${RecordingSid} : Type : ${Type} : SourceIP : ${sourceIp} : Expiration: ${expiration}`
		);

		let resourceLocation = `${awsCloudFrontBaseUrl}/${Type}/${RecordingSid}.mp3`;
		if (Type === 'video') {
			resourceLocation = `${awsCloudFrontBaseUrl}/${Type}/${RecordingSid}.mp4`;
		}
		console.log(
			`${functionName}: Signing for resourceLocation : ${resourceLocation} : IpAddress : ${sourceIp} : Expiration : ${expiration}`
		);

		const policy = JSON.stringify({
			Statement: [
				{
					Resource: resourceLocation,
					Condition: {
						DateLessThan: {
							'AWS:EpochTime': expiration,
						},
						IpAddress: {
							'AWS:SourceIp': `${sourceIp}/32`,
						},
					},
				},
			],
		});

		const signer = new Signer(awsCloudFrontKeyPairId, await getKeyFromSecretsManager(awsSecretsManagerSecretName));

		const signedCloudFrontUrl = signer.getSignedUrl({ policy, url: resourceLocation });
		console.log(`${functionName}: ${signedCloudFrontUrl}`);
		console.log(`${functionName}: CloudFront pre-signed url generated successfully!`);
		console.timeEnd(functionName);
		callback(null, {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS,GET',
			},
			body: JSON.stringify({ media_url: signedCloudFrontUrl }),
		});
	} catch (error) {
		console.log(error);
		let response = {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Headers': 'Content-Type',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'OPTIONS,GET',
			},
			body: JSON.stringify(error),
		};
		callback(response);
	}
};
