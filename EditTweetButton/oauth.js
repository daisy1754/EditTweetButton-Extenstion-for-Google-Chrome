

function getOAuthInstance() {
	var options;

	var consumerKey = getConfig('consumerKey');
	var consumerSecret = getConfig('consumerSecret');
    options = {
        consumerKey: consumerKey,
        consumerSecret: consumerSecret
    };

    return OAuth(options);
}

function getRequestToken() {
	oauth.get('https://api.twitter.com/oauth/request_token',
		function(data) {
			requestParams = data.text;	
			$('#oauthStatus').html('<span style="color:blue;">Getting authorization...</span>');
			window.plugins.childBrowser.showWebPage('https://api.twitter.com/oauth/authorize?'+data.text, 	
			{ showLocationBar : false });                    
		},
		function(data) { 
			alert('Error : No Authorization'); 
		}
	);
	
	$consumer->getRequestToken('http://twitter.com/oauth/request_token', $callback);
	$_SESSION['request_token'] = $consumer->getToken();
	$_SESSION['request_token_secret'] = $consumer->getTokenSecret();
	$auth_url = $consumer->getAuthorizeUrl('http://twitter.com/oauth/authorize');
}