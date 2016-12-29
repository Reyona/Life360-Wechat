(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('gathers.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Gather',
      state: 'admin.gathers.list'
    });
  }
}());
