'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class AgentController extends BaseController {
  async locks() {
    const { ctx, app } = this;
    const { region, user } = ctx.service;
    const list_region = await region.allArea(app.userInfo.com_id);
    const list_user = await user.listUser();
    await ctx.render('region/locks',{ list_region: JSON.stringify(list_region), list_user: JSON.stringify(list_user) });
  }

  async getLocks() {
    const { ctx, app } = this;
    const { lock } = ctx.service;
    const { region_id } = ctx.query;
    const list = await lock.getAreaLock(region_id);
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }

  async editLock() {
    const { ctx, app } = this;
    const { lock } = ctx.service;
    const { Region } = app.model;
    const { lock_name, lock_id, region_id } = ctx.request.body;
    const validateResult = await ctx.validate('lock.modify',{ name: lock_name, id: lock_id, region_id });

    if (!validateResult){
      return ;
    }
    const user = app.userInfo;
    let exist_area = await Region.findOne({
      where: {
        com_id: user.com_id,
        id: region_id,
        is_delete: 0,
        where: app.Sequelize.literal(`pr.id is null`),
      },
      attributes: ['id'],
      include: [
        {
          model: Region,
          as: 'pr',
          where: {
            is_delete: 0,
          },
          attributes: [],
          required: false
        }
      ],
    });

    if (!exist_area){
      ctx.body = {
        code: 1,
        msg: '该区域无法添加锁,请重新选择',
      };
      return ;
    }

    ctx.body = await lock.modify({ id: lock_id, com_id: user.com_id },{ name: lock_name, region_id });
  }

  async setting() {
    const { ctx } = this;
    await ctx.render('region/setting');
  }
}

module.exports = AgentController;
