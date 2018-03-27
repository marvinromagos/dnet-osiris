var nodeConsole = require('console');
var _console = new nodeConsole.Console(process.stdout, process.stderr);

var jsonfile = require('jsonfile');
var favicon = require('favicon-getter').default;
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
var fave = getElementById('fave');
var list = getElementById('list');
var popup = getElementById('fave-popup');

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

var Bookmark = function (id, url, faviconUrl, title) {
    this.id = id;
    this.url = url;
    this.icon = faviconUrl;
    this.title = title;
}

Bookmark.prototype.ELEMENT = function () {
    var a_tag = document.createElement('a');
    a_tag.href = this.url;
    a_tag.className = 'link';
    a_tag.textContent = this.title;
    var favimage = document.createElement('img');
    favimage.src = this.icon;
    favimage.className = 'favicon';
    a_tag.insertBefore(favimage, a_tag.childNodes[0]);

    return a_tag;
}

function addBookmark () {
    let url = view.src;
    let title = view.getTitle().split(' ')[0];

    favicon(url).then(function(fav) {
        let book = new Bookmark(uuid.v1(), url, fav, title);
        var data = []

        jsonfile.readFile(bookmarks, function(err, curr) {
            if (curr === undefined) {
                curr = [book]
            } else {
                curr.push(book);
            }

            jsonfile.writeFile(bookmarks, curr, function (err) {
            })
        });
    });
}

function openPopUp (event) {
    let state = popup.getAttribute('data-state');

    if (state === 'closed') {
        popup.innerHTML = '';

        popup.style.display = 'block';
        popup.setAttribute('data-state', 'open');

        jsonfile.readFile(bookmarks, function(err, obj) {
            if(obj.length !== 0) {
                for (var i = 0; i < obj.length; i++) {
                    let url = obj[i].url;
                    let icon = obj[i].icon;
                    let id = obj[i].id;
                    let title = obj[i].title;
                    let bookmark = new Bookmark(id, url, icon, title);
                    let el = bookmark.ELEMENT();

                    popup.appendChild(el);
                }
            }
        });
    } else {
        popup.style.display = 'none';
        popup.setAttribute('data-state', 'closed');
    }
}

function handleUrl (event) {
    if (event.target.className === 'link') {
        event.preventDefault();
        view.loadURL(event.target.href);
    } else if (event.target.className === 'favicon') {
        event.preventDefault();
        view.loadURL(event.target.parentElement.href);
    }
}

refreshBtn.addEventListener('click', reloadView);
omnibox.addEventListener('keydown', loadSiteUrl);
backBtn.addEventListener('click', backView);
forwardBtn.addEventListener('click', forwardView);
view.addEventListener('did-finish-load', showUrl);
fave.addEventListener('click', addBookmark);
list.addEventListener('click', openPopUp);
popup.addEventListener('click', handleUrl);

