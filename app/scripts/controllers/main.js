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

  // this shit only works in chrome

  var PC = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

  var iceServers = {
      iceServers: [
      /*{
          url: 'stun:stun.l.google.com:19302'
      }*/
      ]
  };

  var optionalRtpDataChannels = {
      optional: [{
          RtpDataChannels: true
      }]
  };

  var offerer = new PC(iceServers, optionalRtpDataChannels),
      answerer, answererDataChannel;

  var offererDataChannel = offerer.createDataChannel('RTCDataChannel', {
      reliable: false
  });
  setChannelEvents(offererDataChannel, 'offerer');

  offerer.onicecandidate = function (event) {
      if (!event || !event.candidate) return;
      answerer && answerer.addIceCandidate(event.candidate);
      console.log('offerer onicecandidate')
  };

  var mediaConstraints = {
      optional: [],
      mandatory: {
          OfferToReceiveAudio: false, // Hmm!!
          OfferToReceiveVideo: false // Hmm!!
      }
  };

  offerer.createOffer(function (sessionDescription) {
      offerer.setLocalDescription(sessionDescription);
      createAnswer(sessionDescription);
  }, null, mediaConstraints);


  function createAnswer(offerSDP) {
      answerer = new PC(iceServers, optionalRtpDataChannels);
      answererDataChannel = answerer.createDataChannel('RTCDataChannel', {
          reliable: false
      });

      setChannelEvents(answererDataChannel, 'answerer');

      answerer.onicecandidate = function (event) {
          if (!event || !event.candidate) return;
          offerer && offerer.addIceCandidate(event.candidate);
          console.log('answerer onicecandidate')
      };

      answerer.setRemoteDescription(offerSDP);
      answerer.createAnswer(function (sessionDescription) {
          answerer.setLocalDescription(sessionDescription);
          offerer.setRemoteDescription(sessionDescription);
      }, null, mediaConstraints);
  }

  function setChannelEvents(channel, channelNameForConsoleOutput) {
    console.log(channelNameForConsoleOutput, 'setChannelEvents')
      channel.onmessage = function (event) {
          console.debug(channelNameForConsoleOutput, 'received a message:', event.data);
      };

      channel.onopen = function () {
          channel.send('first text message over RTP data ports');
      };
      channel.onclose = function (e) {
          console.error(e);
      };
      channel.onerror = function (e) {
          console.error(e);
      };
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 

  //GoogleClient.addScript();

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
  var connectionOptions = { 
    iceServers: []
  };

  var connectionConstraints = { 
    optional: [ 
      { RtpDataChannels: true }
    ] 
  };

  var offerConstraints = {
    mandatory: { 
      OfferToReceiveAudio: false,
      OfferToReceiveVideo: false
    }
  };

  var userMediaOptions = { 
    audio: true,
    fake: true
  }
  
  var pc1 = new PeerConnection(connectionOptions, connectionConstraints);
  var dc1 = pc1.createDataChannel('province');

  //dc1.onmessage = function (event) { console.log("PC1 onmessage: " + event.data); };
  //dc1.onopen = function () { channel.send("PC1 onopen"); };

  var pc2 = new PeerConnection(connectionOptions, connectionConstraints);
  //var dc2 = pc2.createDataChannel('province');
  //dc2.onmessage = function (event) { console.log("PC2 onmessage: " + event.data); };
  //dc2.onopen = function () { channel.send("PC2 onopen"); };

 pc1.on('ice', function (candidate) {
    //processIce(candidate);
    console.log('pc1 ice', candidate)
  });

  pc2.on('ice', function (candidate) {
    //processIce(candidate);
    console.log('pc2 ice', candidate)
  });


  pc2.ondatachannel = function (channel) {

    channel.onmessage = function (event) {
        alert("Client: " + event.data);
    };

    channel.onopen = function () {
        channel.send("Hello Client!");
    };
  };

  getUserMedia(userMediaOptions, function(error, stream) {
    if (error) {
    } else {
      console.log('got a stream: ', stream);
      pc1.addStream(stream);
      pc2.addStream(stream);

      pc1.offer(offerConstraints, function() {});
    }
  });

  pc1.on('streamAdded', function (stream) {
    console.log('steam added')
  });

  pc2.on('streamAdded', function (stream) {
    console.log('steam added')
  });

  pc1.on('offer', function (offer) {
    console.log('pc1 offer: ', offer)
    pc2.answer(offer, offerConstraints, function(foo, bar) {})
  });

  pc2.on('answer', function (answer) {
    console.log('inside answer', answer)
    console.log(dc1)

    
    var port1 = Date.now();
    var port2 = port1 + 1;

    pc1.connectDataConnection(port1, port2);
    pc2.connectDataConnection(port2, port1);
  });


 /*


        






/*
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  //var getUserMedia = navigator.mozGetUserMedia.bind(navigator);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $rootScope.$on('signedIn', function() {
      GoogleRealtime.addScript();
  });

  $rootScope.$on('realtimeLoaded', function(event) {

    navigator.getUserMedia({'audio': true, fake: true}, function (stream) {

      console.log("Got local audio", stream);
      addStream(stream);

        // Create offer and send it to drive
        offer(offerConstraints, function(blank, offer) {
          $log.debug('Offer created:');
          $log.debug(JSON.stringify(offer));
          GoogleRealtime.map.set(clientKey, btoa(JSON.stringify(offer)));
        })


    }, function () {});    
  });

  var processed = [];

  
  $rootScope.$on('realtimeValueChanged', function(event, map) {
    //map.clear()

    $log.debug('realtimeValueChanged:');
    $log.debug(map.toString());
    

    // Iterate all offers in realtime map and pick the ones that are not our own
    for (var index in map.keys()) {
      
      var key = map.keys()[index];
      var value = map.get(key);

      if (clientKey !== key) {

        if (processed.indexOf(key) !== -1) {
          return;
        }

        var offer = JSON.parse(atob(value));

        processed.push(key);

        handleOffer(offer);
        

        setTimeout(function() {
          $log.debug(pc);
        }, 1000);

        //handleOffer(offer);
        
          answer(offer, offerConstraints, function(blank, answer) {
            $log.debug('answer callback')
            $log.debug(blank)
            $log.debug(answer)
          });
        


      }
    }

    
  });

  // Ip.addScript();

  ondatachannel = function(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = function(event){
      console.log(event)
    };
  };

  on('ice', function (candidate) {



   // $log.debug(JSON.stringify(candidate))

    var array = JSON.parse(GoogleRealtime.map.get(clientKey)) || []
    var candidateString = JSON.stringify(candidate);
    if (array.indexOf(candidateString) === -1) {
      array.push(candidateString);
    }


    GoogleRealtime.map.set(clientKey, JSON.stringify(array));
    //processIce(candidate)
    //connection.send('ice', candidate);
  })

  //handleAnswer(answer);
  

  on('offer', function (offer) {

    console.log('offer created listener triggered');

    var remoteOffer = {"type":"offer","sdp":"v=0\r\no=Mozilla-SIPUA-25.0.1 75 0 IN IP4 0.0.0.0\r\ns=SIP Call\r\nt=0 0\r\na=ice-ufrag:f74b91d3\r\na=ice-pwd:109ff1a6e951cd14bc856c04e3e11a9e\r\na=fingerprint:sha-256 4F:CC:14:40:37:73:90:CF:55:87:D7:51:86:80:B2:E2:16:D5:61:F7:A2:FB:63:59:7F:40:3F:CD:09:33:3A:D0\r\nm=application 60344 DTLS/SCTP 5000 \r\nc=IN IP4 192.168.0.10\r\na=fmtp:5000 protocol=webrtc-datachannel;streams=16\r\na=sendrecv\r\na=candidate:0 1 UDP 2128609535 192.168.0.10 60344 typ host\r\na=candidate:0 2 UDP 2128609534 192.168.0.10 60345 typ host\r\n"} 

    answerBroadcastOnly(remoteOffer, function(foo) {
      console.log('answerBroadcastOnly')
      console.log(foo)

    })
  });*/

});