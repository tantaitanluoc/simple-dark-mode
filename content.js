chrome.storage.sync.get('config', ({ config }) => {
	try{
		log(null, 'getCurrentTabURL', url => {
			
		})
	} catch(e) {
		log(JSON.stringify(e), 'error');
	}
})




function log(msg, type = 'message', callback) {
	chrome.runtime.sendMessage({
		type: type,
		msg: msg
	}, res => {
		callback(res)
	});
}