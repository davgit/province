'use strict';

angular.module('provinceApp').factory('Ip', function($window, Utils, State) {

  var ip = {

    addScript: function() {
      Utils.addScript('http://smart-ip.net/geoip-json?callback=getPublicIp');
    },

    getPublicIp: function(data) {
      State.publicIp = data.host;
    }

  };

  $window.getPublicIp = ip.getPublicIp;

  return ip;

});