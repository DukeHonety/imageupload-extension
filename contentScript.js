/**
 * Just protective wrap for script node
 */

var ___wrap = (function () {

  var blobSize = 0;
  var uploadFileMsg;
  var blobarray;

  var script = document.createElement('script');
  script.src = chrome.runtime.getURL('scanAPI.js');

  script.onload = function () {
    this.parentNode.removeChild(this);
  };

  (document.head || document.documentElement).appendChild(script);

  window.addEventListener("PassToBackground", function (data) {
    //console.log('CS.PassToBackground', data);
    chrome.runtime.sendMessage(data.detail);

  }, false);


  window.addEventListener("GetFile", function (data) {
    //console.log('CS.GetFile', data);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL(data.detail.filename), true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var res = event.target.result;
        //console.log(res);

        var response =  {
          filechunk : res,
          receivecomplete: true
        }
        var message = { method: data.detail.method, detail: response }

        if (data.detail.chunksize == -1) {
          var event = new CustomEvent(data.detail.method, message);
          window.dispatchEvent(event);
        } else {
          var chunksize = parseInt(data.detail.chunksize);
          var chunklength = 0;
          for (var i = 0; i < res.length;) {
            chunklength = chunksize;
            if (i + chunksize > res.length) chunklength = res.length - 1;

            response =  {
              filechunk : res.substr(i, chunksize),
              receivecomplete: false
            }

            message = { method: data.detail.method, detail: response }
            event = new CustomEvent(data.detail.method, message);
            window.dispatchEvent(event);
            i = i + chunksize;
          }

          response =  {
            filechunk : '',
            receivecomplete: true
          }
          message = { method: data.detail.method, detail: response }
          var event = new CustomEvent(data.detail.method, message);
          window.dispatchEvent(event);

        }

      }
      var file = this.response;
      reader.readAsDataURL(file)
    };
    xhr.send()


    //  chrome.runtime.sendMessage(data.detail);

  }, false);


  window.addEventListener("PutFile", function (data) {
    //console.log('CS.PutFile', data);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL(data.detail.filename), true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var res = event.target.result;
        //console.log(res);

        var response =  {
          filechunk : res,
          receivecomplete: true
        }
        var message = { method: data.detail.method, detail: response }

        if (data.detail.chunksize == -1) {
          var event = new CustomEvent(data.detail.method, message);
          window.dispatchEvent(event);
        } else {
          var chunksize = parseInt(data.detail.chunksize);
          var chunklength = 0;
          for (var i = 0; i < res.length;) {
            chunklength = chunksize;
            if (i + chunksize > res.length) chunklength = res.length - 1;

            response =  {
              filechunk : res.substr(i, chunksize),
              receivecomplete: false
            }

            message = { method: data.detail.method, detail: response }
            event = new CustomEvent(data.detail.method, message);
            window.dispatchEvent(event);
            i = i + chunksize;
          }

          response =  {
            filechunk : '',
            receivecomplete: true
          }
          message = { method: data.detail.method, detail: response }
          var event = new CustomEvent(data.detail.method, message);
          window.dispatchEvent(event);

        }

      }
      var file = this.response;
      reader.readAsDataURL(file)
    };
    xhr.send()


    //  chrome.runtime.sendMessage(data.detail);

  }, false);

  function OnRuntimeMessage(message) {
    //console.log('CS.OnRuntimeMessage', message);

    var event = new CustomEvent(message.method, message);
    window.dispatchEvent(event);

  }

  chrome.runtime.onMessage.addListener(OnRuntimeMessage);


})();

