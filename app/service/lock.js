'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));
const assert = require('assert');
const sd = require('silly-datetime');

class LockService extends Service{

  async getLockByNo(lock_no){
    const { ctx, app } = this;
    const { access_token, user_id } = ctx.request.body;
    const { Lock, Region } = ctx.model;
    const user = await app.cache.get(access_token + '-user-' + user_id);

    let lock = await Lock.findOne({
      where: {
        lock_no: lock_no,
        mch_id: user.mch_id,
        is_delete: 0,
        is_check: 1
      },
      include:[
        {
          model: Region,
          as: 'area',
          where: {
            is_delete: 0
          },
          attributes: [],
        },
      ],
      attributes: ['id', 'addtime', 'name', 'lock_no', [app.Sequelize.col('area.name'), 'area_name']],
    });

    if (lock){
      lock = lock.toJSON();
      lock.user_name = user.name;
      lock.addtime = sd.format(new Date(lock.addtime),'YYYY-MM-DD HH:mm:ss');
      return {
        code: 0,
        msg: 'success',
        data:{ lock }
      }
    }
    return {
      code: 1,
      msg: '未查询到锁相关信息'
    }
  }

  async getAreaLock(){
    const { ctx, app } = this;
    const { id, access_token, user_id } = ctx.request.body;
    assert(id,'区域id不能为空');
    const { Lock } = app.model;
    const user = await app.cache.get(access_token + '-user-' + user_id);
    return Lock.findAll({
      where: {
        region_id: id,
        mch_id: user.mch_id,
        is_delete: 0,
        is_check: 1,
      },
      attributes: [ 'id', 'name' ],
    });
    // return list;
  }

  async create(){
    const { ctx, app } = this;
    const { Lock, Region } = ctx.model;


    const { lock_no, region_id, name: lock_name, access_token, user_id } = ctx.request.body;
    const user = await app.cache.get(access_token + '-user-' + user_id);

    let exist_area = await Region.findOne({
      where: {
        mch_id: user.mch_id,
        id: region_id,
        is_delete: 0,
      }
    });

    if (!exist_area){
      return {
        code: 1,
        msg: '区域不存在'
      }
    }
    let ck_area =  await Region.findOne({
      where: {
        parent_id: region_id,
        is_delete: 0,
      }
    });
    if (ck_area){
      return {
        code: 1,
        msg: '当前区域存在子区域,请将锁放在子区域内'
      }
    }

    let res = await Lock.create({ lock_no, region_id, lock_name, mch_id: user.mch_id });
    if (res){
      return {
        code: 0,
        msg: '创建成功',
      }
    }
    return {
      code: 1,
      msg: '创建失败'
    }
  }

  async modify(options,data){
    const { Lock } = this.ctx.model;
    const res = await Lock.update(data,{ where: options });
    if (res){
      return {
        code: 0,
        msg: 'success'
      }
    }
    return {
      code: 1,
      msg: '修改失败'
    }
  }
}

module.exports = LockService;
