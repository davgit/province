'use strict';

angular.module('provinceApp').controller('MainCtrl', function ($rootScope, $scope, State, GoogleClient, GoogleRealtime, appConfig, Ip) {
	
  $scope.state = State;
  $scope.googleClientId = appConfig.googleClientId;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var ua = navigator.userAgent.toLowerCase();
  var prefix = '';

  // basic sniffing
  if (ua.indexOf('firefox') !== -1) {
      prefix = 'moz';
  } else if (ua.indexOf('chrome') !== -1) {
      prefix = 'webkit';
  }

  GoogleClient.addScript();

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  
  var pc = new PeerConnection(connectionOptions, connectionConstraints);
  var dc = pc.createDataChannel('province');

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $rootScope.$on('signedIn', function() {
    //if (!State.publicIp) {
//      $scope.ipCannotBeResolved = true;
    //} else {
      GoogleRealtime.addScript();
  //  }
  });

  $rootScope.$on('clientsChanged', function(event, map) {
    console.log(map.toString());
  });

  $rootScope.$on('clientsLoaded', function(event) {

    pc.offer(offerConstraints, function(blank, offer) {
      console.log('local offer created')
      GoogleRealtime.map.set(prefix, JSON.stringify(offer));
    })
    
  });

  
  // Ip.addScript();

  console.log(pc)

  /*pc.ondatachannel = function(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = function(event){
      console.log(event)
    };
  };*/

  


  pc.on('ice', function (candidate) {
    //console.log('on ice')
    //console.log(candidate)
    //pc.processIce(candidate)
    //connection.send('ice', candidate);
  });
  


  

  //pc.handleAnswer(answer);
  

  /*pc.on('offer', function (offer) {

    console.log('offer created listener triggered');

    var remoteOffer = {"type":"offer","sdp":"v=0\r\no=Mozilla-SIPUA-25.0.1 75 0 IN IP4 0.0.0.0\r\ns=SIP Call\r\nt=0 0\r\na=ice-ufrag:f74b91d3\r\na=ice-pwd:109ff1a6e951cd14bc856c04e3e11a9e\r\na=fingerprint:sha-256 4F:CC:14:40:37:73:90:CF:55:87:D7:51:86:80:B2:E2:16:D5:61:F7:A2:FB:63:59:7F:40:3F:CD:09:33:3A:D0\r\nm=application 60344 DTLS/SCTP 5000 \r\nc=IN IP4 192.168.0.10\r\na=fmtp:5000 protocol=webrtc-datachannel;streams=16\r\na=sendrecv\r\na=candidate:0 1 UDP 2128609535 192.168.0.10 60344 typ host\r\na=candidate:0 2 UDP 2128609534 192.168.0.10 60345 typ host\r\n"} 

    pc.answerBroadcastOnly(remoteOffer, function(foo) {
      console.log('answerBroadcastOnly')
      console.log(foo)

    })
  });*/

});