'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/complaint.server.policy'),
  complaints = require('../controllers/complaint.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/complaints')
    .get(complaints.list)
    .post(complaints.create)
    .put(complaints.listPaging);

  // Single article routes
  app.route('/api/complaints/:complaintId')
    .get(complaints.complaintByID)
    .delete(complaints.delete);

  app.route('/api/complaints/picture')
    .post(complaints.addPicture)

  app.route('/api/complaints/comment')
    .post(complaints.comment)

};
