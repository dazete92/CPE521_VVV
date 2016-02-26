
var ourTabId = -1;
function sendMessage(input_text) {
  chrome.tabs.query({'title': 'Vulociraptor'}, function(tabs) {
    ourTabId = tabs[0].id;
    chrome.tabs.sendMessage(ourTabId, input_text);
  });
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
  var startText = "empty";

  chrome.tabs.executeScript(null, {
    file: "findVulnerabilities.js"
    }, function(results) {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        alert('There was an error injecting script : \n' + chrome.runtime.lastError.message);
      }
      else {
        startText = results;
      }
    });

  chrome.tabs.create({url: "infoWindow.html"}, function(tab) {
    chrome.tabs.executeScript(tab.id, {file: "infoWindow.js"}, function() {
      // Note: we also sent a message above, upon loading the event page,
      // but the content script will not be loaded at that point, so we send
      // another here.
      sendMessage(startText);
    });
  });
});

/*
chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.create({url: "http://www.google.com/"});
});
*/

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if (msg.clicked) {
    sendMessage({"clicked": true, "extra": msg.extra});
  }
  // If we don't return anything, the message channel will close, regardless
  // of whether we called sendResponse.
});

chrome.runtime.onSuspend.addListener(function() {
  chrome.tabs.query({'title': 'Vulociraptor'}, function(tabs) {
    // After the unload event listener runs, the page will unload, so any
    // asynchronous callbacks will not fire.

  });
  console.log("Unloading.");
  chrome.browserAction.setBadgeText({text: ""});
  ourTabId = tabs[0].id;
  chrome.tabs.sendMessage(ourTabId, "Background page unloaded.");
});
