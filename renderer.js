var nodeConsole = require('console');
var _console = new nodeConsole.Console(process.stdout, process.stderr);

var getElementById = function (id) {
    return document.getElementById(id);
}

var backBtn = getElementById('back');
var forwardBtn = getElementById('forward');
var refreshBtn = getElementById('refresh');
var urlBtn = getElementById('url');
var view = getElementById('view');
var omnibox = getElementById('url');


function reloadView () {
    view.reload();
}

function showUrl (event) {
    omnibox.value = view.src;
}

function loadSiteUrl (event) {
    // 13 is Enter key
    if (event.keyCode === 13) {
        // Remove focus
        omnibox.blur();

        let val = omnibox.value.toLowerCase();
        var url = '';

        if (val.indexOf('http') < 0) {
            url = 'http://'+ val;
        }

        if (val.indexOf('.com') < 0) {
            url = url + '.com'
        }

        view.loadURL(url)
    }
}

function backView () {
    view.goBack();
}

function forwardView () {
    view.goForward();
}

refreshBtn.addEventListener('click', reloadView);
omnibox.addEventListener('keydown', loadSiteUrl);
backBtn.addEventListener('click', backView);
forwardBtn.addEventListener('click', forwardView);
view.addEventListener('did-finish-load', showUrl);