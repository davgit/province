'use strict';

angular.module('provinceApp').controller('MainCtrl', function ($scope, State, GoogleSignIn, GoogleDrive, appConfig) {
	
  $scope.state = State;
  $scope.googleClientId = appConfig.googleClientId;

  $scope.$watch('state', function(a, b) {
    
    if (a === b) {
      return;
    }

    GoogleDrive.startRealtime()

    // ...

  }, true);

	GoogleSignIn.addScript();

});