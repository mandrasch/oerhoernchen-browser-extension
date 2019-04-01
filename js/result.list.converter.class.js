var ResultListConverterClass = function() {

  /* general */
  this.init = function(urlString) {

    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams
    // Pass in a string literal

    this.originalUrlString = urlString;

    this.urlObject = new URL(urlString); // https://developer.mozilla.org/en-US/docs/Web/API/URL
    /* hash
    host
    hostname
    href
    origin
    password
    pathname
    port
    protocol
    search
    searchParams
    username */
    this.urlParamsObject = new URLSearchParams(this.urlObject.search); // https://developer.mozilla.org/de/docs/Web/API/URLSearchParams

    // https://stackoverflow.com/questions/6257463/how-to-get-the-url-without-any-parameters-in-javascript
    this.urlWithoutParams = urlString.split('?')[0];
    // tempUrlObject.origin + tempUrlObject.pathname ?

    this.popupUrls = [];
  }

  this.getUrlWithoutParams = function() {
    return this.urlWithoutParams;
  }

  // url string
  this.addPopupUrl = function(title, url) {
    this.popupUrls.push({
      "title": title,
      "url": url
    });
    console.log('OERhörnchen: Added popup url', this.popupUrls);
  }

  this.getPopupUrls = function() {
    return this.popupUrls;
  }

  // must be called at the end of custom functions
  /*this.save = function (){
    // 2DO: use local storage? Is this async?
    var popupUrls = this.popupUrls;
    chrome.storage.sync.set({'popupUrls': popupUrls}, function() {
      console.log('OERhörnchen: Value in local storage set for popupUrls',popupUrls);
    });
  }*/

  this.changeIconToGreen = function() {
    // found something, change icon:
    console.log("OERhörnchen: Change icon to indicate status");
    chrome.runtime.sendMessage({
      action: 'updateIcon',
      value: true
    });
  }

  /* custom page methods */

  // small helper
  this.googleShowSuccessMessageFilterSet = function() {
    $("#google > .toast-info").hide();
    $("#google > .toast-success").show();
    $("#google-filter-results > span:first").html('Lizenzfilter aktualisieren');
    $("#google-filter-results ").removeClass('btn-error').addClass('btn-success');
  }

  this.googleChangeSubmitButtonToError = function() {
    $("#google > .toast-info").show();
    $("#google > .toast-success").hide();
    $("#google-filter-results > span:first").html('Lizenzfilter aktivieren');
    $("#google-filter-results ").removeClass('btn-success').addClass('btn-error');
  }

  this.googleResetImageSearch = function() {
    // 2DO: set parameter and reload page
  }

  this.googleResetWebSearch = function() {
    // 2DO: set parameter and reload page
  }

  this.googleCheckIfFilterAlreadySet = function(){

    // this is strange: on google search results page 2, the url parameters change to tbs=sur:fc (like image search)
    console.log('Check if filter is alreay set');

    if (this.urlParamsObject.has('as_rights') 
        || (this.urlParamsObject.has('tbs') && this.urlParamsObject.get('tbs').includes('sur:f'))
        ) {
        console.log('license filter was previously set, examine further');

        this.googleShowSuccessMessageFilterSet();
        
        // the following is only supposed to be used in web search,not image search
          switch (this.urlParamsObject.get('as_rights')) {
            case '(cc_publicdomain|cc_attribute|cc_sharealike).-(cc_noncommercial|cc_nonderived)':
              // no need to do something, bot checkboxes are not checked by default
              break;
            case '(cc_publicdomain|cc_attribute|cc_sharealike|cc_noncommercial).-(cc_nonderived)':
              $("input[name='google-include-nc']").prop('checked', true);
              break;
            case '(cc_publicdomain|cc_attribute|cc_sharealike|cc_nonderived).-(cc_noncommercial)':
              $("input[name='google-include-nd']").prop('checked', true);
              break;
            case '(cc_publicdomain|cc_attribute|cc_sharealike|cc_noncommercial|cc_nonderived)':
              $("input[name='google-include-nc']").prop('checked', true);
              $("input[name='google-include-nd']").prop('checked', true);
              break;
          } // eo switch
        
        switch (this.urlParamsObject.get('tbs')) {
          case "surf:fmc":
            // fmc -> easy oer, needs no further selection, because both checkboxes are not checked by default
            break;
          case 'sur:fm':
            $("input[name='google-include-nc']").prop('checked', true);
            break;
          case 'sur:fc':
            $("input[name='google-include-nd']").prop('checked', true);
            break;
          case 'sur:f':
            $("input[name='google-include-nc']").prop('checked', true);
            $("input[name='google-include-nd']").prop('checked', true);
            break;
        } // eo switch
      } // eo already set license filter
  }

  /* 
    ##########################################
    ####### google web & image search ########
    ##########################################
   */
  this.google = function() {

    console.log('start result list converter for google');

    // google does not offer the possibility to search for CC BY, but not CC BY-SA
    // these are the possible cases with 
    var urlOnlyEasyOer = ''; // = CC0/Public Domain, CC BY, CC BY-ShareAlike
    var urlIncludeNc = ''; // + noncommercial, covered by UNESCO def, but really complicated; exclude ND
    var UrlIncludeNd = ''; // + no derivatives (not OER by UNESCO def), exclude NC
    var urlIncludeNcNd = ''; // + nc/nd, nd not OER by UNESCO def.

    $("#loading").hide();
    $("#google").show();

    // check if license filter was already set (same function for web and image search)
    this.googleCheckIfFilterAlreadySet();


    // clone the original url, create new urls for each case:
    var tempUrlObject = new URL(this.originalUrlString);
    var tempParamsObject = new URLSearchParams(tempUrlObject.search);
    // if we change license params, we need to return to page 1
    // 2DO: let user only submit if license filter changed
    tempParamsObject.set("start","0");

    /* 
    ##################################
    ####### google web search ########
    ##################################
    */
    if (this.urlObject.pathname.includes('/search') && !this.urlParamsObject.has('tbm')) {
      console.log('Google web search website detected');

      // set new urls for each case

      tempParamsObject.set('as_rights', "(cc_publicdomain|cc_attribute|cc_sharealike).-(cc_noncommercial|cc_nonderived)");
      urlOnlyEasyOer = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      tempParamsObject.set("as_rights","(cc_publicdomain|cc_attribute|cc_sharealike|cc_noncommercial).-(cc_nonderived)");
      urlIncludeNc = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      tempParamsObject.set("as_rights","(cc_publicdomain|cc_attribute|cc_sharealike|cc_nonderived).-(cc_noncommercial)");
      urlIncludeNd = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      tempParamsObject.set("as_rights","(cc_publicdomain|cc_attribute|cc_sharealike|cc_noncommercial|cc_nonderived)");
      urlIncludeNcNd = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

    } // eo web search


    /* 
    ##################################
    ###### google image search #######
    ##################################
    */
    // 2DO: image search without search query entered: https://www.google.de/imghp?hl=de
    if (this.urlParamsObject.has('tbm') && this.urlParamsObject.get('tbm') == 'isch') {

      console.log('Google image search website detected');


      // --> getParams --> set checkboxes accordingly input[name='google-include-nc']:checked").val(
      // display message, that filter is active (switch)

      // 2DO: append license:
      // console.log(urlParams.append('active', '1'));
      // 2DO: this.urlWithoutParams PLUS this.urlParams.toString()
      /*case 'only-oer':
            url_license_filter = 'fmc';
            break;
          case 'nc':
            url_license_filter = 'fm';
            break;
          case 'nc-nd':
            url_license_filter = 'f';
            break;
          case 'no-filter':
            url_license_filter = '';
            break;*/

      // 2DO: what if parameter was already set? use set/append
      //var newUrl = this.urlWithoutParams + '?' + this.urlParamsObject.toString();


      // set params for each case
      tempParamsObject.set('tbs', "sur:fmc");
      urlOnlyEasyOer = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      tempParamsObject.set('tbs', "sur:fm");
      urlIncludeNc = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      // 2DO: is this correct?
      tempParamsObject.set('tbs', "sur:fc");
      urlIncludeNd = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      tempParamsObject.set('tbs', "sur:f");
      urlIncludeNcNd = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      //this.addPopupUrl('CC0,CC-BY,CC-BY-SA',newUrl+'&tbs=sur:fmc');
      //this.addPopupUrl('CC0,CC-BY,CC-BY-SA + NC',newUrl+'&tbs=sur:fm');
      //this.addPopupUrl('CC0,CC-BY,CC-BY-SA + NC/ND',newUrl+'&tbs=sur:f');
      //this.save();
      //this.changeIconToGreen();


    } // eo image search

    // 2DO: neither web nor image search detected (possible?)


    /* #########################################
    ###### events for web & image search #######
    ############################################ */

    // 2DO: add listener for button clicks for image search
      var parent = this;
      $("#google-filter-results").on('click', function() {

        console.log('click - filter results', $(this));

        var urlToOpen = '';
        // checkbox selection by user

        var includeNc = Boolean($("input[name='google-include-nc']:checked").val());
        var includeNd = Boolean($("input[name='google-include-nd']:checked").val());
        console.log('checkbox submission by user (NC, ND)', includeNc, includeNd)

        // 2DO: use switch case or better

        if (includeNd === false && includeNc === false) {
          // no nc content, so no nd - only oer withtout usage scenario restriction
          console.log('set url to - without nc/nd');
          urlToOpen = urlOnlyEasyOer;
        }

        if (includeNc === true && includeNd === true) {
          console.log('set url to - nc+nd');
          urlToOpen = urlIncludeNcNd;
        }

        if (includeNc === true && includeNd === false) {
          console.log('set url to - nc / without nd');
          urlToOpen = urlIncludeNc;
        }

        if (includeNd === true && includeNc === false) {
          console.log('set url to - nd / without nc');
          urlToOpen = urlIncludeNd;
        }

        console.log('try to open new url', urlToOpen);
        // 2DO: put in function?
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
          var tab = tabs[0];
          chrome.tabs.update(tab.id, {
            url: urlToOpen
          });

          // 2do: put in function --> is used above when we detect a filter which was set
          // window.close();
          parent.googleShowSuccessMessageFilterSet();

        });
        // this should be in promise of .query, but did not work
      }) // eo button submit click


    // reset image search filter action (for both image or web search)
    var parent = this;
    $("#google-reset").on('click', function(e) {

      // 2DO: check if web or image search?

      e.preventDefault();

      var tempUrlObject = new URL(parent.originalUrlString);
      var tempParamsObject = new URLSearchParams(tempUrlObject.search);

      // set params for each case
      tempParamsObject.set('tbs', "sur:");
      tempParamsObject.set('as_rights', "");
      tempParamsObject.set('start', "0");
      resetUrl = tempUrlObject.origin + tempUrlObject.pathname + '?' + tempParamsObject.toString();

      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {
          url: resetUrl
        });
        window.close();
      });


    }); //eo google reset

  } // eo google

  // example for another page
  this.matthiasandrasch = function() {
    console.log('custom function called, MA');
    if (!this.urlParams.has('q')) {
      console.log('No q parameter found, exit', this.urlParams);
      return;
    }
    this.urlParams.append('ACTIVEHÖRNCHEN', '1')
    this.addPopupUrl('Nur OER', this.urlWithoutParams + '?' + this.urlParams.toString());
    //this.save();

    //this.changeIconToGreen();
  } // eo matthiasandrasch

} // eo class