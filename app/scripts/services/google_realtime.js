'use strict';

// https://developers.google.com/drive/quickstart-js
// https://developers.google.com/drive/realtime/realtime-quickstart

angular.module('provinceApp').factory('GoogleRealtime', function($window, State, $rootScope, appConfig, Utils) {

  var realtime = {

    fileName: 'provinceClients',
    fileMimeType: 'application/vnd.google-apps.drive-sdk',
    fileId: '0B9bg9aXL_oUWRmUtd1BHaFZndkU',
    collaborativeMapName: 'data',

    map: null,

    shouldCreateNewRealtimeFile: false, // Only for dev purposes

    addScript: function() {
      Utils.addScript('https://apis.google.com/js/api.js?onload=handleApiLoad');
    },

    handleApiLoad: function() {
      $window.gapi.load('auth:client,drive-realtime,drive-share', function() {
        $window.gapi.client.load('drive', 'v2', function() {
          realtime.handleDriveApiLoad();
        });
      });

    },

    handleDriveApiLoad: function() {

      if (realtime.shouldCreateNewRealtimeFile) {
        realtime.fileId = realtime.createNewRealtimeFile();
      }

      $window.gapi.drive.realtime.load(realtime.fileId, realtime.handleModelLoad);

    },

    // getRoot() returns https://developers.google.com/drive/realtime/reference/gapi.drive.realtime.CollaborativeMap
    // get('xy') returns https://developers.google.com/drive/realtime/reference/gapi.drive.realtime.CollaborativeMap
    handleModelLoad: function(model) {

      console.log('model')
      console.log(model)

      var map = realtime.map = model.getModel().getRoot().get(realtime.collaborativeMapName);

      map.addEventListener($window.gapi.drive.realtime.EventType.VALUE_CHANGED, function() {
        $rootScope.$emit('clientsChanged', map.items());
      });

      /*if (list.indexOf(State.publicIp) === -1) {
        list.push(State.publicIp);
      }*/

      console.log('loaded clients: ' + map.toString());

      $rootScope.$emit('clientsLoaded');
    },

    createNewRealtimeFile: function() {
      $window.gapi.client.drive.files.insert({'resource': { mimeType: realtime.fileMimeType, title: realtime.fileName }}).execute(function(file) {
        console.log('File recreated, id: ' + file.id);
        $window.gapi.drive.realtime.load(file.id, function() {}, function(model) {
          console.log('initializing the model first time...');
          var map = model.createMap();
          model.getRoot().set(realtime.collaborativeMapName, map);
          console.log(model.getRoot());
        });
        return file.id;
      });
    }

  };

  $window.handleApiLoad = realtime.handleApiLoad;

  return realtime;
});