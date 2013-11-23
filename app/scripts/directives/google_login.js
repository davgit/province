angular.module('provinceApp').directive('googleLogin', function () {

    var signinCallback = function(authResult) {
        console.log(authResult)
        console.log('authResult')
        if (authResult['access_token']) {
          // Update the app to reflect a signed in user
          // Hide the sign-in button now that the user is authorized, for example:
          document.getElementById('signinButton').setAttribute('style', 'display: none');
          document.getElementById('signinStatus').setAttribute('style', 'display: block');
          console.log('access_token')
        } else if (authResult['error']) {
          // Update the app to reflect a signed out user
          // Possible error values:
          //   "user_signed_out" - User is signed-out
          //   "access_denied" - User denied access to your app
          //   "immediate_failed" - Could not automatically log in the user
          console.log('Sign-in state: ' + authResult['error']);
        }
      }

    var onLoadCallback = function() {

      sessionParams = {
        'client_id': '100811943028-4d276pge4dnskrmtq2b9n7bfk52iqq2l',
        'session_state': null
      };

      console.log(gapi.auth)
      state = gapi.auth.checkSessionState(sessionParams, function(status) {
        console.log(status)
      })
      console.log(state)
    }

    return {

      restrict: 'E',
      template: '<span></span>',
      replace: true,
      link: function (scope, element, attrs) {
        
        https://accounts.google.com/o/oauth2/auth?response_type=code%20token%20id_token%20gsession&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.login%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&request_visible_actions=http%3A%2F%2Fschemas.google.com%2FAddActivity&cookie_policy=single_host_origin&immediate=true&proxy=oauth2relay287139289&redirect_uri=postmessage&origin=http%3A%2F%2Flocalhost%3A9000&state=2092088881%7C0.2759850724&authuser=0
      /*
    class="g-signin"
    data-callback="signinCallback"
    data-clientid="CLIENT_ID"
    data-cookiepolicy="single_host_origin"
    data-requestvisibleactions="http://schemas.google.com/AddActivity"
    data-scope="https://www.googleapis.com/auth/plus.login">
      */
        attrs.$set('class', 'g-signin');
        attrs.$set('data-clientid', attrs['clientId'] + '.apps.googleusercontent.com');

        // Some default values, based on prior versions of this directive
        var defaults = {
          callback: this.signinCallback,
          cookiepolicy: 'single_host_origin',
          requestvisibleactions: 'http://schemas.google.com/AddActivity',
          scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
          width: 'wide'
        };

        // Provide default values if not explicitly set
        angular.forEach(Object.getOwnPropertyNames(defaults), function(propName) {
          if (!attrs.hasOwnProperty('data-' + propName)) {
            attrs.$set('data-' + propName, defaults[propName]);
          }
        });


      }
    };
  });