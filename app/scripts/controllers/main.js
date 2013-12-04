'use strict';

angular.module('provinceApp').controller('MainCtrl', function ($rootScope, $scope, $window, State, GoogleClient, GoogleRealtime, appConfig, ClientId, $log, PeerConnections, ClientListUtils) {

  $scope.state = State;
  $scope.googleClientId = appConfig.googleClientId;

  var clientId = ClientId.get();

  GoogleClient.addScript();

  var peerConnection;

  $log.debug('clientId:', clientId);

  $rootScope.$on('signedIn', function() {
    $log.debug('signed in');
    GoogleRealtime.addScript();
  });

  $rootScope.$on('realtimeLoaded', function(event, clients) {
    
    $log.debug('realtimeLoaded: ', clients.toString());

    peerConnection = PeerConnections.create();

    if (ClientListUtils.amIOnTheList(clientId, clients)) {
      ClientListUtils.notifyAboutReload(clientId, clients);
    } else {
      clients.push(ClientListUtils.buildClientData(clientId));
    }

    $log.debug('peerConnection created: ', peerConnection);

  });

  $rootScope.$on('realtimeValueChanged', function(event, clients) {

    $log.debug('realtimeValueChanged: ', clients.toString());

    if (ClientListUtils.anyOffersPendingForMe(clientId, clients)) {
      $log.debug('answer to offer');
    } else {
      $log.debug('create offer');
    }

  });

});