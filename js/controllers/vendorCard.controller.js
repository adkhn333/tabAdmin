adminApp.controller('vendorCardCtrl' , ['$scope','$timeout', function($scope,$timeout){

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

  $scope.totalTabImpression = 0;
  $scope.totalTabImpressionUsed=0;
  $scope.companyDetails=[];
  $scope.company=[];
  $scope.campaigns=[];
  $scope.tabImpressionAssigned=0;
  $scope.tabImpressionUsed=0;

  $scope.showImpressionDetails = function(vendorId,tabId){
    $scope.vendorId = vendorId;
    $scope.tabId = tabId;
    firebase.database().ref('/tabCampaign/' + tabId + '/campaigns').once('value',function(snapshot){
      console.log(snapshot.val());
      snapshot.forEach(function(value){
        value.forEach(function(data){
          var obj = {};
          obj= data.val();
          $scope.campaigns.push(obj);
        })
      })
      console.log($scope.campaigns);
      firebase.database().ref('/impressionDebitted').once("value",function(snapshot){
        $scope.impressionDebitted = snapshot.val();
        console.log( $scope.impressionDebitted);
      }).then(function(){
        angular.forEach($scope.campaigns, function(data){
          var currentCompanyId = data.companyId;
          var currentDebitId = data.debitId;
          var temp = $scope.impressionDebitted[currentCompanyId][currentDebitId].impressionAssigned;
          var tempUsed = $scope.impressionDebitted[currentCompanyId][currentDebitId].impressionUsed;
          // tempUsed = tempUsed[currentDebitId].impressionUsed;
          $timeout(function(){
            $scope.tabImpressionAssigned += temp;
            $scope.tabImpressionUsed += tempUsed; 
          },100);
        })
        firebase.database().ref('/marketing/company/registration/').once("value",function(snapshot){
           $scope.companyDetails = snapshot.val();
           console.log($scope.companyDetails);
        }).then(function(){
            angular.forEach($scope.campaigns, function(data){
              var details={
                Tab : '',
                companyName : '',
                impressionUsed: 0,
                impressionAssigned: 0,
                impBalance: 0,
                assignDate:'',
                status:''
              } 
              angular.forEach($scope.tabNames,function(data){
                console.log(data);
                if(tabId==data.tabId){
                  console.log(tabId);
                  details.Tab=data.name;
                }
              });

              var currentCompanyId = data.companyId;
              var currentDebitId = data.debitId;
              console.log($scope.companyDetails[currentCompanyId].companyName);
              details.companyName= $scope.companyDetails[currentCompanyId].companyName;

              details.impressionUsed = $scope.impressionDebitted[currentCompanyId][currentDebitId].impressionUsed;
              details.impressionAssigned = $scope.impressionDebitted[currentCompanyId][currentDebitId].impressionAssigned;
              details.impBalance = details.impressionAssigned - details.impressionUsed;
              details.assignDate= $scope.impressionDebitted[currentCompanyId][currentDebitId].assignDate;
              details.status= $scope.impressionDebitted[currentCompanyId][currentDebitId].status;

              $timeout(function(){
                $scope.company.push(details);         
              },100);
          })
        })
      });
     })
  };


  //get impression details for every tabId
  $scope.showAllDetails = function(vendorId){ 
    firebase.database().ref('/vendorTab/' + vendorId).on('child_added',function(snapshot){
      $scope.tabId = snapshot.val().tabId;
      console.log($scope.tabId);
      $scope.showImpressionDetails(vendorId,$scope.tabId);
    })
  };

  }]);