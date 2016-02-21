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

function getZAPNumberAlerts(url, callback) {

   var params = "baseurl=" + url;

   $.ajax({
	   type: 'GET',
	   url: 'http://localhost:8080/JSON/core/view/numberOfAlerts/',
	   data: params,
	   dataType: 'json',
	   success: function(data) {
         console.log(data)
         callback(data)         
	   },
      error: function(data) {
         console.log("ERROR: " + data);
      }
	});
}

function getZAPAlerts(url, alertNum, callback) {

   var restData = 'baseurl=' + url + '&start=0&count=' + alertNum
   console.log(restData)

	$.ajax({
	   type: 'GET',
	   url: 'http://localhost:8080/JSON/core/view/alerts/',
	   data: restData,
	   dataType: 'json',
	   success: function(data) {
         callback(data)
	   },
      error: function(data) {
         console.log("ERROR: " + data);
      }
	});
}

function getZAPNumberMessages(url, callback) {

   var params = "baseurl=" + url;

	$.ajax({
	   type: 'GET',
	   url: 'http://localhost:8080/JSON/core/view/numberOfMessages/',
	   data: params,
	   dataType: 'json',
	   success: function(data) {
         console.log(data)
         callback(data)
	   }
	});
}

function getZAPMessages(url, alertNum, callback) {

   var restData = 'baseurl=' + url + '&start=0&count=' + alertNum
   console.log(restData)

	$.ajax({
	   type: 'GET',
	   url: 'http://localhost:8080/JSON/core/view/messages/',
	   data: restData,
	   dataType: 'json',
	   success: function(data) {
         callback(data)
	   },
      error: function(data) {
         console.log("ERROR: " + data);
      }
	});
}

document.addEventListener('DOMContentLoaded', function() {

   var ws = new WebSocket("ws://localhost:10000");
   var key, keyArgument;
   var alerts, messages;
   var json, obj;

   var jsonData = 'apikey=123';

	$('#findVulnBtn').click(function() { 

		chrome.tabs.executeScript(null, {
    file: "findVulnerabilities.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
  })

  $('#enable-active').click(function() {
    if (!$('#active-buttons').is(":visible")) {
      //if (confirm("You're about to enable some invasive tools. Are you sure this website is down with that?")) {
        //Do velociraptor sound byte
        $('#active-buttons').toggle();

      //}
    } else {
      $('#active-buttons').toggle();
    }
  })

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
      getCurrentTabUrl(function(url) {
         var parser = document.createElement('a')
         parser.href = url
         baseUrl = "http://" + parser.hostname + '/'
         getZAPNumberAlerts(baseUrl, function(data) {
            getZAPAlerts(baseUrl, data.numberOfAlerts, function(zapAlerts) {
               console.log(zapAlerts.alerts)
            });
         })

         getZAPNumberMessages(baseUrl, function(data) {
            getZAPMessages(baseUrl, data.numberOfMessages, function(zapMessages) {
               console.log(zapMessages.messages)
            });
         })
      });
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

	$('#b5').click(function() {
		console.log('clicked button 5')
      key = Math.random().toString(16).slice(2)
      keyArgument = "apikey=" + key
      alert(keyArgument + '\n\n' + "Initialize ZAP Instance: > ./zap.sh -daemon -config api.key=<key>")
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

}

window.onload = onWindowLoad;
