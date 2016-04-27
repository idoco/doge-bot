module['exports'] = function echoHttp(hook) {

	var request = require('request');
	var token = hook.env.pageToken;

	// parse all incomning message events
	messaging_events = hook.params.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {
		event = hook.params.entry[0].messaging[i];
		sender = event.sender.id;
		if (event.message && event.message.text) {
			text = event.message.text;
			sendDogeResponse(sender, "" + text.substring(0, 200));
		}
	}


	function sendDogeResponse(sender, text) {

		// build the dogr.io url
		var words = text.split(" ");
		var dogrUrl = "";
		for (var i = 0; i < words.length; i++) {
			dogrUrl = dogrUrl + '/' + words[i].replace(/[^\w\s]/gi, '');
		}
		dogrUrl = "http://dogr.io/wow/amaze" + dogrUrl + ".png?split=false"
		console.log(dogrUrl);

		messageData = {
			"attachment": {
				"type": "image",
				"payload": {
					"url": dogrUrl
				}
			}
		};
		
		request({
			url: 'https://graph.facebook.com/v2.6/me/messages',
			qs: {
				access_token: token
			},
			method: 'POST',
			json: {
				recipient: {
					id: sender
				},
				message: messageData,
			}
		}, function(error, response, body) {
			console.log("response");
			console.log(JSON.stringify(response));
			if (error) {
				console.log('Error sending message: ', error);
			} else if (response.body.error) {
				console.log('Error: ', response.body.error);
			}
			hook.res.end();
		});
	}
};
