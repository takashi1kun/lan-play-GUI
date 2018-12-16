const config = require('electron-json-config');
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


function udpPing (server, port = 11451, timeout = 350) {//this function was given to me by space, thanks very much
    return new Promise((resolve, reject) => {
        const socket = dgram.createSocket('udp4')
        const rnd = crypto.randomBytes(4)
        const sndMsg = Buffer.concat([Buffer.from([2]), rnd])
        const startTime = Date.now()
        socket.on('error', (err) => reject(err))
        socket.on('close', () => reject(new Error('socket closed')))
        socket.on('message', (msg, rinfo) => {
            if (rinfo.address != server || rinfo.port != port) {
                reject(new Error('address not right'))
                return
            }
            if (msg.equals(sndMsg)) {
                resolve(Date.now() - startTime)
            } else {
                reject(new Error('content not match'))
            }
        })

        socket.send(sndMsg, port, server, err => err && reject(err))
    })
}

/*async function main() {
    let ping = await udpPing('35.236.10.223')
    console.log(ping)
}
main()*/


var openServer = function(server){
	if(fakeInternetEnabled){
		var fakeInternet = " --fake-internet"
	}else{
		var fakeInternet = ""
	}
	if(broadcastEnabled){
		var broadCast = " --broadcast"
	} else{
		var broadCast = ""
	}
	var pmtuCommand = " --pmtu "+pmtu
	var netIf = " --netif "+networkInterface
	if(networkInterface.trim() == "Not Selected"){
		var netIf = ""
	}
	if(testVersion() === 2){
		$('#modalError1').modal('show')
	}else if(testVersion() === 3){
		$('#modalError2').modal('show')
	}else{
	if (OS == "win32"){ //If OS is Windows
		if (os.arch == "x64"){ //win64
			var commandString = "start cmd.exe /K "+`"`+lanPlayLocation+`"`+fakeInternet+broadCast+pmtuCommand+netIf+" --relay-server-addr "+ server
		} else { //win32
			var commandString = "start cmd.exe /K "+`"`+lanPlayLocation+`"`+fakeInternet+broadCast+pmtuCommand+netIf+" --relay-server-addr "+ server
		}
	} else if(OS == "linux"){ //If OS is Linux
		var commandString = "x-terminal-emulator -e "+`"`+lanPlayLocation+`"`+fakeInternet+broadCast+pmtuCommand+netIf+" --relay-server-addr "+ server
	} else if (OS == "darwin"){//If OS is MacOS
		var commandString = `osascript -e 'tell app "Terminal" to do script "+`+lanPlayLocation+fakeInternet+broadCast+pmtuCommand+netIf+" --relay-server-addr "+ server+`"'`
	} else {
		return "lol"
	}
	child_process.exec(commandString);
	}
}
var updateConfig = function(){
	config.set('serverList', serverList)
}

var purgeConfig = function(){
	config.purge();
}

var serverList = []

if(config.has('serverList')){
	serverList = config.get('serverList')
} else{
	config.set('serverList', [])
	serverList= []
}

var lanPlayLocation = ""

if(config.has('lanPlayLocation')){
	lanPlayLocation = config.get('lanPlayLocation')
} else{
	
	config.set('lanPlayLocation', "")
	if (OS == "win32"){ //If OS is Windows
		if (os.arch == "x64"){ //win64
			config.set('lanPlayLocation', process.cwd()+"\\lan-play-win64.exe")
		} else { //win32
			config.set('lanPlayLocation', process.cwd()+"\\lan-play-win32.exe")
		}
	} else if(OS == "linux"){ //If OS is Linux
		config.set('lanPlayLocation',os.homedir()+"/lan-play-linux")
	} else if(OS == "darwin"){
		config.set('lanPlayLocation',os.homedir()+"/lan-play")
	}
	lanPlayLocation = config.get('lanPlayLocation')
}
var changelog = function(){
if (!config.has('changelog_1_0_0')){
config.set('changelog_1_0_0', true)
$('#changelog').modal('show')
}
}

var fakeInternetEnabled;

if(config.has('fakeInternetEnabled')){
	fakeInternetEnabled = config.get('fakeInternetEnabled')
} else{
	config.set('fakeInternetEnabled', true)
	fakeInternetEnabled = true
}

var pmtu;

if(config.has('pmtu')){
	pmtu = config.get('pmtu')
} else{
	config.set('pmtu', 1500)
	pmtu = 1500
}

var broadcastEnabled;

if(config.has('broadcastEnabled')){
	broadcastEnabled = config.get('broadcastEnabled')
} else{
	config.set('broadcastEnabled', false)
	broadcastEnabled = false
}

var networkInterface = ""

if(config.has('networkInterface')){
	networkInterface = config.get('networkInterface')
} else{
	config.set('networkInterface', "Not Selected")
	networkInterface = "Not Selected"
}

var testVersion = function(){
	try {
	var version = child_process.execSync(`"`+lanPlayLocation+`"`+" --version").asciiSlice().trim()
	}
	catch(err) {
  console.log("error");
}
	if (version ==="switch-lan-play 0.0.5" || version ==="switch-lan-play 0.0.3" || version ==="switch-lan-play 0.0.1" || version ==="switch-lan-play v0.0.0"){
		return 2 
	} else if(version === undefined){
		
		return 3
	} else {
		return 1
	}
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
		if (serverList[i].serverInfo === undefined) {
			var online = "0"
			var version = "Not Online"
		} else {
			if(serverList[i].serverInfo.version === undefined){
				var online = "0"
				var version = "Not Online"
			}else{
				var online = serverList[i].serverInfo.online
				var version = serverList[i].serverInfo.version
			}
		}
		innerHtml = innerHtml + `
	<div id="server_`
	+i+
	`">
			<div class="alert alert-primary" style="margin-bottom: 1px; ">
			<div class="row">
			<div class="col-sm-1"> <div style="padding-left: 5px;" onClick="upServer(`
	+i+
	`)"><i class="fas fa-sort-up"></i></div><div style="padding-top: 4px;padding-bottom: 4px;"><span title="fr" class="flag-icon flag-icon-`
	+serverList[i].serverFlag.toLowerCase()+
	`"></span></div><div style="padding-left: 5px;" onClick="downServer(`
	+i+
	`)"><i class="fas fa-sort-down"></i></div></div>
				<div class="col-8">
				<strong>`
	+serverList[i].serverName+
	`</strong> | <i class="fas fa-server"></i> `
	+serverList[i].serverURL+
	` | <i class="fas fa-broadcast-tower"></i> `
	+serverList[i].serverPing+
	`				<hr>
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
					<button type="button" onClick="editServer(`
	+i+
	`)" data-toggle="modal" data-target="#editServer" class="btn btn-primary"><i class="far fa-edit"></i> Edit</button>
					<button type="button" onClick="removeServer(`
	+i+
	`)" class="btn btn-danger"><i class="fas fa-times"></i> Remove</button>
</div>
				</div>
</div>
			</div>
			</div>
	`
	}
	document.getElementById("app").innerHTML = innerHtml
}

var editedServerIndex;

var editServer = function(serverIndex){
	var server = serverList[serverIndex]
	document.getElementById("editServerFormName").value = server.serverName
	document.getElementById("editServerFormURL").value = server.serverURL
	document.getElementById("editServerFormCountry").value = server.serverFlag
	editedServerIndex = serverIndex

}

var reLoad = function(){
	location.reload()
}

var saveEditServer = function(){
	var name = document.getElementById("editServerFormName").value
	var thisURL = document.getElementById("editServerFormURL").value
	var country = document.getElementById("editServerFormCountry").value
	var obj = new serverObject(editedServerIndex, name, thisURL, country)
//	console.log(name)
	//console.log(thisURL)
	//console.log(country)
	//console.log(obj)
	serverList[editedServerIndex] = ""
	serverList[editedServerIndex] = obj
	update();
	document.getElementById("editServerFormName").value = ""
	document.getElementById("editServerFormURL").value = ""
	document.getElementById("editServerFormCountry").value = "NFlag"
	//setTimeout(reLoad, 1000)
	//objectUpdate(obj)
	//serverList[obj.serverIndex] = objectUpdate(obj, obj.serverIndex)
	//serverList = updateOrder(false, serverList);
	//update();
	
}

var pingServer = async function(index){
	var url = ("http://" + serverList[index].serverURL).split('http://').pop().split(':')[0];
	let ip = await pingServerStep2(url)
	let pings = await udpPing(ip)
	console.log(pingServerStep2(url))
	console.log(pings)
	return pings+"ms"
	//return ping(url)+"ms"
}

var pingServerStep2 = async function(url){
	var deferred = Q.defer();	
	await dns.lookup(url, function (err, result) {
        if (err) {
            return deferred.reject(err);
        }
        deferred.resolve(result);
    });

    return deferred.promise;
}

var ping = function(url){
	if (OS == "win32"){ //If OS is Windows
		var process2 = child_process.execSync("ping -n 1 -w 350 "+url);
		if (process2 != undefined){
			var i = process2.asciiSlice().split('= ').pop().split('ms')[0];
			}else{
				var i = "+350"
			}
		if (process2.kill != undefined){
			process2.kill();}
	} else if(OS == "linux"){ //If OS is Linux
		var process2 = child_process.execSync("ping -c 1 -W 350 "+url);
		if (process2 != undefined){
			var i = process2.asciiSlice().split('= ').pop().split('ms')[0];
			}else{
				var i = "+350"
			}
			if (process2.kill != undefined){
			process2.kill();}
	} else if (OS == "darwin"){//If OS is MacOS
		return 0
	} else {
		return 0
	}
	//var process = child_process.execSync(commandString+url);
	//var i = parseInt((new TextDecoder("utf-8").decode(process)).split('= ').pop().split('ms')[0]);
	
	return i
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
	
var serverObjectComplete = function(serverIndex, serverName, serverURL, serverFlag, serverOnline, serverInfo, serverPing){
	this.serverIndex = serverIndex,
	this.serverName = serverName,
	this.serverURL = serverURL,
	this.serverFlag = serverFlag,
	this.serverInfoURL = function(){
		return "http://" + this.serverURL + "/info"
	},
	this.serverOnline = serverOnline,
	this.serverInfo = serverInfo,
	this.serverPing = serverPing
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

var addServer = async function(serverName, serverURL, serverFlag){
	var index = serverList.length;
	var obj = new serverObject(index, serverName, serverURL, serverFlag)
	serverList[index] = obj
	var temp = objectUpdate(obj, index).then(function(result) {
   serverList[result[0]] = result[1]
   update()
});
}

var globalTest;

var openConfiguration = function(){
	//remote.getCurrentWindow().loadURL('file://options.html')
	remote.getCurrentWindow().loadURL(`file://${__dirname}/options.html`)
}

function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

var objectUpdate = async function(obj, index) {
	var object = new serverObject(index, obj.serverName, obj.serverURL, obj.serverFlag);
	var serverInfoURL = object.serverURL;
	serverInfoURL = "http://" + serverInfoURL + "/info"
	try {
	var serverPing = await timeout(350, pingServer(index))
	}catch(err){
		var serverPing="+350ms"
		setTimeout(update, 400);
	}
	var r1
	try {
	r1 = await timeout(500, fetch(serverInfoURL));
	var serverOnline = r1.ok
	}
	catch(err) {
	//	console.log("first error")
	var r1 = {online:0,version:"Not Online"}
	r1.ok = false
	setTimeout(update, 400);
	//return false
}

try{
	var r2 = await r1.json()
} catch(err) {
	//	console.log("first error")
	var r2 = {online:0,version:"Not Online"}
	setTimeout(update, 400);
	//return false
}


	globalTest = r1
	//var serverOnline = r1.ok
	var serverInfo = {};
	var r3;
	//if (serverOnline){
		
/* 		try {
	let r2 = await timeout(500, fetch(serverInfoURL)).then(dataWrappedByPromise => dataWrappedByPromise.json()).then(data => {
		r3 = data
    return data
})
}
catch(err) {
	r3 = {online:0,version:"Not Online"}
	setTimeout(update, 400);
} */

	//let r2 = await fetch(serverInfoURL).then(dataWrappedByPromise => dataWrappedByPromise.json()).then(data => {
    //return data
//})
		//let r2 = r1.json()
		serverInfo = r2
		globalTest = r2
	//};
	//object.serverOnline = serverOnline
	//object.serverInfo = serverInfo
	var realObject = new serverObjectComplete(index, object.serverName, object.serverURL, object.serverFlag, serverOnline, serverInfo, serverPing)
	//serverList[object.serverIndex] = object
	var returnedValue = []
	returnedValue[0] = index
	returnedValue[1] = new serverObjectComplete(index, object.serverName, object.serverURL, object.serverFlag, serverOnline, serverInfo, serverPing)
	return returnedValue
}

var resplice = function(array, index){
	var newArray = []
	for(var i=0; i<array.length; i++){
		if(i!=index){
			newArray.push(array[i])
			
		}
	}
	for (var i=0; i<newArray.length; i++){
		newArray[i].serverIndex = i
	}
	return newArray
}


var removeServer = function(serverNumber){
	serverList = resplice(serverList, serverNumber);
	update();
	/*var newArray = []
	var length = serverList.length - 1
	for(var i=0; i<length; i++){
		if(i!=serverNumber && i<serverNumber){
			newArray.push(serverList[i])	
		}else if(i!=serverNumber && i>serverNumber){
			var i2 = i-1
			newArray.push(serverList[i2])
		}
	}
	//setTimeout(updateServers, 10);
	if(newArray.length < serverList.length){
		serverList = []
		serverList = newArray
		
	} else {
		console.log("error")
	}
	*/
}

var update = function(){
	var temporalArray = serverList
	var temporalArray2 = temporalArray
	temporalArray2 = updateOrder(false, temporalArray);
	serverList = temporalArray2
	updateConfig();
	writeHtml();
}

var upServer = function(serverNumber) {
	if (serverNumber != 0){
		var serverNumber2 = serverNumber - 1 ;
		[ serverList[serverNumber], serverList[serverNumber2] ] = [ serverList[serverNumber2], serverList[serverNumber] ];
		for (var i=0; i<serverList.length; i++){
			serverList[i].serverIndex = i
			var temp = serverList.length;
			temp = temp - 2
			if (i < temp){
				update();
			}
		}
		
	}
	update();
	//location.reload() 
}

var downServer = function(serverNumber) {
	if (serverNumber < serverList.length - 1){
		var serverNumber2 = serverNumber + 1 ;
		[ serverList[serverNumber], serverList[serverNumber2] ] = [ serverList[serverNumber2], serverList[serverNumber] ];
		for (var i=0; i<serverList.length; i++){
			serverList[i].serverIndex = i
			var temp = serverList.length;
			temp = temp - 2
			if (i < temp){
				update();
				//console.log("yes")
			} else{
				//console.log("not")
				}
		}
	}
	update();
	//location.reload() 
}

var updateOrder = function(sw, myArray1){
	var myArray2 = myArray1;
	var length = serverList.length;
	for (var i=0; i<length; i++){
		var obj1 = myArray1[i];
		if(sw){
			var obj2 = new serverObject(i, obj1.serverName, obj1.serverURL, obj1.serverFlag);
		}else{
			var obj2 = new serverObjectComplete(i, obj1.serverName, obj1.serverURL, obj1.serverFlag, obj1.serverOnline, obj1.serverInfo, obj1.serverPing);
		}
		myArray2[i] = obj2;
	}
	serverList = []
	return myArray2
}

var updateServers = async function(){
	document.getElementById("update").classList.add("gly-spin");
	//var tmp = serverList
	var veryTemp = []
	//serverList = []
	//serverList = updateOrder(true, tmp);
	var tempServerList = [];
	var length = serverList.length
	for(var i = 0; i < length; i++){
	veryTemp[i] = objectUpdate(serverList[i], i).then(function(result) {
   tempServerList[result[0]] = result[1]
   serverList[result[0]] = tempServerList[result[0]]
   //console.log(result)
   //update();
   if(result[0] === serverList.length-1) {
	   update();
   }
});
	}
	//serverList = [];
	//serverList = updateOrder(false, tempServerList);
	//update();
	//setTimeout(updateConfig, 400);
	//setTimeout(writeHtml, 400)
	setTimeout(function(){
		document.getElementById("update").classList.remove("gly-spin");
	}, 2000)
}

var testFunction = function(){
addServer("usplay", "usplay.secretalgorithm.com:11451", "SPA")
}

var initializationFunction = function(){
	$(':checkbox').checkboxpicker();
	writeHtml();
	changelog();
	/* $('#fakeInternet').checkboxpicker({
  html: true,
  offLabel: '<i class="fas fa-check"></i>',
  onLabel: '<i class="fas fa-times"></i>'
}); */
/* $('#fakeInternet2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("btn-default")[0].innerHTML = '<i class="fas fa-times"></i>'
$('#fakeInternet2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("active")[0].innerHTML = '<i class="fas fa-check"></i>'
//document.getElementById("fakeInternet").value=1
$('#fakeInternet2')[0].getElementsByClassName("btn-group")[0].setAttribute("style", "background-color: gray; border-radius: 5px;"); */
}

//console.log(config.get('serverList'));    
setTimeout(initializationFunction, 100);