var popupWindow = window.open(
		    chrome.extension.getURL("popup_normal.html"),
		    "exampleName",
		    "width=400,height=400"
		);
		window.close();