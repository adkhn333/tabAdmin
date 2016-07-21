adminApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('/', {
      url: "/",
      views : {
        "Assign Tab" : {
          templateUrl: "templates/vendorTab.html",
          controller:'vendorTabCtrl'
        }
      }
     
    })
    .state('impressions', {
      url: "/impressions",
      views : {
        "Impression":{
            templateUrl: "templates/impressions.html",
            controller:'impressionCtrl'
        }
      }
     
    })
    .state('register', {
      url: "/registration",
      views : {
        "Register Company" : {
             templateUrl: "templates/registration.html",
              controller:'companyAppCtrl'
        }
      }
    })
    .state('content', {
      url: "/content-provider",
      views : {
        "Content Provider" : {
            templateUrl: "templates/contentProvider.html",
            controller:'companyContentCtrl'
        }
      }
    })
    .state('detail-card', {
      url: "/details-card",
      views : {
        "Company Transaction Details" : {
          templateUrl: "templates/company-detail-card.html",
          controller:'cardsCtrl'
        }
      }
    })
    .state('vendor-card', {
      url: "/vendor-card",
      views : {
        "Vendor Transaction Details": {
          templateUrl: "templates/vendor-detail-card.html",
          controller:'vendorCardCtrl'
        }
      }
    })
    .state('pending', {
      url: "/pending-company",
      views : {
        "Pending Company" : {
          templateUrl: "templates/pending-company.html",
          controller:'updatePendingAppCtrl'
        }
      }
    })
    .state('get-codes', {
      url: "/get-codes",
      views : {
        "Get Vendor Codes" : {
          templateUrl: "templates/vendor-codes.html",
          controller:'vendorCodesCtrl'
        }
      }
    });
});