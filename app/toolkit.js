(function(){



var app = angular.module("toolkit", []);

app.controller("ToolkitController", ['$rootScope', '$scope' , function($rootScope,$scope) {
	
	/* File info we'll retrieve with image magick*/
	this.file = {
		density: 0,
		depth: 0,
		height: 0,
		name: "",
		path: "",
		size: 0,
		type: "",
		width: 0
	};

	this.keepRatio = true;//keep original ratio ?
	this.finalWidth = 0;
	this.finalHeight = 0;

	/* Informations for the image cropping */
	this.cropWidth = 0;
	this.cropHeight = 0;
	this.cropX = 0;
	this.cropY = 0;


	var t  = this;
	$rootScope.$on("workbench_change",function(event,data){
		t.change(data);
	});


	//triggered when input file change : 
	this.loadImage = function(e){
		var files = $(e)[0].files;
		if (files.length === 0 ) return;

		//getting image file infos :
		var t = this;
		easyimg.info(files[0].path).then(
	      function(file) {

	        t.file = file;
	        t.finalHeight = file.height;
	        t.finalWidth = file.width;
	        t.cropWidth = file.width;
			t.cropHeight = file.height;

	        $rootScope.$broadcast("toolkit_imgload",{
	    		path : file.path
	    	});
	        $scope.$apply();


	      }, function (err) {
	        console.log(err);//TODO : handle that in html
	      }
	    );

	    
	};

	/* Triggered when the width input change*/
	this.updateWidth = function(){
		if(this.keepRatio) {
			this.finalHeight = parseInt(this.file.height * this.finalWidth / this.file.width);
		}
		this.updateAllMask(false);
		this.notifyUpdates();
	};

	/* Triggered when the height input change*/
	this.updateHeight = function(){
		if(this.keepRatio) {
			this.finalWidth = parseInt(this.file.width * this.finalHeight / this.file.height);
		}
		this.updateAllMask(false);
		this.notifyUpdates();
	};

	this.updateCropX = function(notify){
		var cxMax = this.finalWidth - this.cropWidth;
		if (this.cropX > cxMax) {
			if (cxMax >= 0)	this.cropX = cxMax;
			else this.cropX = 0;
		}
		if(notify !== false) this.notifyUpdates();
	};
	this.updateCropY = function(notify){
		var cyMax = this.finalHeight - this.cropHeight;
		if (this.cropY > cyMax) {
			if (cyMax >= 0) this.cropY = cyMax;
			else this.cropY = 0;
		};
		if(notify !== false) this.notifyUpdates();
	};
	this.updateCropWidth = function(notify){
		var cwMax = this.finalWidth - this.cropX;
		if( this.cropWidth > cwMax) {
			if (cwMax >= 0) this.cropWidth = cwMax;
			else this.cropWidth = 1;
		};
		if(notify !== false) this.notifyUpdates();
	};
	this.updateCropHeight = function(notify){
		var chMax = this.finalHeight - this.cropY;
		if( this.cropHeight > chMax) {
			if (chMax >= 0) this.cropHeight = chMax;
			else this.cropHeight = 1;
		};
		if(notify !== false) this.notifyUpdates();
	};

	this.updateAllMask = function(notify) {
		this.updateCropX(notify);
		this.updateCropY(notify);
		this.updateCropWidth(notify);
		this.updateCropHeight(notify);
	};

	this.notifyUpdates = function(){
		$rootScope.$broadcast("toolkit_change",{
			width : this.finalWidth,
			height : this.finalHeight,
			cropX : this.cropX,
			cropY : this.cropY,
			cropWidth : this.cropWidth,
			cropHeight : this.cropHeight
		});
	};

	this.change = function(infos){
		if(infos.cropX != null){
			this.cropX = infos.cropX;
		}
		if(infos.cropY != null){
			this.cropY = infos.cropY;
		}
		if(infos.cropWidth != null){
			this.cropWidth = infos.cropWidth;
		}
		if(infos.cropHeight != null){
			this.cropHeight = infos.cropHeight;
		}
		$scope.$apply();
	}


	/* lets resize and crop the image ! Go ! Go ! Go ! */
	this.go = function(){

		if(this.file.path == "") return;//nothing to work on

		var extensionPosition = this.file.path.lastIndexOf(".");
		var pathMinusExtension = this.file.path.slice(0,extensionPosition);
		var extension = this.file.path.slice(extensionPosition);
		var destination = pathMinusExtension + "_resized_" + Math.floor(Date.now() / 1000) + extension;

		var options = {
			src : this.file.path,
			dst : destination,
			width : this.finalWidth,
			height : this.finalHeight,
			cropwidth : this.cropWidth,
			cropheight : this.cropHeight,
			x : this.cropX,
			y : this.cropY,
			gravity : "NorthWest"
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

}]);


})();