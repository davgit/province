'use strict';

angular.module('provinceApp').controller('MainCtrl', function ($rootScope, $scope, State, GoogleClient, GoogleRealtime, appConfig, Ip) {
	
  $scope.state = State;
  $scope.googleClientId = appConfig.googleClientId;

  $rootScope.$on('signedIn', function() {
    if (!State.publicIp) {
      $scope.ipCannotBeResolved = true;
    } else {
      GoogleRealtime.addScript();
    }
  });

  $rootScope.$on('clientsChanged', function(event, list) {
    console.log(list);
  });

  Ip.addScript();

	GoogleClient.addScript();

});