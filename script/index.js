var serverList = []
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
}
var testFunction = function(){
addServer("test", "http://usplay.secretalgorithm.com:11451")
}