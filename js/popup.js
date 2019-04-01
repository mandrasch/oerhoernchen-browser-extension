// logging will not be in main window!:
// https://stackoverflow.com/questions/14858909/cannot-get-chrome-popup-js-to-use-console-log

// https://stackoverflow.com/questions/3829150/google-chrome-extension-console-log-from-background-page
//console = chrome.extension.getBackgroundPage().console;


console.log('OERhörnchen: Start popup.js');


// ready function for popup.html
$(document).ready(function() {

    // this script will run everytime user clicks the plugin icon
    // test with alert('Start');

    console.log('OERhörnchen: jquery ready for popup.html');

    // hide the divs if we're in popup dialogue on chrome
    if (typeof chrome.tabs !== 'undefined') {
        $("#google, #no-results").css('display','none');
    }

    /* global vars */
    var popupUrlList = [];

    /* events */
    // click events -> open in same window
    // we don't need it right now, interferes with other stuff
    /*$('body').on('click', 'a', function(e){
        e.preventDefault();
        console.log('OERhörnchen click event captured');

        var newUrl = $(this).attr('href');
        console.log('OERhörnchen new url for tab:',newUrl);

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: newUrl});
        });

        // create new tab with new url
        // chrome.tabs.create({url: newUrl});

        // 2DO: replace current tab url?
    }); // eo click event*/

    $("a#options").on('click',function(e){
      e.preventDefault();
      window.close();
    })


  // get current tab url (async) and match the url with our list
    if (typeof chrome.tabs !== 'undefined') {
      chrome.tabs.query({active:true,currentWindow:true}, function (tabs) {
        console.log('OERhörnchen: Url from chrome tabs query',tabs,tabs[0].url);
        var urlString = tabs[0].url;

        // init class with window object
        var ResultListConverter = new ResultListConverterClass();
        ResultListConverter.init(urlString);

        var currentTabHostName = ResultListConverter.getUrlWithoutParams();
        //$(location).attr('hostname');

        // generate json file url in extension
        var websiteListUrl = chrome.runtime.getURL('data/websitelist.json');

        // prepare for json loading
        $.ajaxSetup({
          "error":function(data) { console.log('OERhörnchen: Ajax error, most of times because invalid json ;-)',data)  }
        });

        $.getJSON(websiteListUrl, function(websiteList) {

          console.log('OERhörnchen: Loaded website list json');

          // beware: quick&dirty, i know regexes would be prettier 
          var matchFound = false;
          // go through website list:
          for (var i = 0; i < websiteList.length; i++) {
            console.log("OERhörnchen: Check hostname "+currentTabHostName+" for: "+websiteList[i].name, websiteList[i]);

            // https://stackoverflow.com/a/43615512
            // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
            if(websiteList[i].hostname_search_array.some(el => currentTabHostName.includes(el))){

              console.log('OERhörnchen: Detected hostname match',websiteList[i].hostname_search_array);
              matchFound = true;
              // call custom function dynamically
              // see: https://stackoverflow.com/questions/969743/how-do-i-call-a-dynamically-named-method-in-javascript
              console.log("OERhörnchen: Call custom function for "+websiteList[i].name);
              var methodName = ""+websiteList[i].name+"";
              var arg1 = 1;
              ResultListConverter[methodName](arg1);

              // render results
              var popupUrls = ResultListConverter.getPopupUrls();
              for (var i = 0; i < popupUrls.length; i++) {
                console.log("OERhörnchen: Process url ",popupUrls[i]);
                $("#newUrlList").append("<a href='"+popupUrls[i].url+"'>"+popupUrls[i].title+"</a>");
              } // eo for popupurl list
            } // eo if hostname check was successful

          } // eo for website list

          if(matchFound == false)
          {
            $("#loading").hide();
            $("#no-results").show();
          }

        }); // eo getJson (async)
      }); // eo chrome tabs query (async)
  } // eo if chrome undefined
  else{
    console.log('Chrome not defined, dev mode');
  }
}); // eo jquery ready