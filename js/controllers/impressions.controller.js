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
  };


    //impressions debited js

   //retrieve every company's data 
  $scope.allCompanies = [];
    firebase.database().ref('/marketing/company/registration/').on('value', function(snapshot){
    angular.forEach(snapshot.val(),function(value){
      $scope.allCompanies.push(value);
    });
    $timeout(function(){
      console.log($scope.allCompanies);
    },0)
  });

  // retrieve every vendor's name and id
  $scope.allVendors = [];
  firebase.database().ref('vendor').on('value', function(snapshot){
    angular.forEach(snapshot.val(),function(value){
      $scope.allVendors.push(value);
    });
    $timeout(function(){
      console.log($scope.allVendors);
    },100)
  });

  //get all tab's Id that are assigned to a partular vendor
  $scope.getTabId = function(vendorId){
    console.log(vendorId);
    $scope.allVendorsTabs = [];
    var vendorKey = vendorId;
    console.log(vendorKey);
    console.log("hii");
    firebase.database().ref('/vendorTab/'+ vendorKey).on('value', function(snapshot){
      angular.forEach(snapshot.val(),function(value){
        console.log(snapshot);
        $scope.allVendorsTabs.push(value);
      });
      $timeout(function(){
        console.log($scope.allVendorsTabs);
      },100)
    });
  };
  //assign impression details for particular company, vendor and tab 
  $scope.impressionAssign = function(vendorId,TabId,companyId,impressionAssigned,startDate,endDate){
    firebase.database().ref('/impressionCredits/' + companyId).orderByChild("compId").equalTo(companyId).on('child_added',function(snapshot){
      var creditId = snapshot.val().impressionCreditId;
      var impressionCredited = snapshot.val().impressionCredited;
      var validityDate = snapshot.val().validityDate;
      var assignDate = Math.round(new Date().getTime()/1000);
      var presentDate = Math.round(new Date().getTime()/1000);
      var roundedStartDate = Math.round(new Date(startDate).getTime()/1000);
      var roundedEndDate = Math.round(new Date(endDate).getTime()/1000);
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

      firebase.database().ref().child('/impressionDebbited/'+ companyId).once('value', function(s){
        console.log("enter1");
        if( s.val() != null ){
          firebase.database().ref('/impressionDebbited/'+ companyId).orderByChild("TabId").equalTo(TabId).on('child_added',function(snapshot){
           console.log('hiii n hello');
           $scope.companyImpressionAssigned=0;
           snapshot.forEach(function(data){
              var companyImpressionAssigned = data.val().impressionAssigned;
              $scope.companyImpressionAssigned+=companyImpressionAssigned;
            })
           $scope.companyImpressionAssigned+=impressionAssigned;
          })
        }else{
          console.log("hello else");
          $scope.companyImpressionAssigned=impressionAssigned; 
          console.log( $scope.companyImpressionAssigned);    
        }
        $scope.addImpression(creditId,vendorId,TabId,companyId,impressionAssigned,impressionCredited,assignDate,roundedStartDate,roundedEndDate,status,$scope.companyImpressionAssigned,validityDate);
      })
    })
  }
  // update impression details that are assigned in above function, in a database object
  $scope.addImpression = function(creditId,vendorId,TabId,companyId,impressionAssigned,impressionCredited,roundedStartDate,assignDate,roundedEndDate,status,companyImpressionAssigned,validityDate){
    if ((impressionCredited > companyImpressionAssigned)&&(assignDate < validityDate) ) {
      console.log( companyImpressionAssigned);
      var impressionUsed = 0;
      impressionAssignId = firebase.database().ref('/impressionDebitted').push().key;
      //console.log(impressionAssignId,vendorId,TabId,creditId,companyId,impressionAssigned,assignDate,roundedStartDate,roundedEndDate,impressionUsed,status);
      var postData = {
        impressionAssignId : impressionAssignId,
        vendorId : vendorId,
        TabId : TabId,
        creditId : creditId,
        companyId : companyId, 
        impressionAssigned : impressionAssigned,
        assignDate : assignDate,
        startDate : roundedStartDate,
        endDate : roundedEndDate,
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
    console.log(impressionAssignId);

    firebase.database().ref('impressionDebitted').on('child_added',function(snapshot){
            //searching for particular tabId 
        snapshot.forEach(function(data) {

        if((data.val().status == "running" && data.val().impressionAssignId == impressionAssignId)||
          (data.val().status == "pending" && data.val().impressionAssignId == impressionAssignId)) {
          
          $scope.debitId = data.val().impressionAssignId;
          $scope.companyId = data.val().companyId;
          $scope.TabId = data.val().TabId;

          var newcampaignkey = firebase.database().ref('/tabCampaign/' + $scope.TabId + '/campaigns/current').push({
            companyId : $scope.companyId,
            debitId : $scope.debitId
           }).key;
         firebase.database().ref('/tabCampaign/' + $scope.TabId + '/campaigns/current/' + newcampaignkey).set({
            companyId : $scope.companyId,
            debitId : $scope.debitId
          });
         var toast = $mdToast.simple()
          .textContent('Data Updated Successfully')
          .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
          .position("bottom");
        $mdToast.show(toast);
         console.log("UpdatedCurrent");


        }
        else{
          console.log('hii');
        }
      });
    });
  };

}]);