const ITEMS_CONTAINER_ID = 'stream-items-id';
const EDIT_WINDOW_TITLE_ID = 'editWindowTitle';
const EDIT_WINDOW_ID = 'editWindow';
const EDIT_TEXT_ID = 'editTextBox';
const BACKGROUND_SCREEN_ID = 'background-screen';
const TWEET_CONTENT_CLASS_NAME = 'js-tweet-text';
const TWEET_ITEM_TYPE_NAME = 'tweet';
const USER_NAME_ATTRIBUTE_NAME = 'data-screen-name';

const KEY_TO_ORIGINAL_TWEET = 'data-original-tweet';
const KEY_TO_TWEET_ID = 'data-item-id';
const EDIT_WINDOW_TITLE_LABEL = 'edit tweet';
const EDIT_BUTTON_LABEL = 'edit';
const CANCEL_BUTTON_LABEL = 'cancel';

const TWEET_DESTORY_URL = 'http://twitter.com/statuses/destroy/';

var editWindowCreated = false;
init();

function init() {
	var streamItems = document.getElementById(ITEMS_CONTAINER_ID);
	var divs = streamItems.getElementsByTagName('div');

	// TODO getUserName if and only if userName == tweetUserName
	var userName = 'dev_dev3'; // TODO
	for (var i = 0; i < divs.length; i++) {
		if (divs[i].getAttribute('data-item-type') == 'tweet') {
			var tweetOwnerName = getTweetOwnerName(divs[i]);
			if (userName == tweetOwnerName) {
				divs[i].addEventListener('mouseover', displayEditButton, true);
				divs[i].addEventListener('mouseout', dismissEditButton, true);
			}
		}
	}
}

/**
 * display 'edit' button beside the existing tweet.
 */
function displayEditButton(event) {
	event.cancelBubble = true;
	var tweetDiv = getTweetDIV(event.target);
	if (!tweetDiv) return;
	
	if (!tweetDiv.editButton) {
		var editButton = document.createElement('span');
		editButton.innerHTML = 'edit';
		editButton.addEventListener('click', displayEditTweetWindow, false);
		tweetDiv.appendChild(editButton);
		tweetDiv.editButton = editButton;
	} else {
		tweetDiv.editButton.style.display = 'inline';
	}
}

/**
 * returns 'tweet' div which is element or ancestor of the element.
 */
function getTweetDIV(element) {
	for (var i=0; i<10; i++) {
		if (element.getAttribute('data-item-type') == TWEET_ITEM_TYPE_NAME)
			return element;
		else
			element = element.parentNode;
	}
	return null;
}

function dismissEditButton(event) {
	event.cancelBubble = true;
	var tweetDiv = getTweetDIV(event.target);
	if (tweetDiv && tweetDiv.editButton)
		tweetDiv.editButton.style.display = 'none';	
}

/**
 * display edit tweet window, which contains current tweet text.
 */
function displayEditTweetWindow(event) {
	if (editWindowCreated) {
		setVisibilityOfEditTweetWindow(true);
	} else {
		createEditTweetWindow();
		editWindowCreated = true;
	}
	
	var tweetDiv = getTweetDIV(event.srcElement);
	var originalTweet = getTweetContent(tweetDiv);
	var originalTweetID = tweetDiv.getAttribute(KEY_TO_TWEET_ID);
	var editWindow = document.getElementById(EDIT_WINDOW_ID);
	var editTextBox = document.getElementById(EDIT_TEXT_ID);
	editWindow.setAttribute(KEY_TO_ORIGINAL_TWEET, originalTweet);
	editWindow.setAttribute(KEY_TO_TWEET_ID, originalTweetID);
	editTextBox.value = originalTweet;
}

function createEditTweetWindow() {
	var editWindow = document.createElement('div');
	var editWindowTitle = document.createElement('div');
	var editTextBox = document.createElement('textarea');
	var buttons = document.createElement('div');
	var doEditButton = document.createElement('button');
	var doCancelButton = document.createElement('button');
	var backgroundScreen = document.createElement('div');
	
	editWindowTitle.innerText = EDIT_WINDOW_TITLE_LABEL;
	doEditButton.addEventListener('click', editTweet, false);
	doCancelButton.addEventListener('click', cancelEditTweet, false);
	doEditButton.innerText = EDIT_BUTTON_LABEL;
	doCancelButton.innerText = CANCEL_BUTTON_LABEL;
	
	editWindowTitle.id = EDIT_WINDOW_TITLE_ID;
	editWindow.id = EDIT_WINDOW_ID;
	editTextBox.id = EDIT_TEXT_ID;
	backgroundScreen.id = BACKGROUND_SCREEN_ID;
	
	editWindow.appendChild(editWindowTitle);
	editWindow.appendChild(editTextBox);
	buttons.appendChild(doEditButton);
	buttons.appendChild(doCancelButton);
	editWindow.appendChild(buttons);
	document.body.appendChild(backgroundScreen);
	document.body.appendChild(editWindow);
}

function setVisibilityOfEditTweetWindow(isVisible) {
	var displayValue = isVisible ? 'block' : 'none';
	document.getElementById(EDIT_WINDOW_ID).style.display = displayValue;
	document.getElementById(BACKGROUND_SCREEN_ID).style.display = displayValue;
}

/**
 * If specified text is not same as orignal and empty,
 * 1) delete the original tweet and 2) request the post new tweet.
 */

function editTweet(event) {
	var tweetWindow = document.getElementById(EDIT_WINDOW_ID);
	var originalTweet 
		= tweetWindow.getAttribute(KEY_TO_ORIGINAL_TWEET);
	var editedText
		= document.getElementById(EDIT_TEXT_ID).value;

	if (editedText && editedText != '' && editedText != originalTweet) {
		deleteTweet(tweetWindow.getAttribute(KEY_TO_TWEET_ID));
		
		console.log('submit' + editedText + '|' + originalTweet);
	} else {
		cancelEditTweet();
	}
}

function deleteTweet(tweetID) {
	var baseURL = TWEET_DESTORY_URL + tweetID + '.json';
	jsonpRequest(baseURL);	
}

function cancelEditTweet() {
	setVisibilityOfEditTweetWindow(false);
}

function getTweetContent(tweetDiv) {
	var ps = tweetDiv.getElementsByTagName('p');
	for (var i = 0; i < ps.length; i++) {
		if (ps[i].className == TWEET_CONTENT_CLASS_NAME)
			return ps[i].innerHTML;
	}
}

function getTweetOwnerName(tweetDiv) {
	var spans = tweetDiv.getElementsByTagName('div');
	for (var i = 0; i < spans.length; i++) {
		if (spans[i].hasAttribute(USER_NAME_ATTRIBUTE_NAME))
			return spans[i].getAttribute(USER_NAME_ATTRIBUTE_NAME);
	}
	return null;
}

function jsonpRequest(baseURL, params, callbackName) {
	var query = '';
	for (var key in params) {
		query += key + '=' + params[key] + '&';
	}
	
	var jsonpURL = baseURL + "?q=" + query + "callback=" + callbackName;
	var scriptElement = document.createElement('script');
	scriptElement.type = 'text/javascript';
	console.log(jsonpURL);
	scriptElement.src = jsonpURL;
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(scriptElement);   
}