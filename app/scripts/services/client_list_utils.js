'use strict';

angular.module('provinceApp').factory('ClientListUtils', function() {

  var utils = {

    amIOnTheList: function(clientId, clients) {
      return utils.getMyListIndex(clientId, clients) !== -1;
    },

    // could also be so that the client would get notified (instead of it asking)
    anyOffersPendingForMe: function(clientId, clients) {

      var other = utils.getOtherClients(clientId,clients);
      
      for (var index in other) {
        var client = other[index];
        if (client.offers.length > 0) {
          return true; // TODO: also check that there is an offer for me
        }
      }
      return false;
    },

    getOtherClients: function(clientId, clients) {
      var others = [];
      for (var index in clients.asArray()) {
        var client = clients.get(parseInt(index));
        if (client.id !== clientId) {
          others.push(client);
        }
      }
      return others;
    },

    getMyListIndex: function(clientId, clients) {
      for (var index in clients.asArray()) {
        var client = clients.get(parseInt(index));
        if (client.id === clientId) {
          return parseInt(index);
        }
      }
      return -1;
    },

    notifyAboutReload: function(clientId, clients) {
      var index = utils.getMyListIndex(clientId, clients);
      var me = clients.get(index);
      clients.set(index, me);
    },

    buildClientData: function(clientId) {
      return {
        id: clientId,
        offers: [],
        answers: []
      };
    }

  };

  return utils;

});