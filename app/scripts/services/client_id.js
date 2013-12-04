'use strict';

angular.module('provinceApp').factory('ClientId', function($window) {

  var id = {

    get: function() {
      var clientId = $window.cookie.get('clientId');

      if (!clientId) {
        clientId = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        $window.cookie.set('clientId', clientId);
      }

      return clientId;
    }

  };

  return id;

});