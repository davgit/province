'use strict';

// https://developers.google.com/+/web/signin/?hl=fi
// https://developers.google.com/+/web/api/javascript?hl=fi

angular.module('provinceApp').factory('GoogleSignIn', function($window, State, $rootScope) {

  $window.___gcfg = {
    isSignedOut: true
  };

	var google = {

		addScript: function() {
      var po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/client:plusone.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
		},

    signInCallback: function(authResult) {

      if (authResult.error) {
        State.signedIn = false;
      } else if (authResult.access_token) { // jshint ignore:line
        State.signedIn = true;
        State.accessToken = authResult.access_token; // jshint ignore:line
      }

      $rootScope.$apply();
    }
	};

  $window.signInCallback = google.signInCallback;

	return google;
});