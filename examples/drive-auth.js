var map, gpx, gapi;

var CLIENT_ID = '940625885159-p5rnkp5fem6aq2p1fv1qeu6fk742chjv.apps.googleusercontent.com'; // 
//var CLIENT_ID = '609512364867.apps.googleusercontent.com'; // kogis.iwi
var SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

var gpx_files = {};

if (window.location.protocol != 'https:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

XMLHttpRequest.prototype.readableHeaders = {};
XMLHttpRequest.prototype.proxiedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    this.proxiedSetRequestHeader(header, value);
    this.readableHeaders[header] = value;
};

function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}


function checkAuth() {
    gapi.auth.authorize({
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': true
        },
        handleAuthResult);
}


function handleAuthResult(authResult) {
    var authButton = document.getElementById('authorizeButton');
    authButton.style.display = 'none';

    if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        getItems();

        
    } else {

        // No access token could be retrieved, show the button to start the authorization flow.
        authButton.style.display = 'block';
        authButton.onclick = function() {
            gapi.auth.authorize({
                    'client_id': CLIENT_ID,
                    'scope': SCOPES,
                    'immediate': false
                },
                handleAuthResult);
        };
    }
}


function getItems() {
    var request = gapi.client.request({
        'path': 'drive/v2/files',
        'method': 'GET',
        // Trying to get GPX files
        // https://developers.google.com/drive/search-parameters
        'params': {
            q: "mimeType = 'text/xml' and trashed = false and fullText contains 'gpx'", 
            'maxResults': '20'
        }
    });
    request.execute(listItems);
}

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (bytes < thresh) return bytes + ' B';
    var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (bytes >= thresh);
    return bytes.toFixed(1) + ' ' + units[u];
}

function listItems(resp) {
    var result = resp.items;

    if (!result) {
        var out = document.getElementById('output');
        out.innerHTML = "Sorry. No GPX files found.";
        return false;
    }
    var out = document.getElementById('output');
    for (var i = 0; i < result.length; i++) {
        var res = result[i];
        gpx_files[res.id] = res;
        // File metadata
        // https://developers.google.com/drive/v2/reference/files
        var node = document.createElement('div');
        node.innerHTML = '<input type="checkbox" id="' + res.id + '" name="check' + res.id + '"><label for="check' + res.id + '">' + res.title + '</label>';
        node.setAttribute('onclick', 'toggleLayer("' + res.id + '")');
        node.appendChild(document.createTextNode('  (' + humanFileSize(res.fileSize) + ')'));
        node.appendChild(document.createTextNode(' – public: ' + res.shared));
        node.appendChild(document.createTextNode(', last modified by: [' + res.lastModifyingUserName +']'));

        out.appendChild(node);
    }
}

function toggleLayer(id) {
    

    var file = gpx_files[id];
    title = file.title;

    var layers = map.getLayersBy('name', title);
    var num_layers = layers.length;

    if (num_layers > 0) {

        for (var i = 0; i < layers.length; i++) {
            var lyr = layers[i];
            map.removeLayer(lyr);

        }
        return false;
    }
    //var file = {};
    //file.downloadUrl = url;
    downloadFile(file, map.addGPXLayer);
    //getData(file.dow, title);

}


$.support.cors = true;

$.ajaxSetup({
  beforeSend: function (jqXHR, settings) {
    //console.log( settings.xhr().readableHeaders );
  }
});

// xhr access denied
// http://stackoverflow.com/questions/5793831/script5-access-is-denied-in-ie9-on-xmlhttprequest
// On IE7, IE8, and IE9 just go to Settings->Internet Options->Security->Custom Level and change security settings under "Miscellaneous" set "Access data sources across domains" to Enable
// See http://caniuse.com/#feat=cors

function downloadFile(file, callback) {
  if (file.downloadUrl) {
    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    try {
        xhr.open('GET', file.downloadUrl);
    } catch(e) {
        alert(e +'\nYou need to allow your browser to make cross-domain requests if you want to load GPX files.\n' +
        '\nThis is usually done on IE7, IE8, and IE9 just go to Settings->Internet Options->Security->Custom Level and change security settings under "Miscellaneous" set "Access data sources across domains" to "Enable"' +
       '\n\nOther browsers, including IE10 are doing fine.');
    }
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
      callback(file.id, xhr.responseText);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}


function getData(url, title) {
     var myToken = gapi.auth.getToken();
     
     
   //console.log('getData, mytoken: ', myToken.access_token);

   // http://stackoverflow.com/questions/10232017/ie9-jquery-ajax-with-cors-returns-access-is-denied
    $.ajax({
        type: 'GET',
        cache: false,
        url: url,
        //dataType: "xml",
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + myToken.access_token
        },
        success: function(data) {
            //console.log('success', data);
            map.addGPXLayer(data, title);
        },
        error: function(xhr, status, errorThrown) {
           //console.log(errorThrown+'\n'+status+'\n'+xhr.statusText);
           //console.log(xhr);
       }
    }).done(function(data){
});;

}



function init() {
    
    
    handleClientLoad();

    map = new GeoAdmin.Map('map', {
        doZoomToMaxExtent: true
    });
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-grau', {
        opacity: 1
    });

    OpenLayers.ProxyHost = (window.location.host == 'localhost') ? '/cgi-bin/proxy.cgi?url=' : '/cgi-bin/proxy?url=';

    map.addGPXLayer = function(id, data) {
         //console.log('addGPXLayer', data);

        var format = new OpenLayers.Format.GPX(

            {
                extractWaypoints: true,
                extractTracks: true,
                extractRoutes: true,
                extractAttributes: true
            }

        );


        var features = format.read(data);

        var proj = new OpenLayers.Projection('EPSG:4326');
        var n = 0;
        for (var i = 0; i < features.length; i++) {
            var feature = features[i];
            n += 1;
            feature.geometry.transform(
                proj, map.projection
            );

        }
        //console.log('features: ', n);
        var gpx = new OpenLayers.Layer.Vector(id || 'GPX Data', {

            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    strokeColor: '#00aaff',
                    pointRadius: 5,
                    strokeWidth: 4,
                    strokeOpacity: 0.75
                })
            }),
            projection: new OpenLayers.Projection('EPSG:21781')
        });
        gpx.events.on({
            featuresadded: function() {
                map.zoomToExtent(this.getDataExtent());
            }
        });

        gpx.addFeatures(features);
        map.addLayer(gpx);

    };
}
