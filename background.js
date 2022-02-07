"use strict";


let config = {
	status: 'off',
	background: '#1c1e21',
	color: '#fff'
}
// let status = 'off';
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({config});

});

chrome.runtime.onMessage.addListener((req, sender, res) => {
	switch(req.type){
		case 'getCurrentTabURL': 
			getCurrentTab().then(tab => res(tab.url));
			break;
		case 'turnOff':
			turnOff();
			break;
		default: 
			console.log(req);
			break;

	}
	return true;
})

chrome.storage.sync.get('config', async ({config}) => {
	let tab = await getCurrentTab();
	if(config.status === 'off'){
		chrome.scripting.executeScript({
				target: { tabId: tab.id},
				function: turnOn,
			});
	} 
	if(config.status === 'on'){		
		chrome.scripting.executeScript({
				target: { tabId: tab.id},
				function: turnOn,
			});

	}
});

async function getCurrentTab(){
	let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
	return tab;
}

function turnOn(){
	chrome.storage.sync.get('config', ({config}) => {
		document.body.style.backgroundColor = config.background;
		document.body.style.color = config.color;
	});
}

function turnOff(){
	getCurrentTab().then(tab => (chrome.tabs.reload(tab.id)));
}