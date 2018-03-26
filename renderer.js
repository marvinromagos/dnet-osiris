var nodeConsole = require('console');
var _console = new nodeConsole.Console(process.stdout, process.stderr);

var jsonfile = require('jsonfile');
var path = require('path');
var uuid = require('uuid');
var bookmarks = path.join(__dirname, 'bookmarks.json');

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

var Bookmark = function (id, url, title) {
    this.id = id;
    this.url = url;
    this.title = title;
}

function addBookmark () {
    let url = view.src;
    let title = view.getTitle();
    let book = new Bookmark(uuid.v1(), url, title);

    jsonfile.readFile(bookmarks, function(err, curr) {
        curr.push(book);
        jsonfile.writeFile(bookmarks, curr, function (err) {
        })
    })
}

refreshBtn.addEventListener('click', reloadView);
omnibox.addEventListener('keydown', loadSiteUrl);
backBtn.addEventListener('click', backView);
forwardBtn.addEventListener('click', forwardView);
view.addEventListener('did-finish-load', showUrl);