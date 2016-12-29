'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  // External usage
  app.route('/api/notices').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .put(articles.listPaging)
    .post(articles.create)

  app.route('/api/notices/search/:key')
    .get(articles.queryByKey)

  app.route('/api/notices/:id')
    .get(articles.read)
    .delete(articles.delete);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
};
