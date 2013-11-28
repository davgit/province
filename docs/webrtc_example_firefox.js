var iceServers = {
    iceServers: []
};

var mediaConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }
};

var offerer = new mozRTCPeerConnection(iceServers),
    answerer, answererDataChannel, offererDataChannel;

offererDataChannel = offerer.createDataChannel('channel', {});
offererDataChannel.binaryType = 'blob';
setChannelEvents(offererDataChannel, 'offerer');

navigator.mozGetUserMedia({
    audio: true,
    fake: true
}, function (stream) {
    offerer.addStream(stream);

    offerer.createOffer(function (sessionDescription) {
        offerer.setLocalDescription(sessionDescription);
        createAnswer(sessionDescription);
    }, null, mediaConstraints);

}, useless);

function createAnswer(offerSDP) {
    answerer = new mozRTCPeerConnection(iceServers);
    answerer.ondatachannel = function (event) {
        answererDataChannel = event.channel;
        answererDataChannel.binaryType = 'blob';
        setChannelEvents(answererDataChannel, 'answerer');
    };

    navigator.mozGetUserMedia({
        audio: true,
        fake: true
    }, function (stream) {

        answerer.addStream(stream);
        answerer.setRemoteDescription(offerSDP);

        answerer.createAnswer(function (sessionDescription) {
            answerer.setLocalDescription(sessionDescription);

            offerer.setRemoteDescription(sessionDescription);
        }, null, mediaConstraints);

    }, useless);
}

function setChannelEvents(channel, channelNameForConsoleOutput) {
    channel.onmessage = function (event) {
        console.debug(channelNameForConsoleOutput, 'received a message:', event.data);
    };
    channel.onopen = function () {
        channel.send('first text message over SCTP data ports');
    };
}

function useless() {}

