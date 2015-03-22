


/* 1 image serice = 1 job on 1 image
* the angula controller "toolkit" and "workbench" communicate throught it
*/
function ImageService() {

	/* File info we'll retrieve with image magick*/
	this._file = {};

	this._keepRatio = true;//keep original ratio ?
	this._finalWidth = 0;
	this._finalHeight = 0;

	/* Informations for the image cropping */
	this._cropWidth = 0;
	this._cropHeight = 0;
	this._cropX = 0;
	this._cropY = 0;

};


ImageService.prototype = {

	load : function(path,success){
		
		var t = this;
		easyimg.info(path).then(
	      function(file) {

			
	        t._file = file;
	        t._finalHeight = file.height;
	        t._finalWidth = file.width;
	        t._cropWidth = file.width;
			t._cropHeight = file.height;

	        console.log("load imageservice2");
	        console.log(t);
	        if (typeof success == 'function') { success(); }
	        
	        

	      }, function (err) {
	        console.log(err);//TODO : handle that in html
	      }
	    );
	},

	setFinalWidth : function(width){

	},
	getFinalWidth : function(){
		return this._finalWidth;
	},

	setFinalHeight : function(height){

	},
	getFinalHeight : function(){
		return this._finalHeight;
	},

	getCropHeight : function(){
		return this._cropHeight;
	},
	setCropHeight : function(cHeight){

	},
	getCropWidth : function(){
		return this._cropWidth;
	},
	setCropWidth : function(cWidth){

	},
	getCropX : function(){
		return this._cropX;
	},
	setCropX : function(cX){

	},
	getCropY : function(){
		return this._cropY;
	},
	setCropY : function(cY){

	},

	/* resize and crop the image */
	rescrop : function(){

		if(this._file.path == "") return;//nothing to work on

		var extensionPosition = this._file.path.lastIndexOf(".");
		var pathMinusExtension = this._file.path.slice(0,extensionPosition);
		var extension = this._file.path.slice(extensionPosition);
		var destination = pathMinusExtension + "_resized_" + Math.floor(Date.now() / 1000) + extension;

		var options = {
			src : this._file.path,
			dst : destination,
			width : this._finalWidth,
			height : this._finalHeight,
			cropwidth : this._cropWidth,
			cropheight : this._cropHeight,
			x : this._cropX,
			y : this._cropY
		};

		easyimg.rescrop(options).then(
	  		function(image) {
	     		console.log('Resized and cropped: ' + image.width + ' x ' + image.height + "  " + destination);
	  		},
	  		function (err) {
	    		console.log(err);
	  		}
		);	
	}

};