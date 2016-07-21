adminApp.controller('impressionCtrl' , ['$scope', '$timeout','$mdToast',
 function($scope, $timeout,$mdToast){

	var assignmentDate = new Date().getTime();	
  //get details of all the companies
	$scope.allCompany = [];
	firebase.database().ref('marketing/company/registration').on('value', function(snapshot){
		angular.forEach(snapshot.val(), function(value){
			$scope.allCompany= snapshot.val();
		})
		$timeout(function(){
			console.log($scope.allCompany);	
		},100);
	});
  // assign credits to the particular company along with companyId, creditId, validity date and assign date
  $scope.submitCredit = function(data,companyId){
    var validitydate = new Date(data.validityDate).getTime();
	  var newimpressionCreditkey = firebase.database().ref('/impressionCredits/companyId').push().key;
 	  var impressionCreditData = {
  	  impressionCreditId : newimpressionCreditkey,
      companyId : companyId,
      impressionCredited : data.impressionCredited,
      validityDate : validitydate,
      assignDate : assignmentDate
    };
  	var updates = {};
  	updates['/impressionCredits/' + companyId + '/' + newimpressionCreditkey] = impressionCreditData;
  	firebase.database().ref().update(updates);
    var toast = $mdToast.simple()
      .textContent('Data Updated Successfully')
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position("bottom");
    $mdToast.show(toast);
    console.log("Updated");
    $scope.dataVal={};
  };


    //impressions debited js

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
 //retrieve every company's data 
  $scope.allCompanies = [];
    firebase.database().ref('/marketing/company/registration/').on('value', function(snapshot){
    angular.forEach(snapshot.val(),function(value){
      $scope.allCompanies.push(value);
    });
    $timeout(function(){
      console.log($scope.allCompanies);
    },0)
  })
    //use cityId for getting vendors list
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
  

// fetch all tab ids for particular vendor
   $scope.getTabId = function(vendorId){
      $scope.tabNames=[];
      console.log(vendorId);
      $scope.allVendorsTabs = [];
      
      var vendorKey = vendorId;
      firebase.database().ref('/vendorTab/'+ vendorKey).on('value', function(snapshot){
        console.log('/vendorTab/'+ vendorKey);
        console.log(snapshot.val());
        angular.forEach(snapshot.val(),function(value){
          console.log(value.tabId);
         $scope.allVendorsTabs.push(value.tabId);
        });
        //console.log($scope.allVendorsTabs)
      tabLength = $scope.allVendorsTabs.length;
      //console.log(tabLength);
      i = 1;
      //give each tab a name(Tab) and no squentially and display it on frontend
      angular.forEach($scope.allVendorsTabs, function(data) {
          //console.log(data);
          var tabObj = {
            name: 'Tab '+i,
            tabId: data
          };
          $scope.tabNames.push(tabObj);
         // console.log($scope.tabNames);
          i++;
        });
      })
   };
$scope.startDate= new Date();
$scope.endDate= new Date();
//assign impression details for particular company, vendor and tab 
$scope.impressionAssign = function(vendorId,tabId,companyId,impressionAssigned,startDate,endDate){
  firebase.database().ref('/impressionCredits/' + companyId).orderByChild("companyId").equalTo(companyId).on('child_added',function(snapshot){
  var creditId = snapshot.val().impressionCreditId;
  var impressionCredited = snapshot.val().impressionCredited;
  var validityDate = snapshot.val().validityDate;
  var assignDate = new Date().getTime();
  var newStartDate = new Date(startDate).getTime();
  var newEndDate = new Date(endDate).getTime();
  var presentDate = Math.round(new Date().getTime()/1000);
  //use rounded dates to compare differnet days and time
  var roundedStartDate = Math.round(new Date(newStartDate).getTime()/1000);
  var roundedEndDate = Math.round(new Date(newEndDate).getTime()/1000);
  //set the status for impression(i.e. the images that will be shown in vendor tab),if status is pending than image/impression will be shown later when its start date arrives,
  //if status is running the image will be shown and if status is completed the image will not be shown for that particular impressionID  
  var status;  
  if(presentDate < roundedStartDate){
    status = 'pending';
  } else if((presentDate > roundedStartDate ||presentDate == roundedStartDate ) && presentDate < roundedEndDate){
    status = 'running';
  } else if(presentDate >roundedEndDate || presentDate == roundedEndDate){
    status = 'completed';
  } else {
    status = 'cancelled';
  }
//checks if impressionDebbited/companyId object exists or not
firebase.database().ref().child('/impressionDebbited/'+ companyId).once('value', function(s){
  if( s.val() != null ) 
  {
    firebase.database().ref('/impressionDebbited/'+ companyId).orderByChild("tabId").equalTo(tabId).on('child_added',function(snapshot){
     $scope.companyImpressionAssigned=0;
     snapshot.forEach(function(data){
        var companyImpressionAssigned = data.val().impressionAssigned;
        $scope.companyImpressionAssigned+=companyImpressionAssigned;
      })
     $scope.companyImpressionAssigned+=impressionAssigned;
    })
  }else{
    $scope.companyImpressionAssigned=impressionAssigned; 
  }
  $scope.addImpression(creditId,vendorId,tabId,companyId,impressionAssigned,impressionCredited,assignDate,newStartDate,newEndDate,status,$scope.companyImpressionAssigned,validityDate);
})
 })
}
// update impression details that are assigned in above function, in a database object
$scope.addImpression = function(creditId,vendorId,tabId,companyId,impressionAssigned,impressionCredited,assignDate,newStartDate,newEndDate,status,companyImpressionAssigned,validityDate){
  if ((impressionCredited > companyImpressionAssigned) ) {
    var impressionUsed = 0;
    impressionAssignId = firebase.database().ref('/impressionDebitted').push().key;
    var postData = {
      impressionAssignId : impressionAssignId,
      vendorId : vendorId,
      tabId : tabId,
      creditId : creditId,
      companyId : companyId, 
      impressionAssigned : impressionAssigned,
      assignDate : assignDate,
      startDate : newStartDate,
      endDate : newEndDate,
      impressionUsed : impressionUsed,
      status : status
    };
      var updates = {};
      updates['/impressionDebitted/' + companyId + '/' + impressionAssignId] = postData;
      firebase.database().ref().update(updates);
      $timeout(function(){
        $scope.updateCampaign(impressionAssignId);
      },100)
  } else{
    console.log('limit exceeded');
    $scope.message = "Either impressions credit limits exhausted or validity date expired";
  }
}

  // assign company Id and impressionAssignId as debitId in current key of tabCampaign object 
  $scope.updateCampaign = function(impressionAssignId){
  firebase.database().ref('impressionDebitted').on('child_added',function(snapshot){
          //searching for particular tabId 
      snapshot.forEach(function(data) {
      console.log(data.val().status);
      if((data.val().status == "running") && (data.val().impressionAssignId == impressionAssignId)){
          console.log('enter current');
        $scope.debitId = data.val().impressionAssignId;
        $scope.companyId = data.val().companyId;
        $scope.tabId = data.val().tabId;
        console.log($scope.debitId,$scope.companyId,$scope.tabId);

        var newcampaignkey = firebase.database().ref('/tabCampaign/' + $scope.tabId + '/campaigns/current').push({
          companyId : $scope.companyId,
          debitId : $scope.debitId
         }).key;
        
       firebase.database().ref('/tabCampaign/' + $scope.tabId + '/campaigns/current/' + newcampaignkey).set({
          companyId : $scope.companyId,
          debitId : $scope.debitId
        });
       var toast = $mdToast.simple()
      .textContent('Data Updated Successfully')
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position("bottom");
       $mdToast.show(toast);
       console.log("UpdatedCurrent");
           $scope.dataVal={};


      }else if((data.val().status == "pending") && (data.val().impressionAssignId == impressionAssignId)){
                  console.log('enter pending');
        $scope.debitId = data.val().impressionAssignId;
        $scope.companyId = data.val().companyId;
        $scope.tabId = data.val().tabId;
        var newcampaignkey = firebase.database().ref('/tabCampaign/' + $scope.tabId + '/campaigns/pending').push({
          companyId : $scope.companyId,
          debitId : $scope.debitId
         }).key;

       firebase.database().ref('/tabCampaign/' + $scope.tabId + '/campaigns/pending/' + newcampaignkey).set({
          companyId : $scope.companyId,
          debitId : $scope.debitId
        });
       var toast = $mdToast.simple()
      .textContent('Data Updated Successfully')
      .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
      .position("bottom");
      $mdToast.show(toast);
       console.log("UpdatedPending");
           $scope.dataVal={};
      }
      else{
        console.log('hii');
      }
    });
  });
  
  };

}]);