(function (app) {
  'use strict';

  app.registerModule('gathers', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('gathers.admin', ['core.admin']);
  app.registerModule('gathers.admin.routes', ['core.admin.routes']);
  app.registerModule('gathers.services');
  app.registerModule('gathers.routes', ['ui.router', 'core.routes', 'gathers.services']);
}(ApplicationConfiguration));
