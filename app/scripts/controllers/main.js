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

    dc.onmessage = function (event) {
        alert("Server: " + event.data);
    };

    dc.onopen = function () {
        channel.send("Hello Server!");
    };

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  //var getUserMedia = navigator.mozGetUserMedia.bind(navigator);


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $rootScope.$on('signedIn', function() {
      GoogleRealtime.addScript();
  });

  $rootScope.$on('realtimeLoaded', function(event) {

    navigator.getUserMedia({'audio': true, fake: true}, function (stream) {

      console.log("Got local audio", stream);
      pc.addStream(stream);

        // Create offer and send it to drive
        pc.offer(offerConstraints, function(blank, offer) {
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

        /*pc.handleOffer(offer);
        

        setTimeout(function() {
          $log.debug(pc.pc);
        }, 1000);*/

        //pc.handleOffer(offer);
        
          pc.answer(offer, offerConstraints, function(blank, answer) {
            $log.debug('answer callback')
            $log.debug(blank)
            $log.debug(answer)
          });
        


      }
    }

    
  });

  // Ip.addScript();

  /*pc.ondatachannel = function(event) {
    receiveChannel = event.channel;
    receiveChannel.onmessage = function(event){
      console.log(event)
    };
  };*/

  pc.on('ice', function (candidate) {



   // $log.debug(JSON.stringify(candidate))

    /*var array = JSON.parse(GoogleRealtime.map.get(clientKey)) || []
    var candidateString = JSON.stringify(candidate);
    if (array.indexOf(candidateString) === -1) {
      array.push(candidateString);
    }


    GoogleRealtime.map.set(clientKey, JSON.stringify(array));*/
    //pc.processIce(candidate)
    //connection.send('ice', candidate);
  })

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