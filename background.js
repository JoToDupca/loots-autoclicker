chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        if (request.chatFound) {
            chrome.pageAction.show(sender.tab.id);
            chrome.pageAction.setTitle({tabId: sender.tab.id, title: "Loots Auto-Clicker: Active!"});
            sendResponse({registered: true});
        }


        if (request.linkFound) {

            var delay = Math.floor((Math.random() * 3000) + 2000);
            var timeout = Math.floor((Math.random() * 4000) + 8000);

            setTimeout(function(){
                chrome.tabs.create({"url": request.linkURL, "active": false},
                    function (tab) {
                        setTimeout(function () {
                            chrome.tabs.remove(tab.id);
                        }, timeout)
                    }
                )
            }, delay);
            sendResponse({loots: true});
        }

    });

