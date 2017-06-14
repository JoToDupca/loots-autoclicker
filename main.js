// chat element classes
chatClass_ul = ".chat-lines";
chatClass_msg1 = ".message-line";
chatClass_msg2 = ".chat-line";
chatClass_text = ".message";

// twitch chat message element
var parseMsgHTML = function (msgHTML) {

    // parent node
    var rootObject = msgHTML.prevObject[0];

    // check for broadcaster badge
    var badges = rootObject.getElementsByClassName("balloon balloon--tooltip balloon--up");
    var isBroadcaster = false;
    for (i = 0; i < badges.length; i++) {
        if (badges[i].innerText == "Broadcaster") {
            isBroadcaster = true;
            break;
        }
    }

    // if is broadcaster
    if (isBroadcaster) {
        // get link from messae
        var links = rootObject.getElementsByClassName("message")[0].getElementsByTagName("A");
        if (links.length > 0) {
            // get href attribute
            var link = links[0].getAttribute("HREF");
            if (link.indexOf("https://loots.com/t/") == 0) {
                // run background script                
                chrome.runtime.sendMessage({linkFound: true, linkURL: link}, function (response) {
                    if (response.loots) {
                        console.log("Loots link found.");
                    }
                });
            }
        }
    }
};

// chat listener
function chatListener() {
    // attach listener that acts when a new chat message appears
    return new MutationObserver(function (mutations) {
        // for each mutation object, look for the addedNode object
        mutations.forEach(function (mutation) {
            // added node
            mutation.addedNodes.forEach(function (addedNode) {
                var chatMessage = $(addedNode);
                if (!chatMessage.is(chatClass_msg1, chatClass_msg2)) {
                    // not a chat message, skip processing
                    return;
                }
                // grab the actual span element with the message content
                var messageElement = chatMessage.children(chatClass_text);
                parseMsgHTML(messageElement);
            });
        });
    });
}

// observer configuration
var config = {attributes: false, childList: true, characterData: false};
var chatObserver = chatListener();

// wait until the page is done loading in order to be able to grab chat
var htmlBody = $("body")[0];
var chatLoadedObserver = new MutationObserver(function (mutations, observer) {
    mutations.forEach(function (mutation) {
        var chatSelector = $(chatClass_ul);
        if (chatSelector.length > 0) {

            // select the node element
            var target = chatSelector[0];
            chatObserver.observe(target, config);

            // alert page action that chat is found
            chrome.runtime.sendMessage({chatFound: true}, function (response) {
                if (response.registered) {
                    console.log("Twitch Chat found.");
                }
            });

            // unregister chatLoadedObserver, no need to check for the chat element anymore
            observer.disconnect();
        }
    })
});

chatLoadedObserver.observe(htmlBody, config);
