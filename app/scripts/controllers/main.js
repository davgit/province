'use strict';

angular.module('provinceApp').controller('MainCtrl', function ($rootScope, $scope, State, GoogleClient, GoogleRealtime, appConfig, Ip, $log) {
	
  $scope.state = State;
  $scope.googleClientId = appConfig.googleClientId;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var clientKey = cookie.get('clientKey');

  if (!clientKey) {
    clientKey = Math.random().toString(36).slice(2);
    cookie.set('clientKey', clientKey);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var iceServers = {
      iceServers: []
  };

  var mediaConstraints = {
      optional: [],
      mandatory: {
          OfferToReceiveAudio: false,
          OfferToReceiveVideo: false
      }
  };

  var optionalRtpDataChannels = {
      optional: [{
          RtpDataChannels: true
      }]
  };

  var userMediaOptions = {
    video: false,
    audio: true,
    fake: true
  };

  var offerer = new RTCPeerConnection(iceServers, optionalRtpDataChannels), answerer, answererDataChannel;

  var offererDataChannel = offerer.createDataChannel('channel', { reliable: false });
   
  setChannelEvents(offererDataChannel, 'offerer');

  var offererIceCandidatesCache = [];

  // Never called in Firefox
  offerer.onicecandidate = function (event) {
      if (!event || !event.candidate) return;
      // In Chrome onicecandidate is called before setRemoteDescription so we'll just cache the candidates for later use
      answerer && offererIceCandidatesCache.push(event.candidate);
  };

  getUserMedia(userMediaOptions, function (stream) {

      offerer.addStream(stream);

      offerer.createOffer(function (sessionDescription) {
          offerer.setLocalDescription(sessionDescription);
          createAnswer(sessionDescription);
      }, null, mediaConstraints);

  }, fail);

  function createAnswer(offerSDP) {

      answerer = new RTCPeerConnection(iceServers, optionalRtpDataChannels);

      answerer.ondatachannel = function (event) {
        answererDataChannel = event.channel;
        setChannelEvents(answererDataChannel, 'answerer');
      };

      getUserMedia(userMediaOptions, function (stream) {

          answerer.addStream(stream);

          // Never called in Firefox
          answerer.onicecandidate = function (event) {
              if (!event || !event.candidate) return;
              offerer && offerer.addIceCandidate(event.candidate);
          };

          answerer.setRemoteDescription(offerSDP);

          // It's now safe to call addIceCandidate in Chrome
          for (var index in offererIceCandidatesCache) {
            answerer.addIceCandidate(offererIceCandidatesCache[index]);
          }

          answerer.createAnswer(function (sessionDescription) {
              answerer.setLocalDescription(sessionDescription);
              offerer.setRemoteDescription(sessionDescription);
          }, null, mediaConstraints);

      }, fail);
  }

  function setChannelEvents(channel, channelNameForConsoleOutput) {
      
      channel.onmessage = function (event) {
          console.debug(channelNameForConsoleOutput, 'received a message:', event.data);
      };

      channel.onopen = function () {
          channel.send('first text message over SCTP data ports');
      };
  }

  function fail(error) {
    console.error(error)
  }

});