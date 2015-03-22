(function(){



var app = angular.module("toolkit", []);

app.controller("ToolkitController", function() {
	
	this.imageService = new ImageService();

	this.keepRatio = true;//keep original ratio ?
	this.finalWidth = 0;
	this.finalHeight = 0;

	/* Informations for the image cropping */
	this.cropWidth = 0;
	this.cropHeight = 0;
	this.cropX = 0;
	this.cropY = 0;

	//triggered when input file change : 
	this.loadImage = function(e){
		var files = $(e)[0].files;
		if (files.length === 0 ) return;

		//getting image file infos :
		var t = this;


		this.imageService.load(files[0].path, function(){
			console.log("success !!!");
			//console.log(this);
			t.finalWidth = t.imageService.getFinalWidth();

			t.finalHeight = t.imageService.getFinalHeight();
			
			/* Informations for the image cropping */
			t.cropWidth = t.imageService.getCropWidth();
			t.cropHeight = t.imageService.getCropHeight();
			t.cropX = t.imageService.getCropX();
			t.cropY = t.imageService.getCropY();

			$('#finalWidth').val(t.finalWidth);
	        $('#finalHeight').val(t.finalHeight);
	        $('#cropWidth').val(t.finalWidth);
	        $('#cropHeight').val(t.finalHeight);


		});
		
	};

	/* Triggered when the width input change*/
	this.updateWidth = function(){
		if(this.keepRatio) {
			this.finalHeight = parseInt(this.file.height * this.finalWidth / this.file.width);
		}

	};

	/* Triggered when the height input change*/
	this.updateHeight = function(){
		if(this.keepRatio) {
			this.finalWidth = parseInt(this.file.width * this.finalHeight / this.file.height);
		}
	};


	/* lets resize and crop the image ! Go ! Go ! Go ! */
	this.go = function(){

		imageService.rescrop();
	}

});










})();