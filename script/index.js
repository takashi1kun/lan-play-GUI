var serverList = []
var serverObject = {
	serverIndex: "",
	serverName: "",
	serverURL: "",
	serverInfoURL: function(){
		return this.serverURL + "/info"
	},
	serverOnline: function() {
		return (await fetch(this.serverInfoURL)).ok
	},
	serverPlayers: function() {
		return JSON.parse((await (await fetch(this.serverInfoURL)).text())).online
	}
}