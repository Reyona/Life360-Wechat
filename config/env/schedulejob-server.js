'use strict';

let app = require('../../config/lib/app')
app.init(()=> {
  require('../../modules/articles/server/schedulejobs/articles.server.schedule.js')
  require('../../modules/gather/server/schedulejobs/gather.server.schedule.js')
})

