'use strict';

// https://developers.google.com/+/web/signin/?hl=fi
// https://developers.google.com/+/web/api/javascript?hl=fi

angular.module('provinceApp').factory('GoogleSignIn', function($window, State, $rootScope, appConfig) {

	var google = {

		signInScriptLoadedCallback: function() {
      google.checkAndUpdateSignInState();
		},

    checkAndUpdateSignInState: function() {

      var sessionParams = {
        'client_id': appConfig.googleClientId,
        'session_state': null
      };

      gapi.auth.checkSessionState(sessionParams, function(status) {
        $rootScope.$apply(function() {
          State.signedIn = !status; // Docs say true == logged in but that's not what's happening...
        });
      });
    },

		addScript: function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/client:plusone.js?onload=signInScriptLoadedCallback';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
		},

    signInCallback: function(authResult) {
      google.checkAndUpdateSignInState();
    }
	};

	$window.signInScriptLoadedCallback = google.signInScriptLoadedCallback;
  $window.signInCallback = google.signInCallback;

	return google;
});