//
// Dynamsoft JavaScript Library for Basic Initiation of Dynamic Web TWAIN
// More info on DWT: http://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx
//
// Copyright 2015, Dynamsoft Corporation 
// Author: Dynamsoft Team
// Version: 11.0
//
/// <reference path="dynamsoft.webtwain.initiate.js" />
var Dynamsoft = Dynamsoft || {
	WebTwainEnv : {}
};

Dynamsoft.WebTwainEnv.AutoLoad = true;
// /
Dynamsoft.WebTwainEnv.Containers = [ {
	ContainerId : 'dwtcontrolContainer',
	Width : 500,
	Height : 500
} ];
// /
Dynamsoft.WebTwainEnv.ProductKey = '231461A53463471C8F72C65641F26640E0EAC8B23F63B6A43D568FBD8B05D7A472D4E56A0156FA028F4CE310FA0D8935D4544E4D4B7FDE54F9C2ED7D6C07F8BB17184779677A891B46D7A3B65597E73B2208EDCB94ECCD843D1333B8CD08D7F9D8121193B7099E2150EA562CBEB6BE6A94';
// /
Dynamsoft.WebTwainEnv.Trial = false;
// /
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
// /
Dynamsoft.WebTwainEnv.Debug = false; // only for debugger output
// /
Dynamsoft.WebTwainEnv.ResourcesPath = './plugin/DMSScanPlugin/scanPluginDojo/scan/getResource/scanResources/DWT';

// / All callbacks are defined in the dynamsoft.webtwain.install.js file, you
// can customize them.

// Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function(){
// // webtwain has been inited
// });scanResources
	if (Dynamsoft.WebTwainEnv.RegisterEvent) {

	Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady);

}