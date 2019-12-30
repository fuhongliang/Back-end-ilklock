'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));
const assert = require('assert');
const sd = require('silly-datetime');

class LockService extends Service{

  async getLockByNo(lock_no){
    const { ctx, app } = this;
    const { access_token, user_id } = ctx.request.body;
    const { Lock, Region, Company } = ctx.model;
    const user = await app.cache.get(access_token + '-user-' + user_id);

    let lock = await Lock.findOne({
      where: {
        lock_no: lock_no,
        com_id: user.com_id,
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
        {
          model: Company,
          as: 'com',
          where: {
            is_delete: 0
          },
          attributes: [],
        },
      ],
      attributes: ['id', 'addtime', 'name', 'lock_no', [app.Sequelize.col('area.name'), 'area_name'], [app.Sequelize.col('com.com_name'), 'com_name']],
    });

    if (lock){
      lock = lock.toJSON();
      lock.user_name = app.userInfo.name;
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
    const { Lock, LockMode } = app.model;
    const user = await app.cache.get(access_token + '-user-' + user_id);
    let locks_open_by_one = await LockMode.findOne({
      where: { com_id: user.com_id, is_delete: 0, type: 0 },
      attributes: ['locks']
    });
    locks_open_by_one = locks_open_by_one ? JSON.parse(locks_open_by_one):[];
    let list = await Lock.findAll({
      where: {
        region_id: id,
        com_id: user.com_id,
        is_delete: 0,
        is_check: 1,
      },
      attributes: [ 'id', 'name' ],
    });
    console.log(list);
    // list = list.length>0?list.toJSON():[];
    for (let i in list){
      if ( ctx.helper.inArray(list[i].id,locks_open_by_one) ){
        list[i].check = '可选';
      }else{
        list[i].check = '不可选';
      }
    }
    return list;
  }

  async create(){
    const { ctx, app } = this;
    const { Lock, Region } = ctx.model;


    const { lock_no, region_id, lock_name: name, access_token, user_id } = ctx.request.body;
    const user = await app.cache.get(access_token + '-user-' + user_id);

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
      return {
        code: 1,
        msg: '该区域无法添加锁,请重新选择',
      }
    }

    let ck_lock = await Lock.findOne({ where: { lock_no } });
    if (ck_lock){
      return {
        code: 1,
        msg: '锁ID已存在,无法重复添加',
      }
    }

    let res = await Lock.create({ lock_no, region_id, name, com_id: user.com_id });
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
