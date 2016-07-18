adminApp.controller('companyAppCtrl' , ['$scope','$mdToast' ,function($scope,$mdToast){

var companyId =  (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);
var activationDate = new Date().getTime();


$scope.cities=[
  {
    name:'Gurgaon',
    id:123
  }
];

$scope.hidd=false;
if($scope.mobileno<10 || $scope.mobileno>10 ){
  $scope.hidd=true;
}else{
  $scope.hidd=false;  
}
// enter company details in firebase database for for company registration
$scope.companyRegistration = function(companyName,cityName,address,mobileNo,email){
    
    var newCompKey = firebase.database().ref('/marketing/company/registration/').push().key;
    var postData = {
    companyId : newCompKey,	
    companyName : companyName,
    cityName : cityName,
    address : address,
    mobileNo : mobileNo,
    email : email,
    activationDate : activationDate
  };
      var updates = {};
      updates['/marketing/company/registration/' + newCompKey] = postData;
      firebase.database().ref().update(updates);
      var toast = $mdToast.simple()
          .textContent('Data Updated Successfully')
          .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
          .position("bottom");
        $mdToast.show(toast)
      console.log('company registered');
    };	
}]);

