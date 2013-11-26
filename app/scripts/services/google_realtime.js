'use strict';

// https://developers.google.com/drive/quickstart-js
// https://developers.google.com/drive/realtime/realtime-quickstart

angular.module('provinceApp').factory('GoogleRealtime', function($window, State, $rootScope, appConfig, Utils, $log) {

  var realtime = {

    fileName: 'provinceClients',
    fileMimeType: 'application/vnd.google-apps.drive-sdk',
    fileId: '0B9bg9aXL_oUWM0NRZWhyTEQ1Qlk',
    collaborativeMapName: 'data',

    map: null,

    shouldCreateNewRealtimeFile: false,

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

    // TODO: separate dev file creation from the actual functionality
    handleDriveApiLoad: function() {
      if (realtime.shouldCreateNewRealtimeFile) {
        realtime.fileId = realtime.createNewRealtimeFile();
      } else {
        $window.gapi.drive.realtime.load(realtime.fileId, realtime.handleModelLoad);
      }
    },

    // Load the realtime file from Google Drive
    // getRoot() and getRoot().get(...) returns https://developers.google.com/drive/realtime/reference/gapi.drive.realtime.CollaborativeMap
    handleModelLoad: function(model) {

      var map = realtime.map = model.getModel().getRoot().get(realtime.collaborativeMapName);

      map.addEventListener($window.gapi.drive.realtime.EventType.VALUE_CHANGED, function() {
        $rootScope.$emit('realtimeValueChanged', map);
      });

      $rootScope.$emit('realtimeLoaded');
    },

    createNewRealtimeFile: function() {

      $window.gapi.client.drive.files.insert({'resource': { fileId: 'asdasda', mimeType: realtime.fileMimeType, title: realtime.fileName }}).execute(function(file) {
        
        $log.debug('File recreated, id: ' + file.id);

        $log.debug('Sharing globally...');
        realtime.shareForEveryone(file.id);

        $window.gapi.drive.realtime.load(file.id, function() {}, function(model) {
          $log.debug('Initializing the model first time...');
          var map = model.createMap();
          model.getRoot().set(realtime.collaborativeMapName, map);
          $log.debug('Initialized model: ' + model.getRoot().toString())
        });
      });
    },

    // See: https://developers.google.com/drive/manage-sharing
    // and: http://stackoverflow.com/questions/12092056/google-drive-api-adding-and-updating-permissions
    shareForEveryone: function(fileId) {
    
      var listReq = gapi.client.drive.permissions.list({ 'fileId': fileId });
     
      listReq.execute(function(resp) {

        var permissionId = resp.items[0].id;

        var body = {
          'value': 'anyone',
          'type': 'anyone',
          'role': 'writer'
        };

        var permReq = gapi.client.drive.permissions.insert({
          'fileId': fileId,
          'resource': body
        });

        permReq.execute(function(data) {
          $log.debug('Sharing done, permissions: ' + JSON.stringify(data));
        });

      });
    }

  };

  $window.handleApiLoad = realtime.handleApiLoad;

  return realtime;
});