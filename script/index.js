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
	serverList.push(new serverObject(serverList.length, serverName, serverURL))
}

var objectUpdate = function(obj) {
	var serverOnline = (await (await fetch(obj.serverInfoURL())).ok)
	var serverInfo = {}
	if (serverOnline){
		serverInfo = JSON.parse((await (await fetch(obj.serverInfoURL())).text()))
	};
	obj.serverOnline = serverOnline
	obj.serverInfo = serverInfo
	serverList[obj.serverIndex] = obj
}