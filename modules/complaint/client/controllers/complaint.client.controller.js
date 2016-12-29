(function () {
  'use strict';

  angular
    .module('complaint')
    .controller('ComplaintController', ComplaintController);

  ComplaintController.$inject = ['$resource', '$window', '$scope', '$state', 'ComplaintService'];

  function ComplaintController($resource, $window, $scope, $state, ComplaintService) {
    var vm = this;
    vm.complaints = ComplaintService.query();
    vm.remove = remove;

    function remove(complaint) {
      console.log(complaint);
      if ($window.confirm('Are you sure you want to delete this Complaint?' + complaint)) {
        vm.complaints.splice(vm.complaints.indexOf(complaint), 1);
      }
    }
  }
}());
