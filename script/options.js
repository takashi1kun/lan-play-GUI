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
var request = require('request');
var http = require('http');
var serverListFile


var serverList = []

if(config.has('serverList')){
	serverList = config.get('serverList')
	serverListFile = config.get('serverList')
} else{
	config.set('serverList', [])
	serverList= []
	serverListFile = []
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
	} else {
	}
	lanPlayLocation = config.get('lanPlayLocation')
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
var pmtuEnabled
if(config.has('pmtuEnabled')){
	pmtuEnabled = config.get('pmtuEnabled')
} else{
	config.set('pmtuEnabled', false)
	pmtuEnabled = false
}
var proxyEnabled
if(config.has('proxyEnabled')){
	proxyEnabled = config.get('proxyEnabled')
} else{
	config.set('proxyEnabled', false)
	proxyEnabled = false
}

var proxy
if(config.has('proxy')){
	proxy = config.get('proxy')
} else{
	config.set('proxy', "example.com:1234")
	proxy = "example.com:1234"
}

var translate = function(){
	$("#home-tab").html(`<i class="fas fa-cog"></i>`+i18n.__("Main Configuration"))
	$("#profile-tab").html(`<i class="fas fa-network-wired"></i>`+i18n.__("Network Adapter"))
	$("#contact-tab").html(`<i class="fas fa-server"></i>`+i18n.__("Server List"))
	$('#configText1').text(i18n.__("Main Configuration Text"))
	$('#LanPlayLocation3').text(i18n.__("Lan Play Location"))
	$('#browse3').text(i18n.__("Browse"))
	$('#fakeInternet3').text(i18n.__("Fake Internet"))
	$('#Broadcast3').text(i18n.__("Broadcast"))
	$('#loadInterfacesText3').text(i18n.__("Network Adapter Text"))
	$('#loadInterfaces3').text(i18n.__("Load Interfaces"))
	$('#loadInterfacesHelp3').text(i18n.__("Load Interfaces First"))
	$('#serverListText3').text(i18n.__("Server List Text"))
	$('#exportServerList3').text(i18n.__("Export Server List"))
	$('#importServerList3').text(i18n.__("Import Server List"))
	$('#downloadServerList3').text(i18n.__("Download Offical Server List"))
	$('#enableProxy3').text(i18n.__("Enable Proxy:"))
	$('#ok3').text(i18n.__("Ok"))
	$('#apply3').text(i18n.__("Apply"))
	$('#cancel3').text(i18n.__("Cancel"))
}

var inititalization = function(){
	$('#importFile').hide()
	$('#importFile').change(function(ev) {
		if($('#importFile')[0].files[0] === undefined){
			
		}else{
			serverListFile = $('#importFile')[0].files[0]
		}
	});
	$(':checkbox').checkboxpicker();
	//writeHtml();
	$('#fakeInternet').checkboxpicker({
  html: true,
  offLabel: '<i class="fas fa-check"></i>',
  onLabel: '<i class="fas fa-times"></i>'
});
$('#fakeInternet2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("btn-default")[0].innerHTML = '<i class="fas fa-times"></i>'
$('#fakeInternet2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("active")[0].innerHTML = '<i class="fas fa-check"></i>'
$('#Broadcast2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("btn-default")[0].innerHTML = '<i class="fas fa-check"></i>'
$('#Broadcast2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("active")[0].innerHTML = '<i class="fas fa-times"></i>'
$('#pmtuEnable').parent()[0].getElementsByClassName("btn-group")[0].getElementsByClassName("btn-default")[0].innerHTML = '<i class="fas fa-check"></i>'
$('#pmtuEnable').parent()[0].getElementsByClassName("btn-group")[0].getElementsByClassName("active")[0].innerHTML = '<i class="fas fa-times"></i>'
$('#proxy2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("btn-default")[0].innerHTML = '<i class="fas fa-check"></i>'
$('#proxy2')[0].getElementsByClassName("btn-group")[0].getElementsByClassName("active")[0].innerHTML = '<i class="fas fa-times"></i>'
$('#proxyEnabled').checkboxpicker().on('change',function(){
	if($('#proxyEnabled').prop('checked')){
		 $("#overlayTest").hide();
		}else{
			 $("#overlayTest").show();}
	})
	$('#pmtuEnable').checkboxpicker().on('change',function(){
	if($('#pmtuEnable').prop('checked')){
		 $("#overlayTest2").hide();
		}else{
			 $("#overlayTest2").show();}
	})
//document.getElementById("fakeInternet").value=1
//$('#fakeInternet2')[0].getElementsByClassName("btn-group")[0].setAttribute("style", "background-color: gray; border-radius: 5px;");

	//loadInterfaces()
	if(!proxyEnabled){
		$("#overlayTest").show();
	}
	if(!pmtuEnabled){
		$("#overlayTest2").show();
	}
	getConfigOptionsInit()
	translate()
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
	
/* var parseInterfaces = function(str){
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
} */


var parseInterfaces = function(str){
    var everything = [] 
    var names = []
    var descriptions = []
    globalInterfaceStr = str
    for (var i = 0; i < 50; i++) {
        var cutFrom = i + 1 + '. '
        var cutTo = i + 2 + '. '
        var netIf = str.slice(str.indexOf(cutFrom.toString()), str.indexOf(cutTo.toString()))
        if (netIf != '') {
        everything.push(netIf)
    }
}
    for (var i = 0; i < everything.length; i++) {
        if (i < 9) {
            var name = everything[i].slice(3,everything[i].indexOf(' ('))
        names.push(name)
        } else {
            var name = everything[i].slice(4,everything[i].indexOf(' ('))
        names.push(name)
        }
    }
    for (var i = 0; i < everything.length; i++) {
        var desc = everything[i].slice(everything[i].indexOf(' ('),everything[i].indexOf(']'))
        descriptions.push(desc + ']')
    }
    console.log(everything, names, descriptions)
var arrayReturn = []
arrayReturn[0] = names
arrayReturn[1] = descriptions
    return arrayReturn

}




var lanPlayPlace = `C:\\project1\\lan-play-server-watcher\\lan-play.exe`

var loadedInterfaces = false

var selectLanPlay = function(){
var test9 =  dialog.showOpenDialog()
if(test9 === undefined){
	
}else{
	lanPlayLocation = test9[0]
	$('#lanPlayLocation')[0].value = test9[0]
}
}

var parseLinux = function(array1, array2) {
	var array3 = []
	for(i=0;i<array1.length;i++){
		array3[i] = array1[i]+" "+array2[i]
	}
	return array3
}
var globalTest

var macTest0
var macTest1
var macTest2
var macTest3
var macTest4
var macTest5
var macTest6
var macTest7
var macTest8
var macTest9

var loadInterfaces = function(){
	try {
	var version = child_process.execSync(`"`+lanPlayLocation+`"`+" --version").asciiSlice().trim()
	console.log(version) //mac test
	}
	catch(err) {
  console.log("error");
}
	if (version ==="switch-lan-play 0.0.5" || version ==="switch-lan-play 0.0.3" || version ==="switch-lan-play 0.0.1" || version ==="switch-lan-play v0.0.0"){
		document.getElementById("interfaces").innerHTML = `<option style="color:white!important" value="Not Selectod">Update Lan Play to v0.0.7 or higher</option>`
		return "lol" 
	} else if(version === undefined){
		document.getElementById("interfaces").innerHTML = `<option style="color:white!important" value="Not Selectod">Lan Play not found, Download v0.0.7 or higher and configure it in main config.</option>`
		return "lol"
	}
	var interfaces2
	try {
	//interfaces2 = child_process.execSync(lanPlayLocation+" --list-if")
	interfaces2 = child_process.spawnSync(lanPlayLocation,["--list-if"]).output[1]
	macTest0 = interfaces2
	console.log(interfaces2)
	}
	catch(err) {
  console.log("error");
}
	if (interfaces2 === undefined){
		document.getElementById("interfaces").innerHTML = `<option style="color:white!important" value="Not Selectod">Download Lan Play v0.0.7 or higher and configure it in main config.</option>`
		return "lol"
	} else if(interfaces2.asciiSlice().trim()=="Input the relay server address [ domain/ip:port ]:"){
		document.getElementById("interfaces").innerHTML = `<option style="color:white!important" value="Not Selectod">Download Lan Play v0.0.7 or higher and configure it in main config.</option>`
		return "lol"
	}
	var interfaces = interfaces2.asciiSlice()
	macTest1 = interfaces
	console.log(interfaces)//mac test
	var parsedInterfaces = parseInterfaces(interfaces)
	console.log(parsedInterfaces)//mac test
	console.log(removeUnwantedElements(parsedInterfaces))
	parsedInterfaces = removeUnwantedElements(parsedInterfaces)
	macTest2 = parsedInterfaces
	var interfaceValues = parsedInterfaces[0]
	var interfaceLabels = parsedInterfaces[1]
	interfaceLabels = (OS == "win32" ? interfaceLabels : parseLinux(interfaceValues,interfaceLabels))
	interfaceValues[-1] = "Not Selected"
	interfaceLabels[-1] = "No Network Interface"
	document.getElementById("interfaces").innerHTML
	var innerHtml;
	for(i=-1;i<interfaceValues.length;i++){
		innerHtml += `<option style="color:white!important" value="`+interfaceValues[i]+`">`+interfaceLabels[i]+`</option>`
	}
	document.getElementById("interfaces").size=7;
	document.getElementById("interfaces").innerHTML = innerHtml
	loadedInterfaces = true
	if(config.has('networkInterface')){
		document.getElementById("interfaces").value = config.get('networkInterface')
	}
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

var removeUnwantedElements = function(array){
	var array1 = array[0]
	var array2 = array[1]
	var array3 = []
	var array4 = []
	var length = array1.length
	var ipCheck = new RegExp("IP:");
	var ipCheck2 = /IP: \[\]/g
	var ipCheck3 = /0.0.0.1/g
	var ipCheck4 = /127.0.0./g
	ipCheck.lastIndex = 0
		ipCheck2.lastIndex = 0
		ipCheck3.lastIndex = 0
		ipCheck4.lastIndex = 0
	var i2 = 0
	for(i=0;i<length;i++){
		var checkValue = array2[i]
		ipCheck.lastIndex = 0
		ipCheck2.lastIndex = 0
		ipCheck3.lastIndex = 0
		ipCheck4.lastIndex = 0
		if (ipCheck.test(checkValue)){
			ipCheck.lastIndex = 0
		ipCheck2.lastIndex = 0
		ipCheck3.lastIndex = 0
		ipCheck4.lastIndex = 0
			if (!ipCheck2.test(checkValue)){
				ipCheck.lastIndex = 0
		ipCheck2.lastIndex = 0
		ipCheck3.lastIndex = 0
		ipCheck4.lastIndex = 0
				if(!ipCheck3.test(checkValue)){
					ipCheck.lastIndex = 0
		ipCheck2.lastIndex = 0
		ipCheck3.lastIndex = 0
		ipCheck4.lastIndex = 0
					if(!ipCheck4.test(checkValue)){
						ipCheck.lastIndex = 0
		ipCheck2.lastIndex = 0
		ipCheck3.lastIndex = 0
		ipCheck4.lastIndex = 0
			array3[i2] = array1[i]
			array4[i2] = array2[i]
			i2++
			}}} 
		}
	}
	return [array3, array4]
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
		$('#myModal').modal('show')
        fs.writeFile(userChosenPath, json, function(err) {
    // file saved or err
	
});
    }
	
	//myUrlSaveAs(url)
	
}
var showAlert = function(){
	$('#alert').modal('show')
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
			$('#myModal').modal('show')
        }
    });
}

var importServerOfficialList = async function(){
	var dataStream = await fetch(`https://raw.githubusercontent.com/takashi1kun/lan-play-GUI/master/Official_Server_List.json`)
	var array = await dataStream.json()
	serverListFile = createObject(array)
	$('#myModal').modal('show')
}

var getConfigOptionsInit = function(){
	$('#lanPlayLocation')[0].value = lanPlayLocation;
	$('#fakeInternet').prop('checked', fakeInternetEnabled) 
	$('#Broadcast').prop('checked', broadcastEnabled) 
	$('#pmtuEnable').prop('checked', pmtuEnabled) 
	$('#pmtu')[0].value = pmtu;
	$('#proxyEnabled').prop('checked', proxyEnabled)
	$('#proxyUrl')[0].value = proxy;
}
var setConfigOptions = function(){
	config.set('pmtuEnabled',$('#pmtuEnable').prop('checked'));
	config.set('broadcastEnabled',$('#Broadcast').prop('checked'));
	config.set('fakeInternetEnabled',$('#fakeInternet').prop('checked'));
	config.set('lanPlayLocation',lanPlayLocation);
	config.set('pmtu',$('#pmtu')[0].value);
	config.set('serverList', serverListFile);
	config.set('proxyEnabled', $('#proxyEnabled').prop('checked'))
	config.set('proxy',$('#proxyUrl')[0].value);
	if ($('#interfaces')[0].value.trim() != "Not Selectod"){
		config.set('networkInterface',$('#interfaces')[0].value)
	}
}

var saveSettings = function(){
	setConfigOptions()
	remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`)
}

var returnToIndex= function(){
	remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`)
}
setTimeout(inititalization, 200);