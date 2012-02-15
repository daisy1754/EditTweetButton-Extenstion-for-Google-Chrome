const ITEMS_CONTAINER_ID = 'stream-items-id';
const EDIT_WINDOW_ID = 'editWindow';
const EDIT_TEXT_ID = 'editTextBox';
const KEY_TO_ORIGINAL_TWEET = 'data-original-tweet';

init();


function init() {
	var streamItems = document.getElementById(ITEMS_CONTAINER_ID);
	var divs = streamItems.getElementsByTagName('div');

	for (var i = 0; i < divs.length; i++) {
		if (divs[i].getAttribute('data-item-type') == 'tweet') {
			divs[i].addEventListener('mouseover', displayEditButton, true);
			divs[i].addEventListener('mouseout', dismissEditButton, true);
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
		if (element.getAttribute('data-item-type') == 'tweet')
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

function createEditButton() {
	var editButton = document.createElement('div');
	editButton.innerText = 'Edit';
	editButton.className = 'editButton';
	editButton.addEventListener('click', displayEditTweetWindow, true);
	return editButton;
}

/**
 * display edit tweet window, which contains current tweet text.
 */
function displayEditTweetWindow() {
	var editWindow = document.createElement('div');
	var editWindowTitle = document.createElement('div');
	var editTextBox = document.createElement('input');
	var buttons = document.createElement('div');
	var doEditButton = document.createElement('button');
	var doCancelButton = document.createElement('button');
	
	editWindowTitle.innerText = 'edit tweet';
	doEditButton.addEventListener('click', editTweet, false);
	doCancelButton.addEventListener('click', cancelEditTweet, false);
	doEditButton.innerText = 'edit';
	doCancelButton.innerText = 'cancel';
	
	editWindowTitle.id = 'editWindowTitle';
	editWindow.id = EDIT_WINDOW_ID;
	editTextBox.id = EDIT_TEXT_ID;
	
	// TODO 
	editWindow.setAttribute(KEY_TO_ORIGINAL_TWEET, 'original');
	
	editWindow.appendChild(editWindowTitle);
	editWindow.appendChild(editTextBox);
	buttons.appendChild(doEditButton);
	buttons.appendChild(doCancelButton);
	editWindow.appendChild(buttons);
	document.body.appendChild(editWindow);
}

/**
 * If specified text is not same as orignal and empty,
 * 1) delete the original tweet and 2) request the post new tweet.
 */
function editTweet(event) {
	var originalTweet 
		= document.getElementById(EDIT_WINDOW_ID).getAttribute(KEY_TO_ORIGINAL_TWEET);
	var editedTweet
		= document.getElementById(EDIT_TEXT_ID).innerText;
	if (editedText && editedText != originalText && editedText != '') {
		
	} else {
		cancelEditTweet(event);
	}
}

function cancelEditTweet(event) {
	var editWindow = document.getElementById(EDIT_WINDOW_ID);
	// TODO
}