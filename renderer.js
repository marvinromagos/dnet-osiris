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

refreshBtn.addEventListener('click', reloadView);
view.addEventListener('did-finish-load', showUrl);