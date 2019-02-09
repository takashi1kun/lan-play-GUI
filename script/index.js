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
const semver = require('semver');
const http = require('http');
const https = require('https');
const win = remote.getCurrentWindow();
const Timeout = require('await-timeout')
var express = require("express");
var app = express();
app.use(express.urlencoded())
var portWebService
if(config.has('portWebService')){
	portWebService = config.get('portWebService')
} else{
	config.set('portWebService', 8008)
	portWebService = 8008
}

var enabledWebService
if(config.has('enabledWebService')){
	enabledWebService = config.get('enabledWebService')
} else{
	config.set('enabledWebService', true)
	enabledWebService = true
}

if(enabledWebService){
app.listen(portWebService, () => {
 console.log("Server running on port "+portWebService);
});

app.use(express.static('public'));

app.get("/stopServer", (req, res, next) => {
			killServer()
			//res.send(generateNewHtml())
			res.redirect('/')
});

app.get("/", (req, res, next) => {
 res.send(generateNewHtml())
});
app.get("/updateServers", (req, res, next) => {
	updateServers();
	response = res
 setTimeout(delayedResponse,5000)
});

app.post('/editServer:number', (req, res, next) => {
	var numberi = req.params.number
  console.log(req.body);
  response = req
  var obj = new serverObject(numberi, req.body.serverName, req.body.serverUrl, req.body.serverFlag)
  serverList[numberi] = ""
	serverList[numberi] = obj
	update();
	setTimeout(translate, 100);
  response = res
  $.when(fetchOneServer(numberi)).done(function(){
	  setTimeout(delayedResponse,2000)
  })
});
}
var response
var delayedResponse = function(){
	response.redirect('/');
}


var updateServerUrl = function(){
	//for(var i = 0;i<serverList.length;i++){
		app.get("/startServer:number", (req, res, next) => {
			var numberi = req.params.number
			serverUrele = serverList[numberi]
 openServerOnline(serverUrele);
 //res.send(generateNewHtml())
 res.redirect('/')
});
	//}
}


function testFunc(){
app.get("/variable", (req, res, next) => {
 res.json(serverList);
});

}


var openedServer = [false,{},-1]

var killServer = function(){
	child_process.spawn("taskkill", ["/pid", openedServer[1].pid, '/f', '/t']);
		openedServer[0] = false
		openedServer[2] = -1
		//$('#stopServer').modal('hide')
		update()
}

var openServerOnline = function(serverObject){
	var server = serverObject.serverURL
	//$('#stopServer').modal('show')
	if (openedServer[0]){
		child_process.spawn("taskkill", ["/pid", openedServer[1].pid, '/f', '/t']);
		openedServer[0] = false
		openedServer[2] = -1
	}
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
	if(proxyEnabled){
		var proxyOption = " --socks5-server-addr "+proxy
	}else{
		var proxyOption = ""
	}
	if(pmtuEnabled){
	var pmtuCommand = " --pmtu "+pmtu
	}else{
		var pmtuCommand = ""
	}
	var netIf = " --netif "+networkInterface
	if(networkInterface.trim() == "Not Selected"){
		var netIf = ""
	}
	var argumments = fakeInternet+broadCast+pmtuCommand+netIf+proxyOption
	if(testVersion() === 2){
		$('#modalError1').modal('show')
	}else if(testVersion() === 3){
		$('#modalError2').modal('show')
	}else{
		openedServer[1] = child_process.spawn(lanPlayLocation,[argumments," --relay-server-addr "+ server], {shell: true, detached: true})
		openedServer [0] = true
		openedServer[2] = serverObject.serverURL
		update()
	}
}

var htmlServer = function(serverNumber){
var a = serverList[serverNumber]
var ahtml= `<div class="alert alert-`+((a.serverURL != openedServer[2]) ? ((a.serverOnline) ?`primary`:`danger`):`success`)+`" style="margin-bottom: 1px; ">`+`<span title="fr" class="flag-icon flag-icon-`
	+a.serverFlag.toLowerCase()+
	`"></span>`+`<strong>
`+a.serverName+`</strong> | <i class="fas fa-server"></i>`+a.serverURL+` | `+((a.serverOnline) ? `<i style="color: limegreen;transform: scale(0.5)" class="fas fa-circle"></i>Online` : `<i style="color: red;transform: scale(0.5)" class="fas fa-circle"></i>
Offline`)+` | <i class="fas fa-broadcast-tower"></i>`+a.serverPing+` | 
<img style="width: 22px;" src="data:image/png;base64,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" class="icon">
`+((a.serverInfo.online != -1) ? (a.serverInfo.online+` players`) : "---")+` | 
<div class="btn-group" role="group" aria-label="Basic example">
					`+((a.serverURL != openedServer[2]) ? `<a role="button" href="/startServer`+a.serverIndex+`" class="btn btn-success"><i class="fas fa-play"></i> Connect to Server</a>` : `<a role="button" href="/stopServer" class="btn btn-danger"><i class="fas fa-stop"></i> Disconnect from Server</a>
					`)+`<button data-toggle="collapse" data-target="#collapseEdit`+a.serverIndex+`" aria-expanded="false" aria-controls="collapseEdit`+a.serverIndex+`" type="button" class="btn btn-primary"><i class="far fa-edit"></i>Edit</button> <a href="#" role="button" class="btn btn-danger"><i class="fas fa-times"></i> Delete</a>
					
					</div><div class="collapse" id="collapseEdit`+a.serverIndex+`"><hr>
  <div class="card card-body">
          <form method="POST" action="/editServer`+a.serverIndex+`" id="addServerForm" class="form-inline">
		   <ul class="list-group list-group-flush">
		   <li class="list-group-item">
  <label id="translateServerName3" class="sr-only" for="inlineFormInputName2">Server Name</label>
   <div class="input-group mb-1 mr-sm-1">
    <div class="input-group-prepend">
      <div id="translateServerName4" class="input-group-text">Server Name</div>
    </div>
  <input name="serverName" value="`+a.serverName+`" id="editServerFormName" type="text" style="width: 200px" class="form-control" placeholder="Server 1">
</div>
</li><li class="list-group-item">
  <label id="translateServerURL3" class="sr-only" for="inlineFormInputGroupUsername2">Server URL</label>
  <div class="input-group mb-1 mr-sm-1">
    <div class="input-group-prepend">
      <div id="translateServerURL4" class="input-group-text">Server URL</div>
    </div>
    <input name="serverUrl" type="text" value="`+a.serverURL+`" id="editServerFormURL" style="width: 300px" class="form-control" placeholder="example.com:11451">
  </div>
  </li><li class="list-group-item">
   <div class="input-group mb-1 mr-sm-1">
    <div class="input-group-prepend">
      <div id="translateCountry2" class="input-group-text">Country</div>
    </div>
	
  <select name="serverFlag" value="`+a.serverFlag+`" class="form-control" id="editServerFormCountry`+a.serverIndex+`" style="width: 200px">
	<option id="translateNoCountry2" value="NFlag">No Country</option>
	<option value="EU">Europe</option>	<option value="AF">Afghanistan</option>	<option value="AX">Åland Islands</option>	<option value="AL">Albania</option>	<option value="DZ">Algeria</option>	<option value="AS">American Samoa</option>	<option value="AD">Andorra</option>	<option value="AO">Angola</option>	<option value="AI">Anguilla</option>	<option value="AQ">Antarctica</option>	<option value="AG">Antigua and Barbuda</option>	<option value="AR">Argentina</option>	<option value="AM">Armenia</option>	<option value="AW">Aruba</option>	<option value="AU">Australia</option>	<option value="AT">Austria</option>	<option value="AZ">Azerbaijan</option>	<option value="BS">Bahamas</option>	<option value="BH">Bahrain</option>	<option value="BD">Bangladesh</option>	<option value="BB">Barbados</option>	<option value="BY">Belarus</option>	<option value="BE">Belgium</option>	<option value="BZ">Belize</option>	<option value="BJ">Benin</option>	<option value="BM">Bermuda</option>	<option value="BT">Bhutan</option>	<option value="BO">Bolivia, Plurinational State of</option>	<option value="BQ">Bonaire, Sint Eustatius and Saba</option>	<option value="BA">Bosnia and Herzegovina</option>	<option value="BW">Botswana</option>	<option value="BV">Bouvet Island</option>	<option value="BR">Brazil</option>	<option value="IO">British Indian Ocean Territory</option>	<option value="BN">Brunei Darussalam</option>	<option value="BG">Bulgaria</option>	<option value="BF">Burkina Faso</option>	<option value="BI">Burundi</option>	<option value="KH">Cambodia</option>	<option value="CM">Cameroon</option>	<option value="CA">Canada</option>	<option value="CV">Cape Verde</option>	<option value="KY">Cayman Islands</option>	<option value="CF">Central African Republic</option>	<option value="TD">Chad</option>	<option value="CL">Chile</option>	<option value="CN">China</option>	<option value="CX">Christmas Island</option>	<option value="CC">Cocos (Keeling) Islands</option>	<option value="CO">Colombia</option>	<option value="KM">Comoros</option>	<option value="CG">Congo</option>	<option value="CD">Congo, the Democratic Republic of the</option>	<option value="CK">Cook Islands</option>	<option value="CR">Costa Rica</option>	<option value="CI">Côte d'Ivoire</option>	<option value="HR">Croatia</option>	<option value="CU">Cuba</option>	<option value="CW">Curaçao</option>	<option value="CY">Cyprus</option>	<option value="CZ">Czech Republic</option>	<option value="DK">Denmark</option>	<option value="DJ">Djibouti</option>	<option value="DM">Dominica</option>	<option value="DO">Dominican Republic</option>	<option value="EC">Ecuador</option>	<option value="EG">Egypt</option>	<option value="SV">El Salvador</option>	<option value="GQ">Equatorial Guinea</option>	<option value="ER">Eritrea</option>	<option value="EE">Estonia</option>	<option value="ET">Ethiopia</option>	<option value="FK">Falkland Islands (Malvinas)</option>	<option value="FO">Faroe Islands</option>	<option value="FJ">Fiji</option>	<option value="FI">Finland</option>	<option value="FR">France</option>	<option value="GF">French Guiana</option>	<option value="PF">French Polynesia</option>	<option value="TF">French Southern Territories</option>	<option value="GA">Gabon</option>	<option value="GM">Gambia</option>	<option value="GE">Georgia</option>	<option value="DE">Germany</option>	<option value="GH">Ghana</option>	<option value="GI">Gibraltar</option>	<option value="GR">Greece</option>	<option value="GL">Greenland</option>	<option value="GD">Grenada</option>	<option value="GP">Guadeloupe</option>	<option value="GU">Guam</option>	<option value="GT">Guatemala</option>	<option value="GG">Guernsey</option>	<option value="GN">Guinea</option>	<option value="GW">Guinea-Bissau</option>	<option value="GY">Guyana</option>	<option value="HT">Haiti</option>	<option value="HM">Heard Island and McDonald Islands</option>	<option value="VA">Holy See (Vatican City State)</option>	<option value="HN">Honduras</option>	<option value="HK">Hong Kong</option>	<option value="HU">Hungary</option>	<option value="IS">Iceland</option>	<option value="IN">India</option>	<option value="ID">Indonesia</option>	<option value="IR">Iran, Islamic Republic of</option>	<option value="IQ">Iraq</option>	<option value="IE">Ireland</option>	<option value="IM">Isle of Man</option>	<option value="IL">Israel</option>	<option value="IT">Italy</option>	<option value="JM">Jamaica</option>	<option value="JP">Japan</option>	<option value="JE">Jersey</option>	<option value="JO">Jordan</option>	<option value="KZ">Kazakhstan</option>	<option value="KE">Kenya</option>	<option value="KI">Kiribati</option>	<option value="KP">Korea, Democratic People's Republic of</option>	<option value="KR">Korea, Republic of</option>	<option value="KW">Kuwait</option>	<option value="KG">Kyrgyzstan</option>	<option value="LA">Lao People's Democratic Republic</option>	<option value="LV">Latvia</option>	<option value="LB">Lebanon</option>	<option value="LS">Lesotho</option>	<option value="LR">Liberia</option>	<option value="LY">Libya</option>	<option value="LI">Liechtenstein</option>	<option value="LT">Lithuania</option>	<option value="LU">Luxembourg</option>	<option value="MO">Macao</option>	<option value="MK">Macedonia, the former Yugoslav Republic of</option>	<option value="MG">Madagascar</option>	<option value="MW">Malawi</option>	<option value="MY">Malaysia</option>	<option value="MV">Maldives</option>	<option value="ML">Mali</option>	<option value="MT">Malta</option>	<option value="MH">Marshall Islands</option>	<option value="MQ">Martinique</option>	<option value="MR">Mauritania</option>	<option value="MU">Mauritius</option>	<option value="YT">Mayotte</option>	<option value="MX">Mexico</option>	<option value="FM">Micronesia, Federated States of</option>	<option value="MD">Moldova, Republic of</option>	<option value="MC">Monaco</option>	<option value="MN">Mongolia</option>	<option value="ME">Montenegro</option>	<option value="MS">Montserrat</option>	<option value="MA">Morocco</option>	<option value="MZ">Mozambique</option>	<option value="MM">Myanmar</option>	<option value="NA">Namibia</option>	<option value="NR">Nauru</option>	<option value="NP">Nepal</option>	<option value="NL">Netherlands</option>	<option value="NC">New Caledonia</option>	<option value="NZ">New Zealand</option>	<option value="NI">Nicaragua</option>	<option value="NE">Niger</option>	<option value="NG">Nigeria</option>	<option value="NU">Niue</option>	<option value="NF">Norfolk Island</option>	<option value="MP">Northern Mariana Islands</option>	<option value="NO">Norway</option>	<option value="OM">Oman</option>	<option value="PK">Pakistan</option>	<option value="PW">Palau</option>	<option value="PS">Palestinian Territory, Occupied</option>	<option value="PA">Panama</option>	<option value="PG">Papua New Guinea</option>	<option value="PY">Paraguay</option>	<option value="PE">Peru</option>	<option value="PH">Philippines</option>	<option value="PN">Pitcairn</option>	<option value="PL">Poland</option>	<option value="PT">Portugal</option>	<option value="PR">Puerto Rico</option>	<option value="QA">Qatar</option>	<option value="RE">Réunion</option>	<option value="RO">Romania</option>	<option value="RU">Russian Federation</option>	<option value="RW">Rwanda</option>	<option value="BL">Saint Barthélemy</option>	<option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>	<option value="KN">Saint Kitts and Nevis</option>	<option value="LC">Saint Lucia</option>	<option value="MF">Saint Martin (French part)</option>	<option value="PM">Saint Pierre and Miquelon</option>	<option value="VC">Saint Vincent and the Grenadines</option>	<option value="WS">Samoa</option>	<option value="SM">San Marino</option>	<option value="ST">Sao Tome and Principe</option>	<option value="SA">Saudi Arabia</option>	<option value="SN">Senegal</option>	<option value="RS">Serbia</option>	<option value="SC">Seychelles</option>	<option value="SL">Sierra Leone</option>	<option value="SG">Singapore</option>	<option value="SX">Sint Maarten (Dutch part)</option>	<option value="SK">Slovakia</option>	<option value="SI">Slovenia</option>	<option value="SB">Solomon Islands</option>	<option value="SO">Somalia</option>	<option value="ZA">South Africa</option>	<option value="GS">South Georgia and the South Sandwich Islands</option>	<option value="SS">South Sudan</option>	<option value="ES">Spain</option>	<option value="LK">Sri Lanka</option>	<option value="SD">Sudan</option>	<option value="SR">Suriname</option>	<option value="SJ">Svalbard and Jan Mayen</option>	<option value="SZ">Swaziland</option>	<option value="SE">Sweden</option>	<option value="CH">Switzerland</option>	<option value="SY">Syrian Arab Republic</option>	<option value="TJ">Tajikistan</option>	<option value="TZ">Tanzania, United Republic of</option>	<option value="TH">Thailand</option>	<option value="TL">Timor-Leste</option>	<option value="TG">Togo</option>	<option value="TK">Tokelau</option>	<option value="TO">Tonga</option>	<option value="TT">Trinidad and Tobago</option>	<option value="TN">Tunisia</option>	<option value="TR">Turkey</option>	<option value="TM">Turkmenistan</option>	<option value="TC">Turks and Caicos Islands</option>	<option value="TV">Tuvalu</option>	<option value="UG">Uganda</option>	<option value="UA">Ukraine</option>	<option value="AE">United Arab Emirates</option>	<option value="GB">United Kingdom</option>	<option value="US">United States</option>	<option value="UM">United States Minor Outlying Islands</option>	<option value="UY">Uruguay</option>	<option value="UZ">Uzbekistan</option>	<option value="VU">Vanuatu</option>	<option value="VE">Venezuela, Bolivarian Republic of</option>	<option value="VN">Viet Nam</option>	<option value="VG">Virgin Islands, British</option>	<option value="VI">Virgin Islands, U.S.</option>	<option value="WF">Wallis and Futuna</option>	<option value="EH">Western Sahara</option>	<option value="YE">Yemen</option>	<option value="ZM">Zambia</option>	<option value="ZW">Zimbabwe</option>
</select>
</div></li><li class="list-group-item">
<button type="submit" class="btn btn-primary" formaction="/editServer`+a.serverIndex+`">Save</button><input type="submit" /></li>
</ul>
</form>

  </div>
</div>


</div>  <script>document.getElementById("editServerFormCountry`+a.serverIndex+`").value = "`+a.serverFlag+`"</script>
`
return ahtml
}


var generateNewHtml = function(){
	var myHtmlHead = `<head>
	<meta charset="UTF-8">
	
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/flag-icon.min.css">
	<link rel="stylesheet" href="css/all.css">
	<script src="script/jquery-3.3.1.min.js" defer></script>
	<script src="script/bootstrap-checkbox.js" defer></script>
	<script src="js/bootstrap.min.js" defer></script>
	</head>`
	var myHtml= `<div style="background-color:#343a40!important;width:100%;height:fit-content">
	<a style="color:white;font-size: 26;"><strong>Lan Play GUI</strong></a><div style="width: fit-content;height: fit-content%;float: right;">
	<a role="button" href="." class="btn btn-secondary"><i id="update" class="fas fa-sync-alt"></i>Reload</a>
	<a role="button" href="/updateServers" class="btn btn-primary"><i id="update" class="fas fa-sync-alt"></i>Update</a>
	<button type="button" class="btn btn-success"><i class="fas fa-plus-circle"></i>Add New Server</button>
	</div></div>`
	for(var i = 0;i<serverList.length;i++){
		myHtml = myHtml+htmlServer(i)
	}
	myHtml= myHtml+`<a href=".">Reload</a><hr>`
	if(openedServer[0]){
		myHtml = myHtml+`<a href="/stopServer">Stop Server</a><hr>` 
	}
	var myHtml = `<html>`+myHtmlHead+`<body style="background-color: #454d54!important;">`+myHtml+`</body></html>`
	return myHtml
}



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

//const { fork } = require('child_process')
//const ps = fork(`${__dirname}/server.js`)

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
	if(proxyEnabled){
		var proxyOption = " --socks5-server-addr "+proxy
	}else{
		var proxyOption = ""
	}
	if(pmtuEnabled){
	var pmtuCommand = " --pmtu "+pmtu
	}else{
		var pmtuCommand = ""
	}
	var netIf = " --netif "+networkInterface
	if(networkInterface.trim() == "Not Selected"){
		var netIf = ""
	}
	var argumments = fakeInternet+broadCast+pmtuCommand+netIf+proxyOption
	if(testVersion() === 2){
		$('#modalError1').modal('show')
	}else if(testVersion() === 3){
		$('#modalError2').modal('show')
	}else{
	if (OS == "win32"){ //If OS is Windows
		if (os.arch == "x64"){ //win64
			var commandString = "start cmd.exe /K "+`"`+lanPlayLocation+`"`+argumments+" --relay-server-addr "+ server
			console.log(commandString)
		} else { //win32
			var commandString = "start cmd.exe /K "+`"`+lanPlayLocation+`"`+argumments+" --relay-server-addr "+ server
		}
	} else if(OS == "linux"){ //If OS is Linux
		var commandString = "x-terminal-emulator -e "+`"`+lanPlayLocation+`"`+argumments+" --relay-server-addr "+ server
	} else if (OS == "darwin"){//If OS is MacOS
		var commandString = `osascript -e 'tell app "Terminal" to do script "`+"sudo "+lanPlayLocation+argumments+" --relay-server-addr "+ server+`"'`;
		child_process.execSync(commandString);
		return "lol"
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

var taskBarMenuUpdate = function(){
	var tasks = []
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
	if(proxyEnabled){
		var proxyOption = " --socks5-server-addr "+proxy
	}else{
		var proxyOption = ""
	}
	if(pmtuEnabled){
	var pmtuCommand = " --pmtu "+pmtu
	}else{
		var pmtuCommand = ""
	}
	var netIf = " --netif "+networkInterface
	if(networkInterface.trim() == "Not Selected"){
		var netIf = ""
	}
	
	var argumments = fakeInternet+broadCast+pmtuCommand+netIf+proxyOption
	
	for(var i = 0; i<serverList.length;i++){
		var argus = argumments+" --relay-server-addr "+ serverList[i].serverURL
		if(serverList[i].serverOnline){
			var ico = path.resolve(__dirname+`/images/online.ico`)
		}else{
			var ico = path.resolve(__dirname+`/images/offline.ico`)
		}
		tasks[i] = {
			program: lanPlayLocation,
			arguments: argus,
			iconPath: ico,
			iconIndex: 0,
			title: serverList[i].serverName+" "+serverList[i].serverPing+" "+serverList[i].serverInfo.online+"👥",
			description: serverList[i].serverURL
		}
	}
console.log(tasks)
	remote.app.setUserTasks(tasks)
}




var innerHtml = ``;
var writeHtml = function(){
	if(enabledWebService){
	updateServerUrl()
	testFunc()
	}
	taskBarMenuUpdate()
	innerHtml = ``;
	for(var i = 0; i < serverList.length; i++){
		if (serverList[i].serverOnline){
			var serverColor = "limegreen"
			var serverOnline = i18n.__("Online")
			
		} else {
			var serverColor = "red"
			var serverOnline = i18n.__("Offline")
			
		}
		if (serverList[i].serverInfo === undefined) {
			var online = "0"
			var version = i18n.__("Not Online")
		} else {
			if(serverList[i].serverInfo.version === undefined){
				var online = "0"
				var version = i18n.__("Not Online")
			}else{
				var online = serverList[i].serverInfo.online
				var version = serverList[i].serverInfo.version
			}
		}
		innerHtml = innerHtml + `
	<div id="server_`
	+i+
	`">
			<div class="alert alert-`+((serverList[i].serverURL != openedServer[2]) ? ((serverList[i].serverOnline) ?`primary`:`danger`):`success`)+`" style="margin-bottom: 1px; ">
			<div class="row">
			<div class="col-sm-1"> <div style="padding-left: 5px;" onClick="upServer(`
	+i+
	`,$(this))"><i class="fas fa-sort-up"></i></div><div style="padding-top: 4px;padding-bottom: 4px;"><span title="fr" class="flag-icon flag-icon-`
	+serverList[i].serverFlag.toLowerCase()+
	`"></span></div><div style="padding-left: 5px;" onClick="downServer(`
	+i+
	`,$(this))"><i class="fas fa-sort-down"></i></div></div>
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
	+((online != -1) ? (online+" "+i18n.__("Playing")): "---")+` | <i class="fas fa-laptop-code"></i>`+((version != "Not Online") ? (i18n.__("Version")+" "+version) : "---")+
	`</div>
				<div class="col-1">
				<div class="btn-group" role="group" aria-label="Basic example">
				`+((serverList[i].serverURL != openedServer[2]) ? `<button style="height: 38px;" type="button" onClick="openServerOnline(openServerOnline2(`+serverList[i].serverIndex+`))" id="translateConnectToServer`+i+`" class="btn btn-success"><i class="fas fa-play"></i> `+i18n.__("Connect to Server")+`</button>
	`:`<button style="height: 38px;" type="button" onClick="killServer()" id="translateConnectToServer`+i+`" class="btn btn-danger"><i class="fas fa-stop"></i> `+i18n.__("Disconnect from Server")+`</button>`)+`
</div><br />
<div class="btn-group" role="group" aria-label="Basic example">
					<button style="height: 38px;" id="translateEditServer`+i+`"type="button" onClick="editServer(`
	+i+
	`)" data-toggle="modal" data-target="#editServer" class="btn btn-primary"><i class="far fa-edit"></i>`+" "+i18n.__("Edit")+`</button>
					<button style="height: 38px;" id="translateRemoveServer`+i+`" type="button" onClick="removeServer(`
	+i+
	`)" class="btn btn-danger"><i class="fas fa-times"></i>`+" "+i18n.__("Remove")+`</button>
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


var openServerOnline2 = function(serverId){
	return serverList[serverId]
}
var reLoad = function(){
	location.reload()
}

var translate = function(){
	$("#translateServerName1").text(i18n.__("Server Name"))
	$("#translateServerName2").text(i18n.__("Server Name"))
	$("#translateServerName3").text(i18n.__("Server Name"))
	$("#translateServerName4").text(i18n.__("Server Name"))
	$("#translateServerURL1").text(i18n.__("Server URL"))
	$("#translateServerURL2").text(i18n.__("Server URL"))
	$("#translateServerURL3").text(i18n.__("Server URL"))
	$("#translateServerURL4").text(i18n.__("Server URL"))
	$("#translateCountry1").text(i18n.__("Country"))
	$("#translateCountry2").text(i18n.__("Country"))
	$("#translateNoCountry1").text(i18n.__("No Country"))
	$("#translateNoCountry2").text(i18n.__("No Country"))
	$("#translateClose1").text(i18n.__("Close"))
	$("#translateClose2").text(i18n.__("Close"))
	$("#translateAddServer").text(i18n.__("Add Server"))
	$("#translateEditServer").text(i18n.__("Edit Server"))
	$("#translateSave").text(i18n.__("Save"))
	$("#translateServerList").text(i18n.__("Server List"))
	$("#translateSettings").html(`<i class="fas fa-cogs"></i>`+i18n.__("Settings"))
	$("#translateAddNewServer").html(`<i class="fas fa-plus-circle"></i>`+i18n.__("Add New Server"))
	$("#translateAddNewServer2").text(i18n.__("Add New Server"))
	$("#translateUpdate").html(`<i id="update" class="fas fa-sync-alt"></i>`+i18n.__("Update"))
	$("#updateAvaliable").text(i18n.__("NEW UPDATE AVALIABLE"))
	$("#updateAvaliableText").text(i18n.__("NEW UPDATE AVALIABLE text"))
	$("#downloadUpdate").text(i18n.__("Download Update"))
	$("#versionTitle").text(" "+guiVersion+updateAvaliable)
	translateServers()
}

var translateServers = function(){
	for(var i=0;i<=serverList.length;i++){
		resizeToFit($("#translateConnectToServer"+i),180)
		resizeToFit($("#translateEditServer"+i),89.8)
		resizeToFit($("#translateRemoveServer"+i),89.9)
	}
}

var resizeToFit = function(elmnt, wd){
	 var fontsize = parseFloat(elmnt.css('font-size'));
	 if(elmnt.innerWidth()>wd){
        for(var i=0;elmnt.innerWidth()>wd;i++){
			elmnt.css('fontSize', (parseFloat(fontsize) - i)+"px");
		}
    } 
		elmnt.innerWidth(wd)
	
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
	setTimeout(translate, 100);
}


var pingServer = async function(index){
	var url = ("http://" + serverList[index].serverURL).split('http://').pop().split(':')[0];
	var ip2 = pingServerStep2(url)
	console.log(ip2)
	//try {
	let ip1 = await Timeout.wrap(ip2, 550, 'Timeout')
	//} catch(err){
		//return "+350ms"
	//}
	var pings2 = udpPing(ip1)
	console.log([index,pings2])
	//try {
	let pings = await Timeout.wrap(pings2, 550, 'Timeout')
	//} catch(err){
		//return "+350ms"
	//}

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
   setTimeout(translate, 100);
});
}

var globalTest;

var openConfiguration = function(){
	win.setThumbarButtons([])
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

var progress = {a:0,b:0,c:function(){return (this.a+this.b);}}
var progressMax = 0
var serverStatusArray = []
var pingStatusArray = []

var changeValue = function(value){
	win.setProgressBar(value/100);
	$("#loadingBar")
      .css("width", Math.round(value) + "%")
      .attr("aria-valuenow", Math.round(value))
      .text(value + "%");}
	  
var newFetchServers = function(){
	progress.a = 0
	progress.b = 0
	progressMax= 0
	  $('#loadingBarModal').modal({
                        backdrop: 'static',
                        keyboard: false
                }); 
	progressMax = serverList.length * 2
	for (var i = 0;i<serverList.length;i++){
		$.when(newPingServer(serverList[i])).done(function() { 
    progress.a++
	changeValue(Math.round(progress.c()*100/progressMax))
	if(progress.c()===progressMax){
		win.setProgressBar(0)
		setTimeout(fetchCompleted,500)
	}
})
}
	for (var i = 0;i<serverList.length;i++){
		$.when(newStatusServer(serverList[i])).done(function () { 
    progress.b++
	changeValue(Math.round(progress.c()*100/progressMax))
	if(progress.c()===progressMax){
		win.setProgressBar(0)
		setTimeout(fetchCompleted,500)
	}
})
	}
}

var guiVersion = "1.3.0"
var versionActual = ""
var updateAvaliable=""

if(config.has('skipVersion')){
	if(semver.lt(config.get('skipVersion'),guiVersion)){
		config.set('skipVersion', guiVersion)
	}
} else{
	config.set('skipVersion', guiVersion)
}

var skipVersion = function(){
	config.set('skipVersion', versionActual)
}
var versionCheck = function(){
	$.getJSON("https://api.github.com/repos/takashi1kun/lan-play-GUI/releases/latest").done(function(release){
var versionActual1 = release.tag_name;
var versionActual2 = versionActual1.substr(1)
versionActual = versionActual2
if(semver.lt(guiVersion, versionActual2)){
	$("#updateAvaliable").text(i18n.__("NEW UPDATE AVALIABLE")+" "+versionActual1)
	$("#updateAvaliableText").text(i18n.__("NEW UPDATE AVALIABLE text").replace('$VERSION_NUMBER$', "v"+guiVersion).replace('%VERSION_NUMBER%', versionActual1))
	if(semver.lt(config.get('skipVersion'),versionActual2)){
		$('#modalUpdate').modal('show')
	}
	updateAvaliable= " "+i18n.__("NEW UPDATE AVALIABLE")+" "+versionActual2
	$("#versionTitle").text(" "+guiVersion+updateAvaliable)
}
})	
}

var downloadFile = function(url, path, cb) {
	 $('#loadingBarModal').modal({
                        backdrop: 'static',
                        keyboard: false
                }); 
    var http_or_https = http;
    if (/^https:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(url)) {
        http_or_https = https;
    }
    http_or_https.get(url, function(response) {
        var headers = JSON.stringify(response.headers);
		var len = parseInt(response.headers['content-length'], 10);
        var body = "";
        var cur = 0;
        var total = len / 1048576;
		response.on("data", function(chunk) {
                body += chunk;
                cur += chunk.length;
                //win.setProgressBar((100.0 * cur / len).toFixed(2)/100)
				changeValue((100.0 * cur / len).toFixed(2)/100*100)
				if(((100.0 * cur / len).toFixed(2)/100) == 1){
					win.setProgressBar(0)
					$('#loadingBarModal').modal("hide");
				}
            });
		response.on("end", function(){
			//win.setProgressBar(0)
			//$('#loadingBarModal').modal("hide");
		})
		response.on("error", function(e){
			//win.setProgressBar(0)
			console.log("Error: "+e.message)
		})
        switch(response.statusCode) {
            case 200:
                var file = fs.createWriteStream(path);
                response.on('data', function(chunk){
                    file.write(chunk);
                }).on('end', function(){
                    file.end();
                    cb(null);
                });
                break;
            case 301:
            case 302:
            case 303:
            case 307:
                downloadFile(response.headers.location, path, cb);
                break;
            default:
                cb(new Error('Server responded with status code ' + response.statusCode));
        }

    })
    .on('error', function(err) {
        cb(err);
    });
}

var checkOsString = function(str){
	var arch = os.arch()
	var sys = os.platform()
	if(wordInString(str, "linux")&&sys=="linux"&&arch!="arm"){
		return [true, "linux"]
	}else if(wordInString(str, "OSX")&&sys=="darwin"){
		return [true, "OSX"]
	}else if(wordInString(str, "win32")&&sys=="win32"&&arch!="x64"){
		return [true, "win32"]
	}else if(wordInString(str, "win64")&&sys=="win32"&&arch=="x64"){
		return [true, "win64"]
	}else if(wordInString(str, "raspberryPi")&&sys=="linux"&&arch=="arm"){
		return [true, "rPi"]
	}else{
		return false
	}
}

var wordInString = function(s, word){
  return new RegExp( '\\b' + word + '\\b', 'i').test(s);
}

var downloadDir
var downloadLink = ["no","no"]
var updateGui = function(){
	$.getJSON("https://api.github.com/repos/takashi1kun/lan-play-GUI/releases/latest").done(function(release){
		var downloadInfo = release.assets
		downloadLink = ["no","no"]
		for (var i=0;i<downloadInfo.length;i++){
			var a = downloadInfo[i]
			var b = checkOsString(a.name)
			if(b[0]){
				downloadLink = [a.browser_download_url,b,a.name];
				break;
			}
		}
		if(downloadLink[0]!="no"){
			if(OS=="win32"){
				if (!fs.existsSync(os.homedir()+"\\temporalGUIfolder")){
    fs.mkdirSync(os.homedir()+"\\temporalGUIfolder");
}
				downloadDir = os.homedir()+"\\temporalGUIfolder\\"+downloadLink[2]
			}else{
				if (!fs.existsSync(os.homedir()+"/temporalGUIfolder")){
    fs.mkdirSync(os.homedir()+"/temporalGUIfolder");
}
				downloadDir = os.homedir()+"/temporalGUIfolder/"+downloadLink[2]
			}
			downloadFile(downloadLink[0],downloadDir,function(){
				shell.showItemInFolder(downloadDir)
			})
		}
		
	})
}

var fetchCompleted = function(){
	$('#loadingBarModal').modal("hide");
	win.setProgressBar(0);
	for(var i=0;i<serverList.length;i++){
		serverList[i].serverInfo = serverStatusArray[i]
		serverList[i].serverPing = pingStatusArray[i]
		if (serverStatusArray[i].version == "Not Online" && pingStatusArray[i] == "+350ms"){
			serverList[i].serverOnline = false
		} else{
			serverList[i].serverOnline = true
		}
	}
	update();
}

var newPingServer = async function(obj){
	var index = obj.serverIndex
	console.log(index)
	try {
		pingStatusArray[index] = await pingServer(index)
	}catch(err){
		pingStatusArray[index] ="+350ms"
	}
}
var serverChangeId = -1
var fetchOneServer = function(serverId){
	serverChangeId = serverId
	$.when(newPingServer(serverList[serverId])).done(function(){
		$.when(newStatusServer(serverList[serverChangeId])).done(function(){
			serverList[serverChangeId].serverPing = pingStatusArray[serverChangeId]
			serverList[serverChangeId].serverInfo = serverStatusArray[serverChangeId]
			if (serverStatusArray[serverChangeId].version == "Not Online" && pingStatusArray[serverChangeId] == "+350ms"){
			serverList[serverChangeId].serverOnline = false
		} else{
			serverList[serverChangeId].serverOnline = true
		}
		update();
	})
	})
}

var newStatusServer = async function(obj){
	var serverInfoURL = "http://" + obj.serverURL + "/info";
	try {
		serverStatusArray[obj.serverIndex] = await fetchServer(serverInfoURL)
	}catch(err){
		serverStatusArray[obj.serverIndex] = {online:-1,version:"Not Online"}
	}
}


var fetchServer = async function(surl){
	var fetchPromise = fetch(surl)
	console.log([surl,fetchPromise])
	try {
	let fetchResolved = await Timeout.wrap(fetchPromise, 1700, 'Timeout');
	var jsonPromise = fetchResolved.json()
	let jsonResolved = await Timeout.wrap(jsonPromise, 500, 'Timeout');
	return jsonResolved
	}
	catch(err){
		return {online:-1,version:"Not Online"}
	}
	
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
	setTimeout(translate, 100);
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
	translateServers()
}

function moveUp(item) {
    var prev = item.prev();
    if (prev.length == 0)
        return;
    prev.css('z-index', 999).css('position','relative').animate({ top: item.height() }, 250);
    item.css('z-index', 1000).css('position', 'relative').animate({ top: '-' + prev.height() }, 300, function () {
        prev.css('z-index', '').css('top', '').css('position', '');
        item.css('z-index', '').css('top', '').css('position', '');
        item.insertBefore(prev);
    });
	setTimeout(update, 400)
}
function moveDown(item) {
    var next = item.next();
    if (next.length == 0)
        return;
    next.css('z-index', 999).css('position', 'relative').animate({ top: '-' + item.height() }, 250);
    item.css('z-index', 1000).css('position', 'relative').animate({ top: next.height() }, 300, function () {
        next.css('z-index', '').css('top', '').css('position', '');
        item.css('z-index', '').css('top', '').css('position', '');
        item.insertAfter(next);
    });
	setTimeout(update, 400)
}


var upServer = function(serverNumber, buton) {
	if (serverNumber != 0){
		var serverNumber2 = serverNumber - 1 ;
		[ serverList[serverNumber], serverList[serverNumber2] ] = [ serverList[serverNumber2], serverList[serverNumber] ];
		for (var i=0; i<serverList.length; i++){
			serverList[i].serverIndex = i
			var temp = serverList.length;
			temp = temp - 2
			if (i < temp){
				//update();
			}
		}
		
		moveUp($("#server_"+serverNumber))
	}
	//update();

	//location.reload() 
}

var downServer = function(serverNumber, buton) {
	if (serverNumber < serverList.length - 1){
		var serverNumber2 = serverNumber + 1 ;
		[ serverList[serverNumber], serverList[serverNumber2] ] = [ serverList[serverNumber2], serverList[serverNumber] ];
		for (var i=0; i<serverList.length; i++){
			serverList[i].serverIndex = i
			var temp = serverList.length;
			temp = temp - 2
			if (i < temp){
				//update();
				//console.log("yes")
			} else{
				//console.log("not")
				}
		}
	}
	moveDown($("#server_"+serverNumber))
	//update();

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

var updateServers2 = async function(){
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


var updateServers = async function(){
	document.getElementById("update").classList.add("gly-spin");
	newFetchServers()
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
	win.setThumbarButtons([{
icon: path.resolve(__dirname+`/images/gears.ico`),
click: function(){openConfiguration();},
tooltip:i18n.__("Settings")},{
icon: path.resolve(__dirname+`/images/update.ico`),
click: function(){updateServers();},
tooltip:i18n.__("Update")},{
icon: path.resolve(__dirname+`/images/newserver.ico`),
click: function(){$('#addNewServer').modal();},
tooltip:i18n.__("Add New Server")}])
	setTimeout(translate, 100);
	setTimeout(versionCheck, 500)
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