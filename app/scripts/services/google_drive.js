'use strict';

// https://developers.google.com/drive/quickstart-js
// https://developers.google.com/drive/realtime/realtime-quickstart

angular.module('provinceApp').factory('GoogleDrive', function($window, State, $rootScope, appConfig) {

   function initializeModel(model) {
      var string = model.createString('Hello Realtime World!');
      model.getRoot().set('text', string);
    }

    /**
     * This function is called when the Realtime file has been loaded. It should
     * be used to initialize any user interface components and event handlers
     * depending on the Realtime model. In this case, create a text control binder
     * and bind it to our string model that we created in initializeModel.
     * @param doc {gapi.drive.realtime.Document} the Realtime document.
     */
    function onFileLoaded(doc) {
      var string = doc.getModel().getRoot().get('text');

      // Keeping one box updated with a String binder.
      var textArea1 = document.getElementById('editor1');
      gapi.drive.realtime.databinding.bindString(string, textArea1);

      // Keeping one box updated with a custom EventListener.
      var textArea2 = document.getElementById('editor2');
      var updateTextArea2 = function(e) {
        textArea2.value = string;
      };
      string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, updateTextArea2);
      string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, updateTextArea2);
      textArea2.onkeyup = function() {
        string.setText(textArea2.value);
      };
      updateTextArea2();

      // Enabling UI Elements.
      textArea1.disabled = false;
      textArea2.disabled = false;

      // Add logic for undo button.
      var model = doc.getModel();
      var undoButton = document.getElementById('undoButton');
      var redoButton = document.getElementById('redoButton');

      undoButton.onclick = function(e) {
        model.undo();
      };
      redoButton.onclick = function(e) {
        model.redo();
      };

      // Add event handler for UndoRedoStateChanged events.
      var onUndoRedoStateChanged = function(e) {
        undoButton.disabled = !e.canUndo;
        redoButton.disabled = !e.canRedo;
      };
      model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, onUndoRedoStateChanged);
    }


var realtimeOptions = {
      /**
       * Client ID from the console.
       */
      clientId: appConfig.googleClientId,

      /**
       * The ID of the button to click to authorize. Must be a DOM element ID.
       */
      authButtonElementId: 'signinButton',

      /**
       * Function to be called when a Realtime model is first created.
       */
      initializeModel: initializeModel,

      /**
       * Autocreate files right after auth automatically.
       */
      autoCreate: true,

      /**
       * The name of newly created Drive files.
       */
      defaultTitle: "New Realtime Quickstart File",

      /**
       * The MIME type of newly created Drive Files. By default the application
       * specific MIME type will be used:
       *     application/vnd.google-apps.drive-sdk.
       */
      newFileMimeType: null, // Using default.

      /**
       * Function to be called every time a Realtime file is loaded.
       */
      onFileLoaded: onFileLoaded,

      /**
       * Function to be called to inityalize custom Collaborative Objects types.
       */
      registerTypes: null, // No action.

      /**
       * Function to be called after authorization and before loading files.
       */
      afterAuth: null // No action.
    }


  var drive = {

    startRealtime: function() {
      var realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
      realtimeLoader.start();
    }


    /*addScript: function() {
      var po = document.createElement('script');
      po.type = 'text/javascript';
      po.src = 'https://apis.google.com/js/client.js?onload=clientLoadCallback';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(po, s);
    },

    clientLoadCallback: function(foo) {
      console.log('clientLoadCallback')
      console.log(foo)
      //$rootScope.$apply();
    }*/


  };

  // $window.clientLoadCallback = google.clientLoadCallback;

  return drive;
});