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
		//console.log(angular.element(e).scope());

		//getting image file infos :
		var t = this;
		easyimg.info(files[0].path).then(
	      function(file) {

	        t.file = file;
	        t.finalHeight = file.height;
	        t.finalWidth = file.width;
	        t.cropWidth = file.width;
			t.cropHeight = file.height;

	        /*$('#finalWidth').val(t.finalWidth);
	        $('#finalHeight').val(t.finalHeight);
	        $('#cropWidth').val(t.finalWidth);
	        $('#cropHeight').val(t.finalHeight);*/
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
		this.notifyUpdates();
	};

	/* Triggered when the height input change*/
	this.updateHeight = function(){
		if(this.keepRatio) {
			this.finalWidth = parseInt(this.file.width * this.finalHeight / this.file.height);
		}
		this.notifyUpdates();
	};

	this.updateCropX = function(){
		this.notifyUpdates();
	};
	this.updateCropY = function(){
		this.notifyUpdates();
	};
	this.updateCropWidth = function(){
		this.notifyUpdates();
	};
	this.updateCropHeight = function(){
		this.notifyUpdates();
	};

	this.notifyUpdates = function(){
		$rootScope.$broadcast("toolkit_change",{
			width : this.finalWidth,
			height : this.finalHeight,
			cropX : this.cropX,
			cropY : this.cropY,
			cropWidth : this.cropWidth,
			cropHeight : this.cropheight
		});
	};

	this.change = function(infos){
		//console.log('change!!');
		if(infos.x !== null){

		}
		if(infos.y !== null){
			
		}
		if(infos.width !== null){
			
		}
		if(infos.height !== null){
			
		}
		if(infos.cropX != null){
			//console.log("set cropX");
			//$('#cropX').val(infos.cropX);
			this.cropX = infos.cropX;
		}
		if(infos.cropY != null){
			//console.log("set cropY");
			//$('#cropY').val(infos.cropY);
			this.cropY = infos.cropY;
		}
		if(infos.cropWidth != null){
			//console.log("set cropWidth");
			//$('#cropWidth').val(infos.cropWidth);
			this.cropWidth = infos.cropWidth;
		}
		if(infos.cropHeight != null){
			//console.log("set cropHeight");
			//$('#cropHeight').val(infos.cropHeight);
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

		console.log(options);

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