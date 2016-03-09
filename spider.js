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

function statusBar(scanId) {
  var elem = document.getElementById("myBar");   
  var percent = 10;
  var id = setInterval(frame, 100);
  function frame() {
    if (percent >= 100) {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/JSON/spider/view/fullResults/',
        data: scanId,
        dataType: 'json',
        success: function(data) {
          parseOutput(data.fullResults);
        }
      });
      elem.style.width = '5%'; 
      document.getElementById("label").innerHTML = '0%';
      clearInterval(id);
    } 
    else {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/JSON/spider/view/status/',
        data: scanId,
        dataType: 'json',
        success: function(data) {
          percent = data.status;
          elem.style.width = data.status + '%'; 
          document.getElementById("label").innerHTML = data.status * 1  + '%';
        }
       }); 
    }
  }
}

function parseOutput(data) {
  var links = [];
  var urlsInScope = data[0].urlsInScope;
  var urlsOutOfScope = data[1].urlsOutOfScope;

  urlsInScope.forEach(function(value) {
    links.push(value.url + "\n");
    console.log(value.url);
  });
  urlsOutOfScope.forEach(function(value) {
    links.push(value + "\n");
    console.log(value);
  });

  var crawler_data_div = document.getElementById('spiderResults');
  if (links.length != 0) {
    crawler_data_div.innerText = links.join("");
  }
  else {
    crawler_data_div.innerText = "No Links found via Crawler";
  }
}

function setChecked(value) {
  document.getElementById("recurse").checked = value;
  document.getElementById("referer").checked = value;
  document.getElementById("process").checked = value;
  document.getElementById("processPost").checked = value;
  document.getElementById("parseHtml").checked = value;
  document.getElementById("parseRobots").checked = value;
  document.getElementById("parseSitemap").checked = value;
  document.getElementById("parseSvn").checked = value;
  document.getElementById("parseGit").checked = value;
  document.getElementById("handleOData").checked = value;
}

function changeAll() {
  $('#recurse').trigger("change");
  $('#referer').trigger("change");
  $('#process').trigger("change");
  $('#processPost').trigger("change");
  $('#parseHtml').trigger("change");
  $('#parseRobots').trigger("change");
  $('#parseSitemap').trigger("change");
  $('#parseGit').trigger("change");
  $('#parseSvn').trigger("change");
  $('#handleOData').trigger("change");
}

var apiKey;
var url;
var children = 0;
var recurse = 0;
var scanId = 0;
var mainTab;

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

  $('#enable').click(function() {
    setChecked(true);
    changeAll();
  })

  $('#disable').click(function() {
    setChecked(false);
    changeAll();
  })

  $('#recurse').change(function() {
    recurse = ($(this).is(':checked') ? 1 : 0)
    console.log('recurse = ' + recurse)
  })

  $('#referer').change(function() {
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

	$('#process').change(function() { 
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

  $('#processPost').change(function() {
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

  $('#parseHtml').change(function() {
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

  $('#parseRobots').change(function() {
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

  $('#parseSitemap').change(function() {
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

  $('#parseSvn').change(function() {
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

  $('#parseGit').change(function() {
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

  $('#handleOData').change(function() {
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
          scanId = 'scanId=' + data.scan;
          statusBar(scanId);
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
    var spiderUrl = document.getElementById('url_spider');
    spiderUrl.value = url;
  }
  if (msg.homeTab) {
    mainTab = msg.homeTab;
    console.log('homeTab=' + msg.homeTab);
  }
});