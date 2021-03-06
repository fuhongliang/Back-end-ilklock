'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class IndexController extends BaseController {
  async index(){
    const { ctx, app } = this;
    const { record } = this;
    const { user_id, access_token } = ctx.request.body;
    const user = app.userInfo;
    const records = await record.getOperateRecordByUser(user.id,{ page: 1, page_size: 5});

  }

  // async get
}

module.exports = IndexController;
