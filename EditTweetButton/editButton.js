var itemsContainerId = 'stream-items-id';


var streamItems = document.getElementById(itemsContainerId);
var divs = streamItems.getElementsByTagName('div');

for (var i = 0; i < divs.length; i++) {
	if (divs[i].getAttribute('data-item-type') == 'tweet') {
		divs[i].innerText = 'hoge';
	}
}