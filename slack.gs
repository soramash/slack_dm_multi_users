function start(){
  sendDmToMultipleUsers(['AAAAAAAAA', 'BBBBBBBBB', 'CCCCCCCCC'], 'Hello, this is a test message!');
}

function sendDmToMultipleUsers(userIds, message) {
  var token = getSlackToken(); // get Slack OAuth Access Token

  var url = 'https://slack.com/api/conversations.open';
  var payload = {
    users: userIds.join(',')
  };
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseJson = JSON.parse(response.getContentText());

  if (responseJson.ok) {
    var channelId = responseJson.channel.id;
    sendMessageToChannel(channelId, message, token);
  } else {
    Logger.log('Error opening conversation: ' + responseJson.error);
  }
}

function sendMessageToChannel(channelId, message, token) {
  var url = 'https://slack.com/api/chat.postMessage';
  var payload = {
    channel: channelId,
    text: message
  };
  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var responseJson = JSON.parse(response.getContentText());

  if (!responseJson.ok) {
    Logger.log('Error sending message: ' + responseJson.error);
  }
}

function getSlackToken() {
  return PropertiesService.getScriptProperties().getProperty('SLACK_API_TOKEN');
}
