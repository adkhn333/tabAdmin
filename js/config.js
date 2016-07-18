adminApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('/', {
      url: "/",
      templateUrl: "templates/vendorTab.html",
      controller:'assignedVendorTabCtrl'
    })
    .state('impressions', {
      url: "/impressions",
      templateUrl: "templates/impressions.html",
      controller:'impressionCtrl'
    })
    .state('register', {
      url: "/registration",
      templateUrl: "templates/registration.html",
      controller:'companyAppCtrl'
    })
    .state('content', {
      url: "/content-provider",
      templateUrl: "templates/contentProvider.html",
      controller:'companyContentCtrl'
    })
    .state('detail-card', {
      url: "/details-card",
      templateUrl: "templates/company-detail-card.html",
      controller:'cardsCtrl'
    })
    .state('vendor-card', {
      url: "/vendor-card",
      templateUrl: "templates/vendor-detail-card.html",
      controller:'vendorCardCtrl'
    })
    .state('pending', {
      url: "/pending-company",
      templateUrl: "templates/pending-company.html",
      controller:'updatePendingAppCtrl'
    });
});