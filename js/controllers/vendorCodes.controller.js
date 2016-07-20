adminApp.controller('vendorCodesCtrl', ['$scope','$timeout', function($scope,$timeout){
	//return all city name and city id 
    $scope.cities = [];
    firebase.database().ref('city').once('value', function(snapshot){
      angular.forEach(snapshot.val(),function(value){
        $timeout(function(){
          $scope.cities.push(value);
          console.log($scope.cities);
        },100)
      });
    })

	$scope.getVendorDetails = function(cityId){
		$scope.allVendors=[];
		vendorSnap=[];
		codeArray=[];
		var vendorObj={
			vendorId:'',
			vendorName:'',
			code:''
		};
		firebase.database().ref('vendor/'+cityId).once('value',function(snapshot){
			console.log(snapshot);
			vendorSnap=snapshot.val();
			console.log(vendorSnap);
			// vendorObj.vendorName = snapshot.val().vendorName;
			// console.log(vendorObj.vendorName);
		}).then(function(){
			angular.forEach(vendorSnap,function(value,key){
				console.log(key);
				vendorObj.vendorId = value.vendorId;
				vendorObj.vendorName = value.vendorName;
				console.log(vendorObj.vendorId,vendorObj.vendorName);
				firebase.database().ref('vendorTab/'+key).once('value',function(snapshot){
					console.log(snapshot.val());
					codeArray = snapshot.val();
					// console.log(snapshot.key);
					// vendorObj.code = snapshot.val().code;
					// console.log(vendorObj.code);
				}).then(function(){
					angular.forEach(codeArray,function(value,key){
						console.log(value);
						vendorObj.code = value.code;
						console.log(vendorObj.code);
						$timeout(function(){
							$scope.allVendors.push(vendorObj);
							console.log($scope.allVendors);
						},100);
					})
				});
			});
		})
	};
}]);