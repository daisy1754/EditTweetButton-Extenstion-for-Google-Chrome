const KEY_TO_ACCESS_TOKEN_KEY = 'accessTokenKey';
const KEY_TO_ACCESS_TOKEN_SECRET = 'accessTokenSecret';

const DELETE_TWEET_BASE_URL = "https://api.twitter.com/1/statuses/destroy/";
const POST_TWEET_URL = "https://api.twitter.com/1/statuses/update.json";

var invokeAfterAuthentification = '';
var oauth = '';

function getOAuthInstance() {
	var options;

	var consumerKey = getConfig('consumerKey');
	var consumerSecret = getConfig('consumerSecret');
    options = {
        consumerKey: consumerKey,
        consumerSecret: consumerSecret,
        
        requestTokenUrl: "https://twitter.com/oauth/request_token",
        authorizationUrl: "https://twitter.com/oauth/authorize",
        accessTokenUrl: "https://twitter.com/oauth/access_token"
    };

    return OAuth(options);
}

function authenticateAndDo(func) {
	oauth = getOAuthInstance();
	var accessTokenKey = getConfig(KEY_TO_ACCESS_TOKEN_KEY);
	var accessTokenSecret = getConfig(KEY_TO_ACCESS_TOKEN_SECRET);
	
	if (!accessTokenKey || !accessTokenSecret) {
		// have not authenticated
		console.log('first time');
		invokeAfterAuthentification = func;
		requireInputPIN();
		oauth.fetchRequestToken(openAuthoriseWindow, failureHandler);
		return;
	}
	
	oauth.setAccessToken(accessTokenKey, accessTokenSecret);
	func(oauth);
	return oauth;
}

function openAuthoriseWindow(url) {
	window.open(url, 'authorise');
}

function passPIN(PIN) {
	oauth.setVerifier(PIN);
	oauth.fetchAccessToken(invokeSavedFunction, failureHandler);
}

function invokeSavedFunction() {
	storeConfig(KEY_TO_ACCESS_TOKEN_KEY, oauth.getAccessTokenKey());
	storeConfig(KEY_TO_ACCESS_TOKEN_SECRET, oauth.getAccessTokenSecret());
	invokeAfterAuthentification(oauth);
}

function postAndDelete(textToTweet) {
	oauth.post(POST_TWEET_URL, {'status': textToTweet}, successPost, failureHandler);
}

function successPost() {
	// delete privious tweet
	var url = DELETE_TWEET_BASE_URL + tweetIDToDelete + ".json";
	oauth.post(url, {'id': tweetIDToDelete}, successDelete, failureHandler);
}

function successDelete(data) {
	console.log('reload');
	location.reload(true);
}

function failureHandler(data) {
	console.log(data);
}