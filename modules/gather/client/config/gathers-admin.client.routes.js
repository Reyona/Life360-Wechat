(function () {
  'use strict';

  angular
    .module('gathers.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.gathers', {
        abstract: true,
        url: '/gathers',
        template: '<ui-view/>'
      })
      .state('admin.gathers.list', {
        url: '',
        templateUrl: '/modules/gather/client/views/admin/list-gathers.client.view.html',
        controller: 'GathersAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.gathers.create', {
        url: '/create',
        templateUrl: '/modules/gather/client/views/admin/form-gather.client.view.html',
        controller: 'GathersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          gatherResolve: newGather
        }
      })
      .state('admin.gathers.edit', {
        url: '/:gatherId/edit',
        templateUrl: '/modules/gather/client/views/admin/form-gather.client.view.html',
        controller: 'GathersAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          gatherResolve: getGather
        }
      });
  }

  getGather.$inject = ['$stateParams', 'GathersService'];

  function getGather($stateParams, GathersService) {
    return GathersService.get({
      gatherId: $stateParams.gatherId
    }).$promise;
  }

  newGather.$inject = ['GathersService'];

  function newGather(GathersService) {
    return new GathersService();
  }
}());
