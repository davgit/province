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

  function setChannelEvents(channel, channelNameForConsoleOutput) {
      
    channel.onmessage = function (event) {
      console.debug(channelNameForConsoleOutput, 'received a message:', event.data);
    };

    channel.onopen = function () {
      channel.send('first text message over SCTP data ports');
    };
  }

  function fail(error) {
    console.error(error);
  }

  var offerer = new $window.RTCPeerConnection(iceServers, optionalRtpDataChannels), answerer, answererDataChannel;

  var offererDataChannel = offerer.createDataChannel('channel', { reliable: false });
  setChannelEvents(offererDataChannel, 'offerer');

  var offererIceCandidatesCache = [];

  // Only called in Chrome
  offerer.onicecandidate = function (event) {
    if (!event || !event.candidate) {
      return;
    }
    // onicecandidate bugs and is called before setRemoteDescription so we'll just cache the candidates for later use
    if (answerer) {
      offererIceCandidatesCache.push(event.candidate);
    }
  };

  $window.getUserMedia(userMediaOptions, function (stream) {

    offerer.addStream(stream);

    offerer.createOffer(function (sessionDescription) {
      offerer.setLocalDescription(sessionDescription);
      createAnswer(sessionDescription);
    }, null, mediaConstraints);

  }, fail);

  function createAnswer(offerSDP) {

    answerer = new $window.RTCPeerConnection(iceServers, optionalRtpDataChannels);

    answerer.ondatachannel = function (event) {
      answererDataChannel = event.channel;
      setChannelEvents(answererDataChannel, 'answerer');
    };

    // Only called in Chrome
    answerer.onicecandidate = function (event) {
      if (!event || !event.candidate) {
        return;
      }
      if (offerer) {
        offerer.addIceCandidate(event.candidate);
      }
    };

    $window.getUserMedia(userMediaOptions, function (stream) {

      answerer.addStream(stream);

      answerer.setRemoteDescription(offerSDP);

      answerer.createAnswer(function (sessionDescription) {
        answerer.setLocalDescription(sessionDescription);
        offerer.setRemoteDescription(sessionDescription);
      }, null, mediaConstraints);


      // It's now safe to call addIceCandidate in Chrome
      for (var index in offererIceCandidatesCache) {
        answerer.addIceCandidate(offererIceCandidatesCache[index]);
      }

    }, fail);
  }