'use strict';

angular.module('provinceApp', ['ngRoute', 'ngSanitize']).config(function ($routeProvider) {
  
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  }).otherwise({
    redirectTo: '/'
  });

});

angular.module('provinceApp').constant('appConfig', {
  googleClientId: '100811943028-4d276pge4dnskrmtq2b9n7bfk52iqq2l'
});

// http://stackoverflow.com/questions/17159743/how-to-stop-google-sign-in-button-from-popping-up-the-message-welcome-back-yo
window.___gcfg = { isSignedOut: true };