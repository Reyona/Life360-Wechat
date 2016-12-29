(function (app) {
  'use strict';

  app.registerModule('complaint', ['core']);
  app.registerModule('complaint.services');
  app.registerModule('complaint.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
