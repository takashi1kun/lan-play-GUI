var serverList = []
var serverObject = function(serverIndex, serverName, serverURL){
	serverIndex: "",
	serverName: "",
	serverURL: "",
	serverInfoURL: function(){
		return this.serverURL + "/info"
	},
	serverOnline: function(){
		return (await fetch(this.serverInfoURL)).ok
	},
	serverInfo: function(){
		return JSON.parse((await (await fetch(this.serverInfoURL)).text()))
	}
}
var addServer = function(serverName, serverURL){
	serverList.push(new serverObject(serverList.length, serverName, serverURL))
}