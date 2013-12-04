'use strict';

// https://developers.google.com/drive/quickstart-js
// https://developers.google.com/drive/realtime/realtime-quickstart

angular.module('provinceApp').factory('GoogleRealtime', function($window, State, $rootScope, appConfig, Utils, $log) {

  var realtime = {

    fileName: 'provinceClients',
    fileMimeType: 'application/vnd.google-apps.drive-sdk',
    fileId: '0B9bg9aXL_oUWWmRzWEZNeTJPcHM',
    collaborativeListName: 'clients',

    list: null,

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
    // getRoot() returns https://developers.google.com/drive/realtime/reference/gapi.drive.realtime.CollaborativeMap
    // getRoot().get(...) returns https://developers.google.com/drive/realtime/reference/gapi.drive.realtime.CollaborativeList
    handleModelLoad: function(model) {

      var list = realtime.list = model.getModel().getRoot().get(realtime.collaborativeListName);

      //list.clear();

      list.addEventListener($window.gapi.drive.realtime.EventType.VALUES_ADDED, function() {
        $rootScope.$emit('realtimeValueChanged', list);
      });

      list.addEventListener($window.gapi.drive.realtime.EventType.VALUES_REMOVED, function() {
        $rootScope.$emit('realtimeValueChanged', list);
      });

      list.addEventListener($window.gapi.drive.realtime.EventType.VALUES_SET, function() {
        $rootScope.$emit('realtimeValueChanged', list);
      });

      $rootScope.$emit('realtimeLoaded', list);
    },

    createNewRealtimeFile: function() {

      $window.gapi.client.drive.files.insert({'resource': { fileId: '', mimeType: realtime.fileMimeType, title: realtime.fileName }}).execute(function(file) {
        
        $log.debug('File recreated, id: ' + file.id);

        $log.debug('Sharing globally...');
        realtime.shareForEveryone(file.id);

        $window.gapi.drive.realtime.load(file.id, function() {}, function(model) {
          $log.debug('Initializing the model first time...');
          var list = model.createList();
          model.getRoot().set(realtime.collaborativeListName, list);
          $log.debug('Initialized model: ' + model.getRoot().toString());
        });
      });
    },

    // See: https://developers.google.com/drive/manage-sharing
    // and: http://stackoverflow.com/questions/12092056/google-drive-api-adding-and-updating-permissions
    shareForEveryone: function(fileId) {
    
      var listReq = $window.gapi.client.drive.permissions.list({ 'fileId': fileId });
     
      listReq.execute(function() {

        var body = {
          'value': 'anyone',
          'type': 'anyone',
          'role': 'writer'
        };

        var permReq = $window.gapi.client.drive.permissions.insert({
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