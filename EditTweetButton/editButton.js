const ITEMS_CONTAINER_ID = 'stream-items-id';
const PROFILE_PAGE_ITEMS_CONTAINER_ID = 'profile-stream-manager';
const EDIT_WINDOW_TITLE_ID = 'editWindowTitle';
const EDIT_WINDOW_ID = 'editWindow';
const EDIT_TEXTBOX_ID = 'editTextBox';
const EDIT_BUTTON_ID = 'editTweetButton';
const BACKGROUND_SCREEN_ID = 'background-screen';
const TWEET_CONTENT_CLASS_NAME = 'js-tweet-text';
const TWEET_ITEM_TYPE_NAME = 'tweet';
const USER_NAME_ATTRIBUTE_NAME = 'data-screen-name';
const DATA_NAME_ATTRIBUTE_NAME = 'data-name';
const PROFILE_NAME = 'profile';

const KEY_TO_ORIGINAL_TWEET = 'data-original-tweet';
const KEY_TO_TWEET_ID = 'data-item-id';
const REQUIRE_PIN_WINDOW_TITLE_LABEL = 'input your PIN';
const REQUIRE_PIN_BUTTON_LABEL = 'enter';
const EDIT_WINDOW_TITLE_LABEL = 'edit tweet';
const EDIT_BUTTON_LABEL = 'edit';
const CANCEL_BUTTON_LABEL = 'cancel';

const TWEET_DESTORY_URL = 'http://twitter.com/statuses/destroy/';

var editWindowCreated = false;
var tweetIDToDelete = '';
var editedText = '';
init();

function init() {
	var streamItems = document.getElementById(ITEMS_CONTAINER_ID);
	if (!streamItems) {
		setTimeout(init, 500);
		return;
	}
	var divs = streamItems.getElementsByTagName('div');

	var userName = getUserName();
	console.log(userName);
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
		var editButton = createElement('div');
		editButton.innerHTML = 'edit';
		editButton.addEventListener('click', displayEditTweetWindow, false);
		var childrenDiv = tweetDiv.getElementsByTagName('div');
		var streamItemFooter = tweetDiv;
		for (var i = 0; i < childrenDiv.length; i++) {
			if (childrenDiv[i].className == 'stream-item-footer') {
				streamItemFooter = childrenDiv[i];
			}
		}
//		streamItemFooter.insertBefore(editButton, streamItemFooter.firstChild);
		streamItemFooter.appendChild(editButton);
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
	var editTextBox = document.getElementById(EDIT_TEXTBOX_ID);
	editWindow.setAttribute(KEY_TO_ORIGINAL_TWEET, originalTweet);
	editWindow.setAttribute(KEY_TO_TWEET_ID, originalTweetID);
	editTextBox.value = originalTweet;
}

function createEditTweetWindow() {
	var editWindow = createElement('div', EDIT_WINDOW_ID);
	var editWindowTitle = createElement('div', EDIT_WINDOW_TITLE_ID);
	var editTextBox = createElement('textarea', EDIT_TEXTBOX_ID);
	var buttons = createElement('div');
	var doEditButton = createElement('button', EDIT_BUTTON_ID);
	var doCancelButton = createElement('button');
	var backgroundScreen = createElement('div', BACKGROUND_SCREEN_ID);
	
	editWindowTitle.innerText = EDIT_WINDOW_TITLE_LABEL;
	doEditButton.addEventListener('click', editTweet, false);
	doCancelButton.addEventListener('click', cancelEditTweet, false);
	doEditButton.innerText = EDIT_BUTTON_LABEL;
	doCancelButton.innerText = CANCEL_BUTTON_LABEL;
	
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

function requireInputPIN() {
	var editWindowTitle = document.getElementById(EDIT_WINDOW_TITLE_ID);
	var editTextBox = document.getElementById(EDIT_TEXTBOX_ID);
	var editButton = document.getElementById(EDIT_BUTTON_ID);
	var defaultTextEditTextBox = editTextBox.value;
	editWindowTitle.innerHTML = REQUIRE_PIN_WINDOW_TITLE_LABEL;
	editButton.innerHTML = REQUIRE_PIN_BUTTON_LABEL;
	editTextBox.textToPost = editTextBox.value;
	editTextBox.value= '';
	editButton.removeEventListener('click', editTweet, false);
	editButton.addEventListener('click', pinInputed, false);
}

function pinInputed(event) {
	var editTextBox = document.getElementById(EDIT_TEXTBOX_ID);
	var pinText = editTextBox.value;
	var editWindowTitle = document.getElementById(EDIT_WINDOW_TITLE_ID);
	var editButton = document.getElementById(EDIT_BUTTON_ID);
	if (!pinText || pinText == '')
		return;
	editWindowTitle.innerText = EDIT_WINDOW_TITLE_LABEL;
	editButton.removeEventListener('click', editTweet, false);
	editButton.addEventListener('click', pinInputed, false);
	editButton.innerText = EDIT_BUTTON_LABEL;
	editTextBox.value = editTextBox.textToPost;
	
	passPIN(pinText);
}

/**
 * If specified text is not same as orignal and empty,
 * 1) delete the original tweet and 2) request the post new tweet.
 */

function editTweet(event) {
	var tweetWindow = document.getElementById(EDIT_WINDOW_ID);
	var originalTweet 
		= tweetWindow.getAttribute(KEY_TO_ORIGINAL_TWEET);
	editedText
		= document.getElementById(EDIT_TEXTBOX_ID).value;

	tweetIDToDelete = tweetWindow.getAttribute(KEY_TO_TWEET_ID);
	authenticateAndDo(postEditedTweet);
	
//	if (editedText && editedText != '' && editedText != originalTweet) {
//		deleteTweet(tweetWindow.getAttribute(KEY_TO_TWEET_ID));
//		
//		console.log('submit' + editedText + '|' + originalTweet);
//	} else {
//		cancelEditTweet();
//	}
}

function deleteAndPostTweet() {
	postTweet();
	deleteTweet(tweetIDToDelete);
}

function postEditedTweet() {
	postAndDelete(editedText, tweetIDToDelete);
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

function getUserName() {
	var listElements = document.getElementsByTagName('li');
	var profileElement = undefined;
	for (var i = 0; i < listElements.length; i++) {
		if (listElements[i].hasAttribute(DATA_NAME_ATTRIBUTE_NAME)
				&& listElements[i].getAttribute(DATA_NAME_ATTRIBUTE_NAME) == PROFILE_NAME) {
			profileElement = listElements[i];
			break;
		}
	}
	if (!profileElement) 
		return null;
	
	listElements = profileElement.getElementsByTagName('div');
	for (var i = 0; i < listElements.length; i++) {
		if (listElements[i].hasAttribute(USER_NAME_ATTRIBUTE_NAME)) {
			return listElements[i].getAttribute(USER_NAME_ATTRIBUTE_NAME);
		}
	}
	return null;
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