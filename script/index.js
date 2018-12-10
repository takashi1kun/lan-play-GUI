const config = require('electron-json-config');
var serverList = []
const {shell} = require('electron');
const child_process = require('child_process');

var openServer = function(server){
	var commandString = "start cmd.exe /K lan-play.exe --fake-internet --relay-server-addr "+ server
	child_process.exec(commandString);
}
var updateConfig = function(){
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

var writeHtml = function(){
	var innerHtml = ``;
	for(var i = 0; i < serverList.length; i++){
		if (serverList[i].serverOnline){
			var serverColor = "limegreen"
			var serverOnline = "Online"
			
		} else {
			var serverColor = "red"
			var serverOnline = "Offline"
			
		}
		if (serverList[i].serverInfo.version === undefined) {
			var online = "0"
			var version = "Not Online"
		} else {
			var online = serverList[i].serverInfo.online
			var version = serverList[i].serverInfo.version
		}
		innerHtml = innerHtml + `
	<div id="server_`
	+i+
	`">
			<div class="alert alert-primary" style="margin-bottom: 1px; ">
			<div class="row">
			<div class="col-sm-1"> <i class="fas fa-sort-up"></i><br /><span title="fr" class="flag-icon flag-icon-`
	+serverList[i].serverFlag.toLowerCase()+
	`"></span><br /> <i class="fas fa-sort-down"></i></div>
				<div class="col-8">
				<strong>`
	+serverList[i].serverName+
	`</strong> | <i class="fas fa-server"></i> `
	+serverList[i].serverURL+
	` 
				<hr>
				<i style="color: `
	+serverColor+
	`;transform: scale(0.5)" class="fas fa-circle"></i>`
	+serverOnline+
	` | 
				<img style="width: 22px;" src="data:image/png;base64,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" class="icon">
		`		
	+online+
	` Playing | <i class="fas fa-laptop-code"></i>Version `		
	+version+
	`</div>
				<div class="col-1">
				<div class="btn-group" role="group" aria-label="Basic example">
					<button type="button" onClick="openServer('`
	+serverList[i].serverURL+
	` ')" class="btn btn-success"><i class="fas fa-play"></i> Connect to Server</button>
</div><br />
<div class="btn-group" role="group" aria-label="Basic example">
					<button type="button" class="btn btn-primary"><i class="far fa-edit"></i> Edit</button>
					<button type="button" class="btn btn-danger"><i class="fas fa-times"></i> Remove</button>
</div>
				</div>
</div>
			</div>
			</div>
	`
	}
	document.getElementById("app").innerHTML = innerHtml
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
	this.serverColor = function(){
		if (this.serverOnline){
			var htmlstring = "limegreen"
			return htmlstring
		} else{
			var htmlstring = "red"
			return htmlstring
		}
	},
	this.serverIsOnline = function(){
		if (this.serverOnline){
			var htmlstring = "Online"
			return htmlstring
		} else{
			var htmlstring = "Offline"
			return htmlstring
		}
	}
}

var serverObjectMin = function(serverIndex, serverName, serverURL, serverFlag){
	this.serverIndex = serverIndex,
	this.serverName = serverName,
	this.serverURL = serverURL,
	this.serverFlag = serverFlag,
	this.serverInfoURL = function(){
		return this.serverURL + "/info"
	}
}

var buttonAddServer = function(){
	var name = document.getElementById("addServerFormName").value
	var thisURL = document.getElementById("addServerFormURL").value
	var country = document.getElementById("addServerFormCountry").value
	addServer(name, thisURL, country)
	document.getElementById("addServerFormName").value = ""
	document.getElementById("addServerFormURL").value = ""
	document.getElementById("addServerFormCountry").value = "NFlag"
}

var addServer = function(serverName, serverURL, serverFlag){
	var obj = new serverObject(serverList.length, serverName, serverURL, serverFlag)
	serverList.push(obj)
	objectUpdate(obj)
	setTimeout(updateServers, 10);
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
	setTimeout(updateConfig, 500);
	setTimeout(writeHtml, 500)
}

var testFunction = function(){
addServer("usplay", "usplay.secretalgorithm.com:11451", "SPA")
}


console.log(config.get('serverList'));    
setTimeout(writeHtml, 100);