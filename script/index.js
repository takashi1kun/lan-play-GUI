const config = require('electron-json-config');
var serverList = []

var updateConfig(){
	config.purge()
	config.set('serverList', serverList)
}

if(config.has('serverList')){
	serverList = config.get('serverList')
	config.purge()
	config.set('serverList', serverList)
} else{
	updateConfig()
}


var serverObject = function(serverIndex, serverName, serverURL){
	this.serverIndex = serverIndex,
	this.serverName = serverName,
	this.serverURL = serverURL,
	this.serverInfoURL = function(){
		return this.serverURL + "/info"
	},
	this.serverOnline = false,
	this.serverInfo = {}
}

var serverObjectMin = function(serverIndex, serverName, serverURL){
	this.serverIndex = serverIndex,
	this.serverName = serverName,
	this.serverURL = serverURL,
	this.serverInfoURL = function(){
		return this.serverURL + "/info"
	}
}

var addServer = function(serverName, serverURL){
	var obj = new serverObject(serverList.length, serverName, serverURL)
	serverList.push(obj)
	objectUpdate(obj)
	setTimeout(updateConfig, 1000);
}

var objectUpdate = async function(obj) {
	var serverInfoURL = obj.serverInfoURL()
	var serverOnline = (await fetch(serverInfoURL)).ok
	var serverInfo = {}
	if (serverOnline){
		serverInfo = JSON.parse((await (await fetch(serverInfoURL)).text()))
	};
	obj.serverOnline = serverOnline
	obj.serverInfo = serverInfo
	serverList[obj.serverIndex] = obj
}

var updateServers = function(){
	for(var i = 0; i < serverList.length; i++){
		objectUpdate(serverList[i])
	}
	setTimeout(updateConfig, 4000);
}

var testFunction = function(){
addServer("test", "http://usplay.secretalgorithm.com:11451")
}


console.log(config.get('serverList'));