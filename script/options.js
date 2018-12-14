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
var serverObject = function(serverIndex, serverName, serverURL, serverFlag){
	this.serverIndex = serverIndex,
	this.serverName = serverName,
	this.serverURL = serverURL,
	this.serverFlag = serverFlag,
	this.serverInfoURL = function(){
		return "http://" + this.serverURL + "/info"
	},
	this.serverOnline = false,
	this.serverInfo = {},
	this.serverPing = "?ms"
}

var serverObjectMin = function(serverName, serverURL, serverFlag){
	this.serverName = serverName,
	this.serverURL = serverURL,
	this.serverFlag = serverFlag
}
	
var parseInterfaces = function(str){
	var str2 = []
	var str3 = []
	var reply = []
	var sw = false
	for(i=0;!sw&&i<100;i++){
		var i2 = i+1;
		var i3 = i+2;
		str2[i] = str.split(i2+'. ').pop().split(' (')[0]
		if (!str.includes(i3+". ")){
			sw = true;
		}
	}
	for(i=0;i<str2.length;i++){
		var i2 = i+1;
		var i3 = i+2;
		str3[i] = "("+str.split(str2[i]+' (').pop().split(i3+". ")[0]
	}
	reply[0] = str2
	reply[1] = str3
	return reply
}

var lan-play-place = ""
	
var loadInterfaces = function(){
	var interfaces = child_process.execSync(lan-play-place+" --list-if").asciiSlice()
	var parsedInterfaces = parseInterfaces(interfaces)
}

var createObjectMin = function(){
	var length = serverList.length
	var newArray = [];
	for(i=0;i<length;i++){
		newArray[i] = new serverObjectMin(serverList[i].serverName, serverList[i].serverURL, serverList[i].serverFlag)
	}
	return newArray
}

var createObject = function(serverlist){
	var length = serverlist.length
	var newArray = [];
	for(i=0;i<length;i++){
		newArray[i] = new serverObject(i, serverlist[i].serverName, serverlist[i].serverURL, serverlist[i].serverFlag)
	}
	return newArray
}

var exportServerList = function(){
	var data = createObjectMin()
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
			serverListFile = createObject(json)
        }
    });
}

var returnToIndex= function(){
	remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`)
}
setTimeout(inititalization, 200);