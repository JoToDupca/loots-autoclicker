chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.chatFound) {
      chrome.pageAction.show(sender.tab.id);
      chrome.pageAction.setTitle({tabId: sender.tab.id, title: "Loots Auto-Clicker: Active!"});
      sendResponse({registered: true});
    }


    if (request.linkFound) {
      chrome.tabs.create({"url": request.linkURL, "active": false},
        function(tab) {
          setTimeout( function() {
            chrome.tabs.remove(tab.id);
          }, 10000)
        }
      )
      sendResponse({loots: true});
    }

  });
