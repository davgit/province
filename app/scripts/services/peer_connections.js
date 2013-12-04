'use strict';

angular.module('provinceApp').factory('PeerConnections', function($window) {

  var iceServers = {
    iceServers: []
  };

  /*var mediaConstraints = {
    optional: [],
    mandatory: {
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    }
  };*/

  var optionalRtpDataChannels = {
    optional: [{
      RtpDataChannels: true
    }]
  };

  /*var userMediaOptions = {
    video: false,
    audio: true,
    fake: true
  };*/

  var pc = {

    create: function() {
      return new $window.RTCPeerConnection(iceServers, optionalRtpDataChannels);
    }

  };

  return pc;

});