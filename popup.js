// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */



function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

document.addEventListener('DOMContentLoaded', function() {

	var ws = new WebSocket("ws://localhost:10000");
	var jsonData = 'apikey=123';
	$('#b1').click(function() { 
		console.log('Enabled All Passive Scanners') 
		ws.send("option1")
		$.ajax({
		   type: 'GET',
		   url: 'http://localhost:8080/JSON/pscan/action/enableAllScanners/',
		   data: jsonData,
		   dataType: 'json',
		   success: function(data) {
		      console.log(data);
		   }
		});	
	})

	$('#b2').click(function() {
		console.log('Disabled All Passive Scanners')
		ws.send("option2")
		$.ajax({
		   type: 'GET',
		   url: 'http://localhost:8080/JSON/pscan/action/disableAllScanners/',
		   data: jsonData,
		   dataType: 'json',
		   success: function(data) {
		      console.log(data);
		   }
		});	
	})

	$('#b3').click(function() {
		console.log('clicked button 3')
		ws.send("option3")

	})

	$('#b4').click(function() {
		console.log('clicked button 4')
		ws.send("option4")
		$.ajax({
		   type: 'GET',
		   url: 'http://localhost:8080/JSON/pscan/view/scanners/',
		   dataType: 'json',
		   success: function(data) {
		      console.log(data);
		   }
		});	
	})

	//socket.connect('http://localhost:10000', {autoConnect : true});

	console.log('check');

});


//Grab the current pages HTML

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;
