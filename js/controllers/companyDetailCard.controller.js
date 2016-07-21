adminApp.controller('cardsCtrl' , ['$scope', '$timeout', function($scope, $timeout){
	$scope.allCompany = [];
	firebase.database().ref('marketing/company/registration').on('value', function(snapshot){
		angular.forEach(snapshot.val(), function(value){
			$scope.allCompany= snapshot.val();
		});
		$timeout(function(){
			console.log($scope.allCompany);  
		},100);
	});

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


	$scope.isDisabledCredit = false;
	$scope.isDisabledDebit = false;

	//get total credits assigned to the company
	// params : companyId(str) 
	$scope.creditDetails = function(companyId){
		$scope.isDisabledCredit = true;
		$scope.sumCredit = 0;
		firebase.database().ref('impressionCredits/'+ companyId).on('value', function(snapshot){
			snapshot.forEach(function(data){
				$timeout(function(){
					$scope.sumCredit = ($scope.sumCredit + data.val().impressionCredited);
					console.log($scope.sumCredit);
				},100);
			});
		});

	};

	// params : companyId(str) 
	//get total impressionAssigned and impressionUsed by company
	$scope.debitDetails = function(companyId){
		$scope.isDisabledDebit = true;
		$scope.sumDebit = 0;
		$scope.sumUsed = 0;
		firebase.database().ref('impressionDebitted/'+companyId).on('value', function(snapshot){
			snapshot.forEach(function(data){
				$timeout(function(){
					$scope.sumDebit = ($scope.sumDebit + data.val().impressionAssigned);
					$scope.sumUsed = ($scope.sumUsed + data.val().impressionUsed);
					console.log($scope.sumDebit);
				},100);
			});
		});
	};

	// params : companyId(str) ,cityId(str) 
	//get vendor name, impression used and assigned and date along a particular company
	$scope.dateInfo = function(companyId,cityId){
		$scope.dateobj = [];
		firebase.database().ref('impressionDebitted/'+companyId).on('value', function(snapshot){
			snapshot.forEach(function(data){
				var date1 = {
				date: "",
				vendorname: "",
				used: "",
				assigned: ""
				}

				var presentDate = data.val().assignDate;
				var theDate = new Date(presentDate);
				var dateString = theDate.toGMTString()
				date1.date = dateString;
				date1.used = data.val().impressionUsed;
				date1.assigned = data.val().impressionAssigned;

				var vendorId = data.val().vendorId;
				firebase.database().ref('vendor/' + cityId + '/'+vendorId).on('value', function(snapshot){
					date1.vendorname = snapshot.val().vendorName;
					console.log(date1.vendorname);
					$timeout(function(){
					  $scope.dateobj.push(date1);
					},100);
				});
			});
		});
	};

	// params : companyId(str),cityId(str) 
	$scope.VendorInfo = function(companyId,cityId){
		$scope.vendorobj = [];
		firebase.database().ref('impressionDebitted/'+companyId).on('value', function(snapshot){
			snapshot.forEach(function(data){
				var vendor1 = {
					vendorname: "",
					used: "",
					assigned: ""
				} 
				//calculating vendorId and vendorName     
				var vendorId = data.val().vendorId;
				var impUsed =  data.val().impressionUsed;
				var impAssigned = data.val().impressionAssigned;

				firebase.database().ref('vendor/'+cityId+'/'+vendorId).once('value', function(snapshot){
					console.log('vendor/'+cityId+'/'+vendorId);
					console.log(snapshot.val());
					var vendorName = snapshot.val().vendorName;       
					if($scope.vendorobj.length==0){
						vendor1.vendorname = vendorName;
						vendor1.used = impUsed;
						vendor1.assigned = impAssigned;
						$timeout(function(){
							$scope.vendorobj.push(vendor1);
						},100);
					}else{
						var f = 0;
						for(var i=0 ; i<($scope.vendorobj.length) ; i++){
							if($scope.vendorobj[i].vendorname == vendorName){
								f=1;
								$timeout(function(){
									$scope.vendorobj[i].used = $scope.vendorobj[i].used + impUsed;
									$scope.vendorobj[i].assigned = $scope.vendorobj[i].assigned + impAssigned;
								},100);
								break;
							};
						};
					};
					if(f==0){
						vendor1.vendorname = vendorName;
						vendor1.used = impUsed;
						vendor1.assigned = impAssigned;
						$timeout(function(){
							$scope.vendorobj.push(vendor1);
						},100);
					};
				});
			});    
		});

	};
}]);