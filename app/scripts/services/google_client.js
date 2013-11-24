'use strict';

// https://developers.google.com/+/web/signin/?hl=fi
// https://developers.google.com/+/web/api/javascript?hl=fi
// https://developers.google.com/drive/auth/web-client

angular.module('provinceApp').factory('GoogleClient', function($window, State, $rootScope, appConfig, GoogleRealtime) {

	var google = {

    authScopes: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',

		addScript: function() {
      var po = document.createElement('script');
      po.type = 'text/javascript';
      po.async = true;
      po.src = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
		},

    handleClientLoad: function() {
      google.authorize(true);
    },

    handleAuthResult: function(authResult) {
      if (authResult) {
        State.signedIn = true;
        $rootScope.$emit('signedIn');
      } else {
        State.signedIn = false;
        google.authorize(false);
      }
      $rootScope.$apply();
    },

    authorize: function(immediate) {
      window.gapi.auth.authorize({'client_id': appConfig.googleClientId, 'scope': google.authScopes, 'immediate': immediate}, google.handleAuthResult);
    }
	};

  $window.handleClientLoad = google.handleClientLoad;

	return google;

});