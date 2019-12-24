'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class ApplyService extends Service{

  async getAuthKeys(){
    const { app } = this;
    const { access_token } = this.ctx.request.body;
    const user = app.cache.get(access_token + '-user');
    const { ApplyAuthorize, Lock } = app.model;
    let list = await ApplyAuthorize.findAll({
      where: {
        user_id: user.id,
        expiry_time: {},
        status: 1,
        is_delete: 0
      },
      include: [
        {
          model: Lock,
          where: {
            is_delete: 0
          },
          attributes: [['name', 'lock_name']],
        }

      ],
    });
    return {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }
}

module.exports = ApplyService;
