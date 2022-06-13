const TokenValidator = require('twilio-flex-token-validator').validator;

exports.handler = TokenValidator(async (event, context, callback) => {
	const { functionName } = context;
	console.log(`${functionName}: ###START###`);

	const { twilioAccountSid, twilioAuthToken, awsApiGatewayResourceArn } = process.env;

	const token = event.authorizationToken.slice(6);
	const decodedToken = new Buffer.from(token, 'base64').toString().split(':')[1];

	const validationResult = await TokenValidator(decodedToken, twilioAccountSid, twilioAuthToken);

	console.log(`${functionName} : validationResult : `, validationResult);

	const authPolicy = {
		principalId: 'twilio',
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Resource: [awsApiGatewayResourceArn],
					Effect: validationResult && validationResult.valid ? 'Allow' : 'Deny',
				},
			],
		},
	};

	console.log(`${functionName} : authPolicy : `, authPolicy);
	console.log(`${functionName}: ###END###`);
	return authPolicy;
});
