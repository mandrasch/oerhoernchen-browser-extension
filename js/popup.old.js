   /*alert("I am popup!");
    sendResponse({
        data: "I am fine, thank you. How is life in the background?"
    }); *
});





  
  var queryInfo = {
    active: true,
    currentWindow: true
  };

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "statusUpdate") {
          $('#status2').text(msg.value);
    }
    return true;
});



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
    $('#status').text('url = '+url);

    checkUrlForOER(url);
  });

});

// 2DO: namespace!

var checkUrlForOER = function (activeUrl){

    var urlParams = new URLSearchParams(window.location.search);

    console.log(urlParams.has('post')); // true
    console.log(urlParams.get('action')); // "edit"
    console.log(urlParams.getAll('action')); // ["edit"]
    console.log(urlParams.toString()); // "?post=1234&action=edit"
    console.log(urlParams.append('active', '1')); // "?post=1234&action=edit&active=1"


    // google image search (basic parameters)
    // https://www.google.com/search?tbm=isch&q=findSomeImage


}