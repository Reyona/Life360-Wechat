'use strict';

const gathers = require('../controllers/gathers.server.controller');

module.exports = (app) => {

  app.route('/api/gathers')
    .get(gathers.list)
    .post(gathers.create)

  app.route('/api/gathers/:gatherId')
    .get(gathers.read)
    .put(gathers.update)
    .delete(gathers.delete)

  app.route('/api/gathers/join/:gatherId')
    .post(gathers.join)
  app.route('/api/gathers/leave/:gatherId')
    .post(gathers.leave)
  app.route('/api/gathers/lead/:gatherId')
    .post(gathers.lead)
  app.route('/api/gathers/departure/:gatherId')
    .post(gathers.departure)

  // Finish by binding the article middleware
  app.param('gatherId', gathers.gatherByID)
};
