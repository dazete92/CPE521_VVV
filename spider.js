// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */

//initial stuff

//functions and listeners
/*function getCurrentTabUrl(callback) {
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
}*/

var apiKey;
var url;
var childen = 0;
var recurse = 0;

document.addEventListener('DOMContentLoaded', function() {

  console.log("dom loaded")

  $('#depth').change(function() {
    var restData = apiKey + '&Integer=' + document.getElementById("depth").value;
    console.log('depth = ' + document.getElementById("depth").value)    
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionMaxDepth/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#children').change(function() { 
    children = document.getElementById("children").value
    console.log('children = ' + children)
  })

  $('#recurse').click(function() {
    recurse = ($(this).is(':checked') ? 1 : 0)
    console.log('recurse = ' + recurse)
  })

  $('#referer').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionSendRefererHeader/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

	$('#process').click(function() { 
    if ($(this).is(':checked')) {
      var restData = apiKey + '&Boolean=true';
      console.log(restData)
      document.getElementById("processPost").disabled = false

      $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/JSON/spider/action/setOptionProcessForm/',
        data: restData,
        dataType: 'json',
        success: function(data) {
          console.log(data);
        }
      });
    }
    else {
      var restData = apiKey + '&Boolean=false';
      console.log(restData)
      document.getElementById("processPost").disabled = true
      document.getElementById("processPost").checked = false

      $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/JSON/spider/action/setOptionProcessForm/',
        data: restData,
        dataType: 'json',
        success: function(data) {
          console.log(data);
        }
      });
      $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/JSON/spider/action/setOptionPostForm/',
        data: restData,
        dataType: 'json',
        success: function(data) {
          console.log(data);
        }
      });
    }
	})

  $('#processPost').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionPostForm/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#parseHtml').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionParseComments/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#parseRobots').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionParseRobotsTxt/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#parseSitemap').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionParseSitemapXml',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#parseSvn').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionParseSVNEntries/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#parseGit').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionParseGit/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#handleOData').click(function() {
    var restData = apiKey + '&Boolean=' + ($(this).is(':checked') ? true : false);
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/setOptionHandleODataParametersVisited/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
       }
    });
  })

  $('#crawl').click(function() {
    var restData = apiKey + '&url=' + url + '&maxChildren=' + children + '&recurse=' + recurse;
    console.log(restData)
    $.ajax({
       type: 'GET',
       url: 'http://localhost:8080/JSON/spider/action/scan/',
       data: restData,
       dataType: 'json',
       success: function(data) {
          console.log(data);
          // use scan id to get info
       }
    });
  })

});

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if (msg.key) {
    console.log("Got message from background page: " + msg.key);
    apiKey = msg.key;
  }
  if (msg.url) {
    console.log("Got message from background page: " + msg.url);
    url = msg.url
  }
});