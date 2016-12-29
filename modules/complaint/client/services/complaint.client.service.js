(function () {
  'use strict';

  angular
    .module('complaint.services')
    .factory('ComplaintService', ComplaintService);

  ComplaintService.$inject = ['$resource', '$log'];

  function ComplaintService($resource, $log) {

    var Complaint = $resource('/api/complaints', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Complaint.prototype, {
      createOrUpdate: function () {
        var article = this;
        return createOrUpdate(article);
      }
    });

    return Complaint;

    function createOrUpdate(complaint) {
      if (complaint._id) {
        return complaint.$update(onSuccess, onError);
      } else {
        return complaint.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
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
