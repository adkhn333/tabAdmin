var adminApp=angular.module('tabAdmin',['ngMaterial','ui.router','ngStorage']);
adminApp.controller("tabCtrl",['$scope','$localStorage',function($scope,$localStorage){
	$scope.selectedIndex=$localStorage.selectedIndex;
	$scope.tabs=[
		{
			link : "/",
			label : "Assign Tab",
			view : "Assign Tab"
		},
		{
			link : "impressions",
			label : "Impression",
			view : "Impression"
		},
		{
			link : "register",
			label : "Register Company",
			view : "Register Company"
		},
		{
			link : "content",
			label : "Content Provider",
			view : "Content Provider"
		},
		{
			link : "pending",
			label : "Pending Company",
			view : "Pending Company"
		},
		{
			link : "detail-card",
			label : "Company Transaction Details",
			view : "Company Transaction Details"
		},
		{
			link : "vendor-card",
			label : "Vendor Transaction Details",
			view : "Vendor Transaction Details"
		},
		{
			link : "get-codes",
			label : "Get Vendor Codes",
			view : "Get Vendor Codes"
		}
	];
	$scope.changeSelectedTab=function(index){
		$scope.selectedIndex=index;
		$localStorage.selectedIndex=index;
	}
}]);
