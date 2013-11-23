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