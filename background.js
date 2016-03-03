
var ourTabId = -1;
function sendMessage(message) {
  chrome.tabs.sendMessage(ourTabId, message);
}
/*
chrome.tabs.query({'title': 'Vulociraptor'}, function(tabs) {
    ourTabId = tabs[0].id;
    chrome.tabs.sendMessage(ourTabId, input_text);
});*/

//sendMessage("");
chrome.browserAction.setBadgeText({text: "ON"});
console.log("Loaded.");

chrome.runtime.onInstalled.addListener(function() {
  console.log("Installed.");

});

chrome.browserAction.onClicked.addListener(function() {
  // The event page will unload after handling this event (assuming nothing
  // else is keeping it awake). The content script will become the main way to
  // interact with us.
  //var startText = "empty";

  //get current windowID and targetURL
  var windowId = null;
  var targetURL = null;

  chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
    targetURL = tabs[0].url;
  });

  chrome.windows.getCurrent(function(win) {
      windowId = win.id;
  });

  //inject script into page we want to scan
  chrome.tabs.executeScript(null, {
    file: "findVulnerabilities.js"
    }, function(results) {
      if (chrome.runtime.lastError) {
        alert('There was an error injecting script : \n' + chrome.runtime.lastError.message);
      }
      else {
        //handle initial results from script
        startText = results;
      }
    });

  //open info window
  chrome.tabs.create({url: "infoWindow.html"}, function(tab) {
    chrome.tabs.executeScript(tab.id, {file: "infoWindow.js"}, function() {
      //set the tab iD for the info Window
      ourTabId = tab.id;
      sendMessage(results);
    });
    //wait for page to load and set basic first info
    setTimeout(function() {
        sendMessage({from_content_page: false, content_window_id: windowId, target_url: targetURL});
      }, 500);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  sendMessage({target_url: changeInfo.url});
});

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  /*if (msg.from == "content_script") {
    sendMessage(msg);
  }
  /*
  if (msg.from == "info_window") {
    if (msg.performAction == "inject_script") {
      //get open tab from other window
      chrome.tabs.getSelected(contentWindowId, function(tab) {      
        //inject script into that tab
        chrome.tabs.executeScript(tab.id, 
          {file: "findVulnerabilities.js"},
          function(results) {

            // If you try and inject into an extensions page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
              results = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
            }

            //send results back to infoWindow
            sendMessage({from_content_page: false, scanResults: results});
        });
      }
    }
  }*/
  // If we don't return anything, the message channel will close, regardless
  // of whether we called sendResponse.
});

//listen if background script is suspended
chrome.runtime.onSuspend.addListener(function() {
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({text: ""});
  chrome.tabs.sendMessage(ourTabId, "Background page unloaded.");
});
