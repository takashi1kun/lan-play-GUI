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

var serverListFile

var inititalization = function(){
	$('#importFile').hide()
	$('#importFile').addEventListener("change", function () {
		if($('#importFile')[0].files[0] === undefined){
			
		}else{
			serverListFile = $('#importFile')[0].files[0]
		}
	}
} 

var importServerList = function(){ 
   $('#importFile').click()
}

var returnToIndex= function(){
	remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`)
}
setTimeout(inititalization, 200);