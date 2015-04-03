(function(){



var app = angular.module("workbench", []);


app.controller("WorkBenchController", ['$rootScope','$scope', function($rootScope,$scope) {

	this.imgElement = $('#workbench-img');
	this.mask =  $('#workbench-mask');
	this.zoom = 1;
	
	
	var t = this;
	$rootScope.$on("toolkit_imgload",function(event,data){
		if(data.path != null) t.loadImage(data.path);

	});
	$rootScope.$on("toolkit_change",function(event,data){
		t.makeChanges(data);
	});


	this.loadImage = function(url) {
		var elem = this.imgElement[0];
		elem.src = url;
		//elem.offsetX = elem.offsetParent.
		var t = this;
		this.imgElement.on("load", function(){
			/*$(this).position({
				left : 0,
				top : 0
			});*/

			t.initMask();
		});
	}

	this.initMask = function(){
		var mask = this.mask;

		mask.width(100);
		mask.height(100);

		var t = this;
		mask.draggable({
			containment : this.imgElement,
			scroll : true,
			stop : function( event, ui ) {
				t.notifyChanges({
					cropX : ui.position.left,
					cropY : ui.position.top
				});
			}
		});
		mask.resizable({
			containment : this.imgElement,
			stop: function( event, ui ) {
				t.notifyChanges({
					cropWidth : ui.size.width,
					cropHeight : ui.size.height
				});

			}
		});

		this.notifyChanges({
			cropWidth : mask.width(),
			cropHeight : mask.height()
		});
	};

	this.notifyChanges = function(changes) {
		/* remove zoom */
		if(changes.cropWidth != null) changes.cropWidth = parseInt(changes.cropWidth / this.zoom) ;
		if(changes.cropHeight != null) changes.cropHeight = parseInt(changes.cropHeight / this.zoom);
		if(changes.cropX != null) changes.cropX = parseInt(changes.cropX / this.zoom);
		if(changes.cropY != null) changes.cropY = parseInt(changes.cropY / this.zoom);

		$rootScope.$broadcast("workbench_change",changes);
	};

	/* Very important : make sure to always use this function to set data on workbench to avoid zoom issues*/
	this.makeChanges = function(infos) {

		if(infos.width !== null){
			var imgw = infos.width * this.zoom;
			this.imgElement.width(imgw);
		}
		if(infos.height !== null){
			var imgh = infos.height * this.zoom;
			this.imgElement.height(imgh);
		}
		if(infos.cropX != null){
			var leftPos = ( infos.cropX * this.zoom) + "px";
			this.mask.css({left : leftPos});
		}
		if(infos.cropY != null){
			var topPos = ( infos.cropY * this.zoom) + "px";
			this.mask.css({top : topPos});
		}
		if(infos.cropWidth != null){
			var cw = infos.cropWidth * this.zoom;
			this.mask.width(cw);
		}
		if(infos.cropHeight != null){
			var ch = infos.cropHeight * this.zoom;
			this.mask.height(ch);
		}
	}

	this.zoomIn = function() {
		this.setZoom(this.zoom + 0.1);
	};

	this.zoomOut = function(){
		this.setZoom(this.zoom - 0.1);
	};

	this.setZoom = function(zoom){
		if(zoom <= 0.1) return;

		var mask = this.mask;
		var image = this.imgElement;

		var imgOldWidth = image.width() / this.zoom;
		var imgOldHeight = image.height() / this.zoom;
		var maskOldCropX = (parseInt(mask.css("left"))) / this.zoom;
		var maskOldCropY = (parseInt(mask.css("top"))) / this.zoom;
		var maskOldCropWidth = mask.width() / this.zoom;
		var maskOldCropHeight = mask.height() / this.zoom;

		this.zoom = zoom;

		/* Always use makeChanges() to set data on workebench */
		var changes = {
			cropHeight : maskOldCropHeight,
			cropWidth : maskOldCropWidth,
			cropY : maskOldCropY,
			cropX : maskOldCropX,
			width : imgOldWidth,
			height : imgOldHeight 
		};

		this.makeChanges(changes);
	}
}]);

})();