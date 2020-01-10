'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));
const assert = require('assert');

class AgentController extends BaseController {
  async locks() {
    const { ctx, app } = this;
    const { region, user } = ctx.service;
    const list_region = await region.allArea(app.userInfo.com_id);
    const list_user = await user.listUser();
    await ctx.render('region/locks',{ list_region: JSON.stringify(list_region), list_user: JSON.stringify(list_user) });
  }

  /**
   * 获取锁列表
   * @returns {Promise<void>}
   */
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

  /**
   * 编辑锁信息
   * @returns {Promise<void>}
   */
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

  /**
   * 授权开锁
   * @returns {Promise<void>}
   */
  async authLock() {
    const { ctx, app } = this;
    const validateResult = await ctx.validate('lock.auth',ctx.request.body);

    if (!validateResult){
      return ;
    }

    const { lock } = ctx.service;
    ctx.body = await lock.auth();
  }

  async delLock() {
    const { ctx, app } = this;
    const { Lock } = app.model;
    const user = app.userInfo;
    const { id } = ctx.request.body;
    let res = await Lock.update({ is_delete: 1},{ where: { id, com_id: user.com_id } });
    if (res){
      ctx.body = {
        code: 0,
        msg: 'success'
      }
    }else{
      ctx.body = {
        code: 1,
        msg: '删除失败'
      }
    }
  }


  async setting() {
    const { ctx, app } = this;
    const { region } = ctx.service;
    const user = app.userInfo;
    let list_region = await region.allArea(user.com_id);
    await ctx.render('region/setting',{ list_region: JSON.stringify(list_region) });
  }

  /**
   * 获取区域列表
   * @returns {Promise<void>}
   */
  async list() {
    const { ctx, app } = this;
    const { region } = ctx.service;
    const { mode } = ctx.query;
    const user = app.userInfo;
    let list_region = await region.allArea(user.com_id);
    await ctx.render('region/region',{ list_region: JSON.stringify(list_region), mode });
  }

  async add() {
    const { ctx, app } = this;
    if (ctx.method === 'POST'){
      const { region } = ctx.service;
      ctx.body = await region.create();
    }else{
      await ctx.render('region/add');
    }

  }

  async edit() {
    const { ctx } = this;
    const { region } = ctx.service;
    const validateResult = await ctx.validate('region.modify',ctx.request.body);

    if (!validateResult){
      return ;
    }
    ctx.body = await region.modify();
  }

  async del() {
    const { ctx } = this;
    const { region } = ctx.service;
    const { id } = ctx.request.body;
    assert(/^\d+$/.test(id),'删除区域失败');
    ctx.body = await region.del(id);
  }
}

module.exports = AgentController;
