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

/*
function xss() {
  var element = document.getElementById();
  var xssList = {'<script>alert('xss'));</script>;'}

  for (int i=0; i<xssList.length; i++) {
    var url = xssList[i]
  }
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
*/

function makeOrderedList(alerts) {
  var container = document.getElementById('passiveAlerts');
  var alertList = document.createElement('ol');
  alertList.className = "alertList";
  alertList.type = "1";
  container.appendChild(alertList);

  if (alerts.length != 0) {
    alerts.forEach(function (alert) {
      var alertName = document.createElement('li');
      alertName.appendChild(document.createTextNode(alert.alert + " (" + alert.url + ")"));

      var eulist = document.createElement('ul');

      var item = document.createElement('li');
      item.appendChild(document.createTextNode("Description: " + alert.description));
      eulist.appendChild(item);

      $.each(alert, function (field) {
        if (field == "solution" || field == "reference" || field == "risk") {
            item = document.createElement('li');
            fieldLabel = field.toString().charAt(0).toUpperCase() + field.toString().slice(1);
            item.appendChild(document.createTextNode(fieldLabel + ": " + alert[field]));
            eulist.appendChild(item);
        }
      });

      item = document.createElement('li');
      item.appendChild(document.createTextNode("More Information: " + alert.other));
      eulist.appendChild(item);

      alertName.addEventListener("click", function () {
        $(this).find('ul').slideToggle();
      });

      eulist.style.cssText = 'display: none;'
      alertName.appendChild(eulist);
      alertList.appendChild(alertName);
    });
  }
  else {
    var noAlertsFound = document.createElement('li');
    noAlertsFound.appendChild(document.createTextNode("No Alerts Found"));
    alertList.appendChild(noAlertsFound);
  }

}

//interactions with the HTML
document.addEventListener('DOMContentLoaded', function() {
   var key;
   //var keyArgument;
   var alerts, messages;
   var json, obj;

   var keyArgument = 'apikey=123';

   //scanInfo.innerText = localStorage.savedText;

	$('#findVulnBtn').click(function() {

    //inject script into last known tab
    console.log("scan" + lastActiveTab);
		chrome.tabs.executeScript(lastActiveTab, {
    file: "findVulnerabilities.js"
    }, function(results) {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        scanInfo.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
  })

  $('div.gen_info').click(function() {
    var id = $(this).attr('id')
    console.log(id)
    var c_name = "div.".concat(id).concat("info")
    console.log(c_name)
    $(c_name).slideToggle()
  });

  $('div.cinfo').click(function() {
    var child = $(this).children('.desc')
    child.slideToggle()         
  });

  $('div.xinfo').click(function() {
    var child = $(this).children('.desc')
    child.slideToggle()         
  });

  /*$('#enable-active').click(function() {
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
		$.ajax({
		   type: 'GET',
		   url: 'http://localhost:8080/JSON/pscan/action/disableAllScanners/',
		   data: jsonData,
		   dataType: 'json',
		   success: function(data) {
		      console.log(data);
		   }
		});	
	})*/

	// $('#zapPassive').click(function() {
	// 	console.log('clicked button 3')

 //    if($(this).is(':checked')) {
 //       var parser = document.createElement('a');
 //       parser.href = targetURL;
 //       var baseUrl = "http://" + parser.hostname;

 //       getZAPNumberAlerts(baseUrl, function(data) {
 //          getZAPAlerts(baseUrl, data.numberOfAlerts, function(zapAlerts) {
 //            var results = zapAlerts.alerts;
 //            var alerts = [];
 //            results.forEach(function(alert) {
 //              if (alert.url == targetURL) {
 //                alerts.push(alert);
 //              }
 //            });
 //            console.log(alerts);
 //            makeOrderedList(alerts);
 //          });
 //       })
 //    }
 //    else {
 //      var node = document.getElementById('passiveAlerts');
 //      while (node.firstChild) {
 //        node.removeChild(node.firstChild);
 //      }
 //    }

 //     /*getZAPNumberMessages(baseUrl, function(data) {
 //        getZAPMessages(baseUrl, data.numberOfMessages, function(zapMessages) {
 //           console.log(zapMessages.messages)
 //        });
 //     })*/
	// })

	$('#crawl').click(function() {
    var spiderURL = targetURL

    //chrome.windows.create({'url': 'spider.html', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
    chrome.tabs.create({'url': 'spider.html'} , function(tab) {
      chrome.tabs.executeScript(tab.id, {file: "spider.js"}, function() {
      // Note: we also sent a message above, upon loading the event page,
      // but the content script will not be loaded at that point, so we send
      // another here.
        setTimeout(function() {
          chrome.tabs.sendMessage(tab.id, {homeTab: myTabId, key: keyArgument, url: spiderURL});
        }, 500);
        console.log('loaded script in window');
      });
    })
    document.getElementById("crawl").checked = false;

	})

	$('#ZAPClick').click(function() {
		console.log('clicked button 5')
    key = Math.random().toString(16).slice(2)
    keyArgument = "apikey=" + key
    prompt("Use this command to start ZAP:", "./zap.sh -daemon -config api.key=" + key)
    document.getElementById('ZAPClick').disabled = true;
	})

});

//check for new tabs
var lastActiveTab;
var myTabId;
var lastActiveDomain;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.getCurrent(function(tab){myTabId = tab.id;});

  if (myTabId && activeInfo.tabId != myTabId) {
    lastActiveTab = activeInfo.tabId;

    chrome.tabs.get(activeInfo.tabId, function(tab) {
      lastActiveDomain = tab.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1];
      scanPage();

      document.getElementById('activePageTitle').innerText = "Active Page: " + lastActiveDomain;
      console.log("lastActive: " + lastActiveTab + ", my: " + myTabId + " domain: " + lastActiveDomain);
    });
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  if (windowId != -1) {

    chrome.tabs.query({'windowId': windowId, 'active': true}, function(tabs) {
      if (myTabId && tabs[0].id != myTabId) {
        
        lastActiveTab = tabs[0].id;
        lastActiveDomain = tabs[0].url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
        scanPage();

        document.getElementById('activePageTitle').innerText = "Active Page: " + lastActiveDomain;
        console.log("window focus change - lastActive: " + lastActiveTab + ", my: " + myTabId + " domain: " + lastActiveDomain);
      }
      //console.log("window id:" + windowId);
    }); 
  }
});

function scanPage() {
  pageCookies = []
  console.log()
  //if (document.getElementById('passiveScan').checked) {
    //inject script into last known tab
    console.log("scan" + lastActiveTab);
    chrome.tabs.executeScript(lastActiveTab, {
    file: "findVulnerabilities.js"
    }, function(results) {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        scanInfo.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
 //}
  console.log(lastActiveDomain)
  getCookies(lastActiveDomain, function(cookies) {
    filterCookies(pageCookies, cookies)
  })
}

$(document).ready(function() 
{
  $('.topButton').click(function() {
    if (!$(this).hasClass('clicked'))
    {
      $('.topButton').removeClass('clicked')
      $(this).addClass('clicked')
    }

    if ($(this).is("#active"))
    {
      $('.activeOnly').removeAttr("disabled")
      $('.activeBox').removeClass('deactivatedBox')
      //TODO uncheck any active boxes that are checked
    } else {
      $('.activeOnly').attr("disabled", true);
      $('.activeOnly').attr("checked", false);
      $('.activeBox').addClass('deactivatedBox')
    }
  })

  $('.zapButton').click(function() {
    //ZAP BUTTON STUFF GOES HERE
  })
});

function filterCookies(pageCookies, cookies) {
  var parser = document.createElement('a')
  parser.href = targetURL
  var domains = parser.hostname.split('.')
  console.log(domains)
  var string = domains[domains.length - 1]

  for (j = 0; j < cookies.length; j++) {
    for (i = domains.length - 2; i >= 0; i--) {
      string = domains[i] + '.' + string
      string2 = "." + string
      console.log(cookies[j].domain, string)
      if (cookies[j].domain == string || cookies[j].domain == string2) {
        pageCookies.push(cookies[j])
        break
      }
    }
    string = domains[domains.length - 1]
  }
  console.log(pageCookies)
}

function getCookies(target, callback) {
  var parser = document.createElement('a')
  var domains = target.split('.')
  console.log(domains)

  var string = domains[domains.length - 1]
  for (i = domains.length - 2; i >= 1; i--) {
    string = domains[i] + '.' + string
    console.log(string)
    chrome.cookies.getAll({domain: string}, function(cookies) {
      callback(cookies)
    })
  }
}


//Grab the current pages HTML
var contentWindowId;
var targetURL;
var attackSurface;

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if (msg.clicked) {
    console.log(msg);

    var detail_id = document.getElementById('detailId');
    var detail_type = document.getElementById('detailType');
    var detail_content = document.getElementById('detailContent');
    var detail_vuln = document.getElementById('detailVuln');

    detail_id.innerText = "ID: " + msg.detail_id;
    detail_type.innerText = "Type: " + msg.detail_type;
    detail_content.innerText = msg.detail_content;
    detail_vuln.innerText = "Likely Vulnerable To: " + msg.detail_vuln;
  }
  if (msg.attackSurface) {
    attackSurface = JSON.parse(msg.attackSurface);
    var list = document.getElementById("attackSurfaceList");
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
   /*list.addEventListener("click", function(e) {
          console.log(e.target);
          document.getElementById("detailContent").innerText = e.target.id;
      });*/

    $(list).click(function(event) {
        // this.append wouldn't work
        console.log("clicked");
        $("#detailId")[0].innerText = "ID: " + event.target.textContent;
        //$("#detailType")[0].innerText = "Type: " + event.target.firstElementChild.value.type;
        $("#detailContent")[0].innerText = event.target.firstElementChild.value;
        console.log(event.target);
        $('.listClicked').removeClass('listClicked');
        event.target.addClass('listClicked');
    });

    for (var i=0; i < attackSurface.length; i++) {
      console.log("as:" + attackSurface[i]);
      var idStr = attackSurface[i][0];
      if (idStr == null) {
        idStr = "<No ID String>";
      }

      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(idStr));
      var hiddenDetail = document.createElement("input");
      hiddenDetail.setAttribute("type", "hidden");
      hiddenDetail.setAttribute("name", "content");
      hiddenDetail.setAttribute("value", attackSurface[i][2]);
      entry.appendChild(hiddenDetail)
      list.appendChild(entry);
    }
  }
  if (msg.content_window_id) {
    contentWindowId = msg.content_window_id;
    console.log("window id: " + contentWindowId);
  }
  if (msg.target_url) {
    if (msg.target_url.indexOf("http") > -1 ) {
      targetURL = msg.target_url;
      console.log("tab url: " + targetURL);

      //document.getElementById('activePageTitle').innerText = "Active Page: " + targetURL;
    }
  }
  if (msg.scanResults) {
    var scan_info_div = document.getElementById('scanInfo');

    scan_info_div.innerText = msg.scanResults;
    console.log(msg.scanResults);
  }

  if (msg.cookies) {
    document.getElementById('cookiesScroll').innerText =  msg.cookies;
  }

  if (msg.url_params) {
    document.getElementById('pageUrlParams').innerText = msg.url_params;
  }

  if (msg.header) {
    document.getElementById('pageHeader').innerText = msg.header;
  }

  /*if (msg.spiderResults) {
    var crawler_data_div = document.getElementById('crawler_data');
    crawler_data_div.innerText = msg.spiderResults;
  }*/

  console.log("Got message from background page" + JSON.stringify(msg));
});