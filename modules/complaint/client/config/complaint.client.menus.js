(function () {
  'use strict';

  angular
    .module('complaint')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Complaint',
      state: 'complaint'
    });

  }
}());
