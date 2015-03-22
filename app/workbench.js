(function(){



var app = angular.module("workbench", []);

var comService = new ComService();

app.controller("WorkBenchController", ['$rootScope','$scope', function($rootScope,$scope) {

	this.imgElement = $('#workbench-img');
	
	
	//console.log($rootScope);
	var t = this;
	$rootScope.$on("toolkit_imgload",function(event,data){
		//console.log("test"):
		if(data.path != null) t.loadImage(data.path);

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
		var mask = $('#workbench-mask');

		mask.width(100);
		mask.height(100);
		mask.draggable({
			//containment : $('#workbench-img')
			containment : this.imgElement,
			stop : function( event, ui ) {
				$rootScope.$broadcast("workbench_change",{
					cropX : ui.position.left,
					cropY : ui.position.top
				});
			}
		});
		mask.resizable({
			containment : this.imgElement,
			stop: function( event, ui ) {
				$rootScope.$broadcast("workbench_change",{
					cropWidth : ui.size.width,
					cropHeight : ui.size.height
				});

			}
		});

		$rootScope.$broadcast("workbench_change",{
			cropWidth : mask.width(),
			cropHeight : mask.height()
		});
	};

	

	//this.loadImage();
}]);




})();