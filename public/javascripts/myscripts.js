var albumListApp = angular.module('albumList', []);

albumListApp.controller('albumListController', function($scope, $http){
	$scope.albums=null;

	$scope.getAlbums=function(){
		$http.get("/cookie").then(function(response){	// get _id of the logged-in user from Cookie 
			$scope.cookie=response.data;
		})
		$http.get("/init").then(function(response){
			if (response.data==='') {
				$scope.notLoggedIn=true;
				$scope.loginFailure=false;
				$scope.isLoggedIn=false;
				$scope.albums=null;
			} else {
				$scope.isLoggedIn=true;
				$scope.loginFailure=false;
				$scope.notLoggedIn=false;
				var i=0;
				while(response.data[i]._id!=$scope.cookie) {	// check with Cookie to see which user has logged in
					i++;
				}
				$scope.helloUser=response.data[i].username;
				$scope.helloUserId=i;
				$scope.albums=response.data;
			}
		}, function(response){
			alert("Error getting response."); 
		});
	}

	$scope.user = {username:"", password:""};
	$scope.login = function(user){ 
		if ($scope.user.username!="" && $scope.user.password!=""){
			$http.post("/login", user).then(function(response){
				if(response.data==='Login failure'){
					$scope.loginFailure=true;
					$scope.notLoggedIn=true;
					$scope.isLoggedIn=false;
					$scope.user = {username:"", password:""};
					$scope.albums=null;
				} else {
					$scope.isLoggedIn=true;
					$scope.loginFailure=false;
					$scope.notLoggedIn=false;
					var i=0;
					while(response.data[i].username!=user.username) {	// check with Input value to see which user has logged in
						i++;
					}
					$scope.helloUser=response.data[i].username;
					$scope.helloUserId=i;
					$scope.albums=response.data;
				}
			}, function(response){ 
				alert("Error logging in.");
			}); 
		} else {
			alert("You must enter username and password");
		}
	};

	$scope.logout = function(){
		$http.get("/logout").then(function(response){
			if (response.data==='') {
				$scope.notLoggedIn=true;
				$scope.loginFailure=false;
				$scope.isLoggedIn=false;
				$scope.user = {username:"", password:""};
				$scope.albums=null;
				$scope.albumIsChosen=false;
				$scope.myAlbumIsChosen=false;
				$scope.selected=null;
			} 
		}, function(response){
			alert("Error getting response."); 
		});
	}

	$scope.selected=null;
	$scope.displayAlbum = function(album){
		if (album.username===$scope.helloUser) {
			$http.get("/getalbum/0").then(function(response){
				if (response.data!=null) {
					$scope.albumIsChosen=true;
					$scope.myAlbumIsChosen=true;
					$scope.photos=response.data;
					$scope.selected=album._id;
				} else {
					$scope.albumIsChosen=false;
					$scope.myAlbumIsChosen=false;
					$scope.photos=null;
					$scope.selected='-1';
				}
			}, function(response){
				alert("Error getting response."); 
			});
		} else {
			var url = "/getalbum/" + album._id;
			$http.get(url).then(function(response){
				if (response.data!=null) {
					$scope.albumIsChosen=true;
					$scope.myAlbumIsChosen=false;
					$scope.photos=response.data;
					$scope.selected=album._id;
				} else {
					$scope.albumIsChosen=false;
					$scope.myAlbumIsChosen=false;
					$scope.photos=null;
					$scope.selected='-1';
				}
			}, function(response){
				alert("Error getting response."); 
			});
		}
	}

	$scope.uploadPhoto = function(){
		var x = document.getElementById("myFile");
		if (x.files.length>0) {
			$http.post("/uploadphoto", x.files).then(function(response){
				if(response.data!=''){
					$scope.getAlbums();
					for (var i=0; i<$scope.albums.length; i++) {
						if ($scope.albums[i]._id==$scope.selected) {
							$scope.displayAlbum($scope.albums[i]);
						}
					}
				} else {
					alert("Error uploading photo.");
				}
			}, function(response){ 
				alert("Error getting response.");
			}); 
		}
	}

	$scope.deletePhoto = function(ID) {
		var r = confirm("Are you sure you want to delete this photo?");
		if (r==true) {
			var url = "/deletephoto/"+ID;
			$http.delete(url).then(function(response){
				if(response.data.msg==''){
					$scope.getAlbums();
					for (var i=0; i<$scope.albums.length; i++) {
						if ($scope.albums[i]._id==$scope.selected) {
							$scope.displayAlbum($scope.albums[i]);
						}
					}
				} else {
					alert("Error deleting photo.");
				}
			}, function(response){ 
				alert("Error getting response.");
			}); 

		}
	}

	$scope.likePhoto = function(ID){
		var url = "/updatelike/" + ID;
		$http.put(url).then(function(response){
			if(response.data!=''){
				$scope.getAlbums();
				for (var i=0; i<$scope.albums.length; i++) {
					if ($scope.albums[i]._id==$scope.selected) {
						$scope.displayAlbum($scope.albums[i]);
					}
				}
			} else {
				alert("Error liking photo.");
			}
		}, function(response){ 
			alert("Error getting response.");
		});
	}

	$scope.enlarge = function(ID){
		$scope.clicked=ID;
	}

	$scope.closeX = function(){
		$scope.clicked=null;
		$scope.getAlbums();
		for (var i=0; i<$scope.albums.length; i++) {
			if ($scope.albums[i]._id==$scope.selected) {
				$scope.displayAlbum($scope.albums[i]);
			}
		}
	}

})