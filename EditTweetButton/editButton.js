var itemsContainerId = 'stream-items-id';

var streamItems = document.getElementById(itemsContainerId);
var divs = streamItems.getElementsByTagName('div');

// TODO 
// twitter delete children of 'tweet' after page loaded...?
// my elements once show up and then diminish...

for (var i = 0; i < divs.length; i++) {
	if (divs[i].getAttribute('data-item-type') == 'tweet') {
		var editButton = createEditButton();
		divs[i].appendChild(editButton);
		divs[i].editButton = editButton;
		divs[i].addEventListener('mouseover',
			function(event){
				if (event.target.editButton)
					event.target.editButton.style.display = 'block';
				else
					console.log(event.target.getAttribute('tweet'));},
			false);
		divs[i].addEventListener('mouseout',
			function(event){
				if (event.target.editButton)
					event.target.editButton.style.display = 'none';},
			false);
	}
}

function createEditButton() {
	var editButton = document.createElement('div');
	editButton.innerText = 'Edit';
	editButton.className = 'editButton';
	editButton.addEventListener('click', showEditTweetWindow(), false);
	return editButton;
}

/**
 * 
 */
function showEditTweetWindow() {
	
}

