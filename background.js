/**
 * 
 * Self Invoking Functions
 * 
 */
var __SCAN__API__BACKGROUND = (function () {

    var nativePort = null;
    var queue = new Object();
    var index = 0;

    /**
     * Send message to background script
     * This will try to reconnect if connection is down
     * @param {object} message object to be sent 
     * @param {boolean} secondTime don't try to send message to native more than 2 times 
     */
    function sendNativeMessage(message, secondTime = false, tabId) {
		

        if (nativePort !== null) {
            message.id = (+index) + 1;
            index = message.id;
			// if(message.method == '__twp_uploadFile')
				// sendMessageInChunks(message);
			// else
				nativePort.postMessage(message);
			
			message.tabId = tabId;
            queue[index] = message;
        } else {
            if (!secondTime) {
                OpenPortConnection(function (obj) {
                    if (obj.res) {
                        //console.log("backGround.js: sendNativeMessage : request begin ", message);
                        message.extensionid = chrome.runtime.id;
                        sendNativeMessage(message, true, tabId);
                    } else {
                        //console.log(" Failed to open port " );
                    }
                });
            }
        }
    }

    function onDisconnected() {
		//console.log("backGround.js: Disconnected " );
		if(chrome.runtime.lastError != undefined){
			let err = chrome.runtime.lastError.message;
			if (err !== undefined) {
				var dt = new Date();
				//console.log(dt);
				//console.log("backGround.js: onDisconnected :  " ,err);				
			}
		}
		if(nativePort != null){
			nativePort.disconnect();
			nativePort = null;
		}
		  
		for(k in queue){
			//console.log('queue[k].method :' , queue[k].method)
			if(queue[k].method=='__twp_scanToPdf'){
				chrome.tabs.sendMessage(queue[k].tabId,{method: queue[k].method});
				delete queue[k];
			}else if(queue[k].method=='__twp_simpleScan'){
				
				//count images and send it with message
				//sendScanDetails();
				chrome.tabs.sendMessage(queue[k].tabId,{method: queue[k].method, detail:  "1 /extension/native/Scan"});
			delete queue[k];
				
			}
			 
			// var item = queue[message.id];
            // delete queue[message.id];
			// chrome.tabs.sendMessage(item.tabId,{detail: message.detail, method: item.method});
		}
		queue = [];
    }

    function onMessage(message) {

		//console.log('backGround.js: response received :',message);
 
        if (message.id) {
            // get callback for index
            var item = queue[message.id];
            delete queue[message.id];
			//console.log('backGround.js: onMessage : sending back to browser');
			chrome.tabs.sendMessage(item.tabId,{detail: message.detail, method: item.method});
			if(nativePort != null) onDisconnected();
        }
    }
	 
	
    function OpenPortConnection(callback) {

		//console.log('backGround.js: OpenPortConnection');


        if (nativePort) {
            var obj = {
                res: false,
                reason: "Already open"
            }
            callback(obj);
            return;
        }
        var hostName = 'com.twain.freelance';
        nativePort = chrome.runtime.connectNative(hostName);

        nativePort.onMessage.addListener(onMessage); 
        nativePort.onDisconnect.addListener(onDisconnected);
        var obj = {
            res: nativePort == null ? false : true
        }
        callback(obj);
    }


    function OnRuntimeMessage(message, sender, sendResponse) {

	//	//console.log('backGround.js: OnRuntimeMessage : request',message,sender);

        if (message.close) {
            nativePort.disconnect();
            sendResponse({ res: true });
            return;
        }

        if (message.open) {
            OpenPortConnection(sendResponse);
            return;
        }

        sendNativeMessage(message, false, sender.tab.id);

        /**
         * 
         * This function becomes invalid when the event listener returns, 
         * unless you return true from the event listener to indicate you wish
         * to send a response asynchronously 
         * 
         * this will keep the message channel open to 
         * the other end until sendResponse is called
         * 
         */
        return true;
    }
	
	
	
	 

    chrome.runtime.onMessage.addListener(OnRuntimeMessage);

})();