'use strict';

angular.module('provinceApp').controller('MainCtrl', function ($rootScope, $scope, State, GoogleClient, GoogleRealtime, appConfig) {
	
  $scope.state = State;
  $scope.googleClientId = appConfig.googleClientId;

  $rootScope.$on('signedIn', function() {
    GoogleRealtime.addScript();
  });

  $rootScope.$on('clientsChanged', function(event, list) {
    console.log(list)
  });

	GoogleClient.addScript();

});