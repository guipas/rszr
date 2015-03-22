

var easyimg = require('easyimage');

var command = require('child_process').exec;
//console.log(easyimg.info(""));


command('convert -version', function(err, stdout, stderr) {

	// ImageMagick is NOT available on the system, exit with download info
	//for now i just copied the check in easyimage
	// TODO : modify the module
	if (err) {
		//$("#error-imagesmagick").show();
	}

})



var app = angular.module("resizer", ["toolkit", "workbench"]);