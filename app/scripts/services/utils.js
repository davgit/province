'use strict';

angular.module('provinceApp').factory('Utils', function() {

  var utils = {

    addScript: function(url) {
      var po = document.createElement('script');
      po.type = 'text/javascript';
      po.src = url;
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);      
    }
  };

  return utils;

});