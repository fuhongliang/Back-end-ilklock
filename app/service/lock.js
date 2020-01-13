'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));
const assert = require('assert');
const sd = require('silly-datetime');
const random = require('string-random');

class LockService extends Service{

  /**
   * 根据锁编号获取锁
   * @param lock_no
   * @returns {Promise<{msg: string, code: number, data: {lock: *}}|{msg: string, code: number}>}
   */
  async getLockByNo(lock_no){
    const { ctx, app } = this;
    const { access_token, user_id } = ctx.request.body;
    const { Lock, Region, Company } = ctx.model;
    const user = app.userInfo;

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

  /**
   * 根据区域id获取锁
   * @param region_id
   * @returns {Promise<[]>}
   */
  async getAreaLock(region_id){
    const { ctx, app } = this;

    const { Lock, LockMode } = app.model;
    const user = app.userInfo;
    let locks_open_by_one = await LockMode.findOne({
      where: { com_id: user.com_id, is_delete: 0, type: 0 },
      attributes: ['locks']
    });

    locks_open_by_one = locks_open_by_one ? JSON.parse(`${locks_open_by_one['locks']}`):[];

    let list = await Lock.findAll({
      where: {
        region_id: region_id,
        com_id: user.com_id,
        is_delete: 0,
        is_check: 1,
      },
      attributes: [ 'id', 'name', 'lock_no' ],
    });

    let new_list = [];
    for (let item of list){
      let new_item = item.toJSON();
      if ( ctx.helper.inArray(new_item.id,locks_open_by_one) ){
        new_item.check = 1;
      }else{
        new_item.check = 0;
      }
      new_list.push(new_item);
    }

    return new_list;
  }

  /**
   * 创建锁
   * @returns {Promise<{msg: string, code: number}>}
   */
  async create(){
    const { ctx, app } = this;
    const { Lock, Region, LockMode } = ctx.model;


    const { lock_no, region_id, lock_name: name } = ctx.request.body;
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

    const locks_open_by_one = await LockMode.findOne({
      where: { com_id: user.com_id, is_delete: 0, type: 0 },
      attributes: ['id','locks']
    });
    let locks = locks_open_by_one ? JSON.parse(locks_open_by_one['locks']):[];

    let transaction;

    try {
      // 建立事务对象
      transaction = await this.ctx.model.transaction();

      let res = await Lock.create({ lock_no, region_id, name, com_id: user.com_id });
      if (!res){
        throw new Error('创建锁失败');
      }
      let lockres;
      locks.push(res.id);
      if (locks_open_by_one){
        lockres = await LockMode.update({locks: JSON.stringify([...new Set(locks)])}, { where: {id: locks_open_by_one.id} });
      }else{
        lockres = await LockMode.create({locks: JSON.stringify([...new Set(locks)]), com_id: user.com_id, name: '单锁模式', desc: '允许单个锁申请开锁', type: 0 });
      }

      if (!lockres){
        throw new Error('创建锁失败');
      }
      // 提交事务
      await transaction.commit();
    } catch (err) {
      // 事务回滚
      await transaction.rollback();
      return {
        code: 1,
        msg: err.errorMsg,
      };
    }


    return {
      code: 0,
      msg: '创建成功',
    }
  }

  /**
   * 修改锁信息
   * @param options
   * @param data
   * @returns {Promise<{msg: string, code: number}>}
   */
  async modify(options,data){
    const { Lock } = this.ctx.model;
    await Lock.update(data,{ where: options });
    return {
      code: 0,
      msg: 'success'
    }
  }

  /**
   * 授权开锁
   * @returns {Promise<{msg: string, code: number}>}
   */
  async auth() {
    const { app, ctx } = this;
    const { user_id, lock_id, duration } = ctx.request.body;
    const { ApplyAuthorize, User, Lock } = app.model;
    const user = app.userInfo;

    const exist_user = await User.findOne({ where: { id: user_id, com_id: user.com_id, is_delete: 0, is_check: 1 } });
    if (!exist_user){
      return {
        code: 1,
        msg: '用户不存在,请重新选择~'
      }
    }

    const exist_lock = await Lock.findOne({ where: { id: lock_id, com_id: user.com_id, is_delete: 0, is_check: 1 }});
    if (!exist_lock){
      return {
        code: 1,
        msg: '锁信息不存在,请刷新页面重试~'
      }
    }
    let work_no = await this.createWorkNo(0);
    let res = await ApplyAuthorize.create({
      com_id: user.com_id,
      user_id,
      lock_id,
      work_no,
      audit_id: user.id,
      duration,
      addtime: new Date().getTime(),
      type: 1,
      status: 1,
    });
    if (res){
      return {
        code: 0,
        msg: 'success'
      }
    }
    return {
      code: 1,
      msg: '授权失败'
    }
  }

  /**
   * 开锁模式
   * @returns {Promise<any[]>}
   */
  async listMode() {
    const { ctx, app } = this;
    const user = app.userInfo;
    const { LockMode } = app.model;
    const list = await LockMode.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0
      },
      order: [['addtime','desc']]
    });
    for (let i in list){
      list[i].addtime = sd.format(new Date(list[i].addtime),'YYYY-MM-DD HH:mm');
      list[i].locks = JSON.parse(list[i].locks);
    }
    return list;
  }

  /**
   * 授权作业模式
   * @returns {Promise<{msg: string, code: number}>}
   */
  async authMode() {
    const { app, ctx } = this;
    const { user_id, mode_id, duration } = ctx.request.body;
    const { ApplyWork, User, LockMode } = app.model;
    const user = app.userInfo;

    const exist_user = await User.findOne({ where: { id: user_id, com_id: user.com_id, is_delete: 0, is_check: 1 } });
    if (!exist_user){
      return {
        code: 1,
        msg: '用户不存在,请重新选择~'
      }
    }

    const exist_lock = await LockMode.findOne({ where: { id: mode_id, com_id: user.com_id, is_delete: 0 }});
    if (!exist_lock){
      return {
        code: 1,
        msg: '开锁模式不存在,请刷新页面重试~'
      }
    }
    let work_no = await this.createWorkNo(1);
    let res = await ApplyWork.create({
      com_id: user.com_id,
      user_id,
      lock_mode_id: mode_id,
      audit_id: user.id,
      work_no,
      duration,
      addtime: new Date().getTime(),
      type: 1,
      status: 1,
    });
    if (res){
      return {
        code: 0,
        msg: 'success'
      }
    }
    return {
      code: 1,
      msg: '授权失败'
    }
  }

  async getMode(id) {
    const { app } = this;
    const{ LockMode, Lock } = app.model;
    const user = app.userInfo;
    let mode = await LockMode.findOne({ where: { id, com_id: user.com_id, is_delete: 0 }, raw: true });

    if (!mode){
      return {};
    }

    let locks = JSON.parse(mode.locks) || [];
    if (!Array.isArray(locks[0])) {
      locks[0] = locks;
    }
    let locks_id = [];
    for (let lock of locks){
      locks_id = locks_id.concat(lock);
    }
    const list_lock = await Lock.findAll({ where: { id: { [app.Sequelize.Op.in]: locks_id} }, attributes: ['id', 'name'] });

    let new_locks = [];
    for (let key in locks){
      if (locks.hasOwnProperty(key)){
        for (let i in locks[key]){
          if (locks[key].hasOwnProperty(i)){
            let id = locks[key][i];
            let name = this.findLockName(list_lock,id);
            new_locks[key][i] = { id, name };
          }
        }
      }
    }

    mode.locks = new_locks;
    mode.locks_id = locks_id;
    return mode;
  }

  findLockName(locks,id) {
    for (lock of locks){
      if (lock.id == id){
        return lock.name;
      }
    }
  }

  /**
   *
   * @param type [ 0: 单个锁申请的工作编号  1: 作业分组申请的工作编号 ]
   * @returns {Promise<string>}
   */
  async createWorkNo(type = 0) {
    const { ApplyAuthorize, ApplyWork } = this.app.model;
    let work_no = '';

    while(true) {
      let model= ApplyWork;
      let prefix = 'group_';
      if (type === 0) {
        prefix = 'single_';
        model = ApplyAuthorize;
      }
      work_no = prefix + random(12);
      let exists = await model.findOne({ where: { work_no } });
      if (!exists){
        break;
      }
    }
    return work_no;
  }
}

module.exports = LockService;
