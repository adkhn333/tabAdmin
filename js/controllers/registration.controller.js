adminApp.controller('companyAppCtrl' , ['$scope','$mdToast' ,function($scope,$mdToast) {
  var companyId =  (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
  var activationDate = new Date().getTime();


  //return all city name and city id from city object in database
  $scope.cities = [];
  firebase.database().ref('city').once('value', function(snapshot){
    angular.forEach(snapshot.val(),function(value){
      $timeout(function() {
        $scope.cities.push(value);
        console.log($scope.cities);
      },100)
    });
  });

  // autocomplete for cityname
  $scope.getMatches = function(searchText) {
    return $scope.cities;
  }

  
  // $scope.hidd=false;
  // if($scope.mobileno<10 || $scope.mobileno>10 ){
  //   $scope.hidd=true;
  // }
  // else{
  //   $scope.hidd=false;  
  // }

  // enter company details in firebase database for for company registration
  $scope.data = {};
  $scope.companyRegistration = function(companyName,cityName,address,mobileNo,email) {
      var newCompKey = firebase.database().ref('/marketing/company/registration/').push().key;
      var postData = {
        companyId : newCompKey,	
        companyName : $scope.data.companyName,
        cityName : $scope.data.cityName,
        address : $scope.data.address,
        mobileNo : $scope.data.mobileNo,
        email : $scope.data.email,
        activationDate : activationDate
      };
      var updates = {};
      updates['/marketing/company/registration/' + newCompKey] = postData;
      firebase.database().ref().update(updates);
      $scope.data = {};
      //$scope.userForm.$setPristine()
      // form.$setPristine();
      $scope.companyRegistration.$error    = {};
      var toast = $mdToast
                  .simple()
                  .textContent('Data Updated Successfully')
                  .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                  .position("bottom");
      $mdToast.show(toast);
      console.log('company registered');
  };	
}]);

