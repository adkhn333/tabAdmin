adminApp.directive('fileModel', ['$parse', function ($parse) {
  return {
   restrict: 'A',
   link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);
adminApp.controller('companyContentCtrl' , ['$scope','$timeout','$http','$mdToast',
 function($scope, $timeout,$http,$mdToast){
  $scope.isLoading = false;
  $scope.allCompany = [];
  firebase.database().ref('marketing/company/registration').on('value', function(snapshot){
    $timeout(function(){
       $scope.allCompany= snapshot.val();
       console.log($scope.allCompany);  
    },50);
  });

  CKEDITOR.replace( 'editor' );
 //this function retrieve file details
  $scope.getFileDetails = function (e) {
    $scope.files = [];
    $scope.$apply(function () {
      for (var i = 0; i < e.files.length; i++) {
        $scope.files.push(e.files[i])
      }
    });
  };
  $scope.show= false;//if true then "image uploaded successfully!!" msg will be displayed
  $scope.imageNames = [];
  $scope.sizes=[];
  $scope.size_url=[];

  //this function upload images in CDN 
  $scope.upload = function(){ 
    $scope.isLoading = true;
    $scope.progressStatus=60;

    $scope.show ="";
    for (var i=0; i<$scope.files.length;++i){
      $scope.imageNames.push($scope.files[i].name);
      fd = new FormData();
      fd.append("uploadedFile", $scope.files[i]);
      $http.post('http://139.162.3.205/api/uploadImage', fd,{
        transformRequest: angular.identity,
        headers: { 'Content-Type' : undefined},
        params : {
          path : 'vendorApp',
          size : '100%'
        }

      })
      .success(function(result){

        $scope.isLoading = false;
        $scope.progressStatus=0;
        console.log(result);
        $scope.size_url.push(result.URLs);
        $scope.show=true;
        $scope.message = "image uploaded successfully!!";
      })
      .error(function(err){
        console.log(err.message);
      });
    }
  }
// this function update companyId, title, description and imgaeUrl as recieved from CDN in firebase database 
  $scope.uploadLinks = function(companyId,title){
    var description = CKEDITOR.instances.editor.getData();
    //console.log(companyId, title, description);
    for(var i=0; i < $scope.imageNames.length; i++){
      for(var key in $scope.size_url[i]){
        var imageLink = $scope.size_url[i][key] ;
        console.log(imageLink.imageUrl);
        var postData = {
          companyId : companyId,
          title : title,
          description : description,
          imageLink : imageLink.imageUrl
        }
        console.log("hello");
        firebase.database().ref('marketing/company/content/'+companyId+'/companyId').set(companyId);
        firebase.database().ref('marketing/company/content/'+companyId+'/title').set(title);
        firebase.database().ref('marketing/company/content/'+companyId+'/description').set(description);
        firebase.database().ref('marketing/company/content/'+companyId+'/imageLink').set(imageLink.imageUrl);
        console.log("content updated");
         var toast = $mdToast.simple()
          .textContent('Data Updated Successfully')
          .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
          .position("bottom");
        $mdToast.show(toast);
         $scope.dataVal={};
        CKEDITOR.instances.editor.setData("");
        $scope.message="";
      }
    }  
    //thes are set to null so that same data will not be displayed after one successful image submission

  } 
}]);