'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class RecordController extends BaseController {

  async operateList() {
    const { ctx, app } = this;
    const { access_token, user_id , page = 1, page_size = 10 } = ctx.request.body;
    const { record } = ctx.service;
    const user = await app.cache.get(access_token + '-user-' + user_id);
    console.log(user);
    const data = await record.getOperateRecordByUser(user.id,{ page: page, page_size: page_size});
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list: data
      }
    }
  }

}

module.exports = RecordController;
