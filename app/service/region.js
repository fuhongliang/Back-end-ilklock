'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class RegionService extends Service{

  /**
   * 获取所有区域
   * @returns {Promise<{msg: string, code: number, data: {list: *}}>}
   */
  async allArea(com_id){

    const { app } = this;
    const { Region } = app.model;

    const list = await Region.findAll({
      where: {
        is_delete: 0,
        com_id: com_id
      }
    });
    let new_list = {};

    if (list){
      for (let item of list){
        let new_item = item.toJSON();
        if (!new_list[new_item.parent_id]){
          new_list[new_item.parent_id] = [];
        }
        new_list[new_item.parent_id].push(new_item);
      }
    }
    return new_list
  }

  async getChildArea(){
    const { ctx, app } = this;
    const { Region } = app.model;
    const { id = 0 } = ctx.request.body;
    const user = app.userInfo;

    return Region.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0,
        parent_id: id
      },
      attributes: ['id', 'name'],
    });
  }

  /**
   * 修改区域信息
   * @returns {Promise<{msg: string, code: number}>}
   */
  async modify() {
    const { ctx, app } = this;
    const { region_id, region_name, parent_id } = ctx.request.body;
    const { Region } = app.model;
    const user = app.userInfo;
    this.moveLocks(parent_id,region_id);
    let res = await Region.update({ name: region_name, parent_id }, { where: { id: region_id, com_id: user.com_id }});
    if (res){
      return {
        code: 0,
        msg: 'success'
      }
    }else{
      return {
        code: 1,
        msg: '修改失败'
      }
    }
  }

  /**
   * 将父区域内的锁移到子区域内
   * @param from_id
   * @param to_id
   * @returns {Promise<void>}
   */
  async moveLocks(from_id,to_id) {
    const { app } = this;
    const { Lock } = app.model;
    const list_locks = await Lock.findAll({
      where: {
        region_id: from_id,
        is_delete: 0
      },
      attributes: ['id']
    });

    let lock_ids = [];
    for (let lock of list_locks){
      lock_ids.push(lock.id);
    }
    await Lock.update({region_id: to_id},{ where: { id: { [app.Sequelize.Op.in]: lock_ids } } });
  }

  /**
   * 删除区域
   * @param id
   * @returns {Promise<{msg: string, code: number}>}
   */
  async del(id) {
    const { ctx, app } = this;
    const { Lock, Region } = app.model;
    const user = app.userInfo;
    const exists_lock = await Lock.findOne({ where: { region_id: id, is_delete: 0 } });
    if (exists_lock){
      return {
        code: 1,
        msg: '该区域下存在锁,无法删除'
      }
    }

    const exists_child = await Region.findOne({ where: { parent_id: id, is_delete: 0 } });
    if (exists_child){
      return {
        code: 1,
        msg: '该区域下存在子区域,无法删除'
      }
    }

    let res = await Region.update({ is_delete: 0 }, { where: { id, com_id: user.com_id } });
    if (res){
      return {
        code: 0,
        msg: 'success'
      }
    }
    return {
      code: 1,
      msg: '删除失败'
    }
  }

  async create() {
    const { ctx, app } = this;
    const { Region } = app.model;
    const { parent_id, region_name } = ctx.request.body;
    const user = app.userInfo;
    let res = await Region.create({ com_id: user.com_id, name: region_name, parent_id});
    if (res){
      return {
        code: 0,
        msg: '创建成功'
      }
    }
    return {
      code: 1,
      msg: '创建失败'
    }
  }
}

module.exports = RegionService;
