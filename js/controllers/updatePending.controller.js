adminApp.controller('updatePendingAppCtrl' , ['$scope','$timeout','$mdToast',
 function($scope,$timeout,$mdToast){
 
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

  //set cityId for getting vendors list
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
  

//get all tab's Id that are assigned to a partular vendor
$scope.getTabId = function(vendorId){
  console.log('new');
  $scope.allVendorsTabs = [];
  var vendorKey = vendorId;
  firebase.database().ref('/vendorTab/'+ vendorKey).once('value', function(snapshot){
    angular.forEach(snapshot.val(),function(value){
      $scope.allVendorsTabs.push(value);
    });
    $timeout(function(){
      console.log($scope.allVendorsTabs);
    },100)
  })
}
//this function first gets all pending objects and then checks if any impressions start date is today or not
 $scope.enterPending = function(tabId){
  var pendingArray=[];
  var currentDate = Math.floor(new Date().getTime()/1000);
  console.log(currentDate);
  firebase.database().ref('tabCampaign/'+tabId+'/'+'campaigns/pending').once('value', function(snapshot){  
    snapshot.forEach(function(value){
      console.log('hiii');
      var companyId = value.val().companyId;
      var debitId = value.val().debitId;
      console.log(companyId);
      console.log(debitId);
      firebase.database().ref('impressionDebitted/'+companyId+'/'+debitId).once('value',function(snapshot){
        var startDate = snapshot.val().startDate;
        startDate = Math.floor(startDate/1000);
        var status = snapshot.val().status;
        console.log(startDate);
        console.log('1468564223');
        console.log(status);
        if(currentDate >= startDate){
          status = 'running';
          var updates = {};
          updates['impressionDebitted/'+companyId+'/'+debitId+'/status'] = status;
          firebase.database().ref().update(updates);
          console.log('status updated');
          $scope.updateCurrent(tabId,debitId,companyId);
        }else{
          $timeout(function(){
          $scope.message = "Start date is not today";
          console.log($scope.message);
          },100)
        }
      })
    })
  })
 } 
 $scope.updateCurrent = function(tabId,debitId,companyId){
  // particular object inside current object will be added first 
    var newcampaignkey = firebase.database().ref('/tabCampaign/' + tabId + '/campaigns/current').push().key;
    firebase.database().ref('/tabCampaign/' + tabId + '/campaigns/current/' + newcampaignkey).set({
      companyId : companyId,
      debitId : debitId
    })
    console.log("UpdatedCurrent");
    //then that particular object will be deleted from pending object
    firebase.database().ref('/tabCampaign/' + tabId + '/campaigns/pending').orderByChild('debitId').equalTo(debitId).on('child_added',function(snapshot){
      var key = snapshot.key;
      firebase.database().ref('/tabCampaign/' + tabId + '/campaigns/pending/'+key).remove();
    })
    $timeout(function(){
      $scope.message = "Updated Successfully";
      console.log($scope.message);
    },100)
  }
}]);

