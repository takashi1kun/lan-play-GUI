const config = require('electron-json-config');
var serverList = []
const {shell} = require('electron');
const child_process = require('child_process');
const os = require('os');
var OS = process.platform
var workDir = process.cwd()
const fs = require('fs')
const dgram = require('dgram')
const crypto = require('crypto')
const dns = require('dns')
var Q = require('q');
const { remote } = require('electron')
const path = require('path')
var elerem = require('electron').remote;
var dialog = elerem.dialog;
var app = elerem.app;

var http = require('http');
var serverListFile

if(config.has('serverList')){
	serverList = config.get('serverList')
};

var inititalization = function(){
	$('#importFile').hide()
	$('#importFile').change(function(ev) {
		if($('#importFile')[0].files[0] === undefined){
			
		}else{
			serverListFile = $('#importFile')[0].files[0]
		}
	});
} 


function myUrlSaveAsComplete(err){
    alert("done");
}


function download (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb); // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};

var exportServerList = function(){
	var data = serverList
	var json = JSON.stringify(data, null, "\t");
	var toLocalPath = path.resolve(app.getPath("desktop")) 
    var userChosenPath = dialog.showSaveDialog({ defaultPath: toLocalPath+"/Server List.json",title: 'Server List',filters: [{
      name: 'Server List',
      extensions: ['json']
    }]
  });
    if(userChosenPath){
        fs.writeFile(userChosenPath, json, function(err) {
    // file saved or err
});
    }
	//myUrlSaveAs(url)
	
}
var testGlobal
var importServerList = function(){ 
   //$('#importFile').click()
    dialog.showOpenDialog({filters: [{
      name: 'Server List',
      extensions: ['json']
    }],
        properties: ['openFile']
    }, function (files) {
        if (files !== undefined) {
            // handle files
			console.log(files)
			testGlobal = files[0]
			var data = fs.readFileSync(files[0])
			console.log(data)
			var json = JSON.parse(data)
			serverListFile = json
        }
    });
}

var returnToIndex= function(){
	remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`)
}
setTimeout(inititalization, 200);