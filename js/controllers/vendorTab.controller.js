adminApp.controller('vendorTabCtrl' , ['$scope','$timeout','$mdToast', 
  function($scope, $timeout,$mdToast){

 //return all city name and city id from city object in database
  $scope.cities = [];
  firebase.database().ref('city').once('value', function(snapshot){
    angular.forEach(snapshot.val(),function(value){
      $timeout(function(){
        $scope.cities.push(value);
        console.log($scope.cities);
      },100)
    });
  })

  //use cityId for getting vendors list within that particular cityId
  $scope.allVendors = [];
  $scope.setCityId = function(cityId){
   // $scope.cityId = cityId;
    console.log(cityId);
    // retrieve every vendor's name and id
    firebase.database().ref('vendor/'+cityId).once('value', function(snapshot){
      console.log(snapshot.val());
      angular.forEach(snapshot.val(),function(value){
         var vendorObj = {
          vendorId : value.vendorId,
          vendorName : value.vendorName,
        }
        $scope.allVendors.push(vendorObj);
        console.log($scope.allVendors);
      })  
    })
  }

// genrate a random 16 digit code for tabActivation
$scope.genrateCode = function(){
  console.log('hii');
   $scope.code = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
   console.log($scope.code);
 };

// assign a vendor an unique tab and an unique code for its activation 
$scope.updateTabList = function(code,vendorId){
    var newTabKey = firebase.database().ref('/vendorTab/vendorId').push().key;
    var vendorTabData = {
      tabId : newTabKey,
      vendorId : $scope.vendorId,
      code : code,
    };
    var updates = {};
    updates['/vendorTab/' + vendorId +'/' +newTabKey] = vendorTabData;
    firebase.database().ref().update(updates);
    var toast = $mdToast.simple()
      .textContent('Data Updated Successfully')
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position("bottom");
    $mdToast.show(toast);
    console.log("Updated");
    $scope.dataVal={};
  };
}]);