'use strict';

const path = require('path');
const sd = require('silly-datetime');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class WorkService extends Service{
  async list() {
    const { ctx, app } = this;
    const { LockMode } = app.model;
  }
}
module.exports = WorkService;
