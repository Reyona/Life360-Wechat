(function () {
  'use strict';

  angular
    .module('complaint.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('complaint', {
        url: '/complaint',
        templateUrl: '/modules/complaint/client/views/list-complaint.client.view.html',
        controller: 'ComplaintController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Complaint'
        }
      });
  }
}());
