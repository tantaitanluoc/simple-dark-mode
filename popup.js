"use strict";


let changeColor = document.getElementById("changeColor");
// let backup = {
// 		background: document.body.style.backgroundColor,
// 		color: document.body.style.color
// };
let backup = {
	background: 'white',
	color: 'black'
}
chrome.storage.sync.get('config',({config}) => {

	if(config.status === 'off'){
		changeColor.innerHTML = 'Turn on Darkmode';	
		changeColor.style.backgroundColor = backup.background;
		changeColor.style.color = backup.color;
	} 
	if(config.status === 'on'){		
		changeColor.innerHTML = 'Turn off Darkmode';
		changeColor.style.backgroundColor = config.background;
		changeColor.style.color = config.color;

	}
});
changeColor.addEventListener('click', async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true});

	chrome.storage.sync.get('config', ({config}) => {
		if(config.status === 'off'){

			chrome.scripting.executeScript({
				target: { tabId: tab.id},
				function: turnOn,
			});
			changeColor.innerHTML = 'Turn off Darkmode';
			changeColor.style.backgroundColor = config.background;
			changeColor.style.color = config.color;
		} 
		if(config.status === 'on'){
			chrome.scripting.executeScript({
				target: { tabId: tab.id},
				function: turnOff,
			});		
			changeColor.innerHTML = 'Turn on Darkmode';	
			changeColor.style.backgroundColor = backup.background;
			changeColor.style.color = backup.color;
			log(null, 'turnOff'); // reload page
		}
	});
});

function turnOn(){
	chrome.storage.sync.get('config', ({config}) => {
		document.body.style.backgroundColor = config.background;
		document.body.style.color = config.color;	
		config.status = 'on';
		chrome.storage.sync.set({config});
	});
}

function turnOff(){
	chrome.storage.sync.get('config', ({config}) => {	
		config.status = 'off';
		chrome.storage.sync.set({config});
	})
}

function log(msg,type = 'message') {
	chrome.runtime.sendMessage({
		type: type,
		msg: msg
	});
}