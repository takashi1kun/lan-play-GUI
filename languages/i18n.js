const path = require("path")
const electron = require('electron')
const fs = require('fs');
let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app

module.exports = i18n;
console.log(app.getLocale())
function i18n() {
    if(fs.existsSync(path.join(__dirname, app.getLocale() + '.js'))) {
		var s = fs.readFileSync(path.join(__dirname, app.getLocale() + '.js'), 'utf8')
		s = s.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
s = s.replace(/[\u0000-\u0019]+/g,""); 
         loadedLanguage = JSON.parse(s)
    }
    else {
		 	var s = fs.readFileSync(path.join(__dirname, 'en.js'), 'utf8')
		s = s.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
s = s.replace(/[\u0000-\u0019]+/g,""); 
         loadedLanguage = JSON.parse(s)
    }
}

i18n.prototype.__ = function(phrase) {
    let translation = loadedLanguage[phrase]
    if(translation === undefined) {
         translation = phrase
    }
    return translation
}