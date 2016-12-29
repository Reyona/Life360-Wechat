'use strict';

const trace = require('../controllers/trace.server.controller');

module.exports = (app) => {
  app.param('traceId', trace.traceByID)

  app.route('/api/trace')
    .post(trace.create)

  app.route('/api/trace/query')
    .get(trace.query)
};
