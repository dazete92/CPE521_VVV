
var ourTabId = -1;
function sendMessage(message) {
  chrome.tabs.sendMessage(ourTabId, message);
}

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

//listen if background script is suspended
chrome.runtime.onSuspend.addListener(function() {
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({text: ""});
  chrome.tabs.sendMessage(ourTabId, "Background page unloaded.");
});
