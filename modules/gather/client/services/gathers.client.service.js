(function () {
  'use strict';

  angular
    .module('gathers.services')
    .factory('GathersService', GathersService);

  GathersService.$inject = ['$resource', '$log'];

  function GathersService($resource, $log) {
    var Gather = $resource('/api/gathers/:gatherId', {
      gatherId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Gather.prototype, {
      createOrUpdate: function () {
        var gather = this;
        return createOrUpdate(gather);
      }
    });

    return Gather;

    function createOrUpdate(gather) {
      if (gather._id) {
        return gather.$update(onSuccess, onError);
      } else {
        return gather.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(gather) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
