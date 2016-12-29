(function () {
  'use strict';

  angular
    .module('gathers.admin')
    .controller('GathersAdminController', GathersAdminController);

  GathersAdminController.$inject = ['$scope', '$state', '$window', 'gatherResolve', 'Authentication', 'Notification'];

  function GathersAdminController($scope, $state, $window, gather, Authentication, Notification) {
    var vm = this;

    vm.gather = gather;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Gather
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.gather.$remove(function() {
          $state.go('admin.gathers.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Gather deleted successfully!' });
        });
      }
    }

    // Save Gather
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gatherForm');
        return false;
      }

      // Create a new gather, or update the current instance
      vm.gather.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.gathers.list'); // should we send the User to the list or the updated Gather's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Gather saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Gather save error!' });
      }
    }
  }
}());
