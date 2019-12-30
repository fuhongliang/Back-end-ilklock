'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class AgentController extends BaseController {

  async getArea(){
    const { ctx } = this;
    const { region } = ctx.service;
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list: await region.getChildArea()
      }
    }
  }

  async listArea(){
    const { ctx, app } = this;
    const { access_token, user_id } = ctx.request.body;
    const user = app.cache.get( access_token + '-user-' + user_id);
    const { region } = ctx.service;
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list: await region.allArea(user.com_id)
      }
    };
  }
}

module.exports = AgentController;
