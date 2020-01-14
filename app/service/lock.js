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

    locks_open_by_one = locks_open_by_one ? (JSON.parse(locks_open_by_one['locks']) || []):[];

    if (!Array.isArray(locks_open_by_one)){
      locks_open_by_one = [ locks_open_by_one ];
    }

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
        throw '创建锁失败';
      }
      let lockres;
      locks.push({ id: res.id, lock_no: res.lock_no, name: res.name });
      if (locks_open_by_one){
        lockres = await LockMode.update({locks: JSON.stringify([...new Set(locks)])}, { where: {id: locks_open_by_one.id} });
      }else{
        lockres = await LockMode.create({locks: JSON.stringify([...new Set(locks)]), com_id: user.com_id, name: '单锁模式', desc: '允许单个锁申请开锁', addtime: Date.now(), type: 0, sort: 1 });
      }

      if (!lockres){
        throw '创建锁失败';
      }
      // 提交事务
      await transaction.commit();
    } catch (err) {
      // 事务回滚
      await transaction.rollback();
      return {
        code: 1,
        msg: err,
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
    const { user_id, lock_id, start_time = 0, end_time } = ctx.request.body;
    const { ApplyAuthorize, User, Lock } = app.model;
    const user = app.userInfo;

    const exist_user = await User.findOne({ where: { id: user_id, com_id: user.com_id, is_delete: 0, is_check: 1 } });
    if (!exist_user){
      return {
        code: 1,
        msg: '用户不存在,请重新选择~'
      }
    }

    const lock = await Lock.findOne({ where: { id: lock_id, com_id: user.com_id, is_delete: 0, is_check: 1 }});
    if (!lock){
      return {
        code: 1,
        msg: '锁信息不存在,请刷新页面重试~'
      }
    }
    let work_no = await this.createWorkNo(0);
    let trans;
    try {
      trans = await this.ctx.model.transaction();
      await this.createSecret({
        com_id: user.com_id,
        work_no: work_no,
        lock_no: lock.lock_no,
        start_time: start_time?new Date(start_time).getTime():Date.now(),
        expire_time: end_time?new Date(end_time).getTime():Date.now(),
      });
      await ApplyAuthorize.create({
        com_id: user.com_id,
        user_id,
        lock_id,
        work_no,
        audit_id: user.id,
        start_time: start_time?new Date(start_time).getTime():0,
        end_time: end_time?new Date(end_time).getTime():0,
        addtime: Date.now(),
        type: 1,
        status: 1,
      });
      await trans.commit();
    }catch(err){
      await trans.rollback();
      return {
        code: 1,
        msg: err
      }
    }
    return {
      code: 0,
      msg: 'success'
    }

  }

  /**
   * 开锁模式
   * @returns {Promise<any[]>}
   */
  async listMode() {
    const { app } = this;
    const user = app.userInfo;
    const { LockMode } = app.model;
    const list = await LockMode.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0
      },
      order: [['sort','asc'], ['addtime','desc']]
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
    const { user_id, mode_id, start_time = 0, end_time } = ctx.request.body;
    const { ApplyWork, User, LockMode } = app.model;
    const user = app.userInfo;

    const exist_user = await User.findOne({ where: { id: user_id, com_id: user.com_id, is_delete: 0, is_check: 1 } });
    if (!exist_user){
      return {
        code: 1,
        msg: '用户不存在,请重新选择~'
      }
    }

    const lock_mode = await LockMode.findOne({ where: { id: mode_id, com_id: user.com_id, is_delete: 0 }});
    if (!lock_mode){
      return {
        code: 1,
        msg: '开锁模式不存在,请刷新页面重试~'
      }
    }

    let locks_data = JSON.parse(lock_mode.locks) || [];
    if (!Array.isArray(locks_data) || locks_data.length === 0){
      return {
        code: 1,
        msg: '所选开锁模式下没有锁,请添加'
      }
    }

    let work_no = await this.createWorkNo(1);

    let trans;
    try{
      trans = await this.ctx.model.transaction();
      for (let i in locks_data){
        if (locks_data.hasOwnProperty(i)){
          for (let lock of locks_data[i]){
            await this.createSecret({
              com_id: user.com_id,
              work_no: work_no,
              lock_no: lock.lock_no,
              start_time: start_time?new Date(start_time).getTime():Date.now(),
              expire_time: end_time?new Date(end_time).getTime():Date.now(),
            });
          }
        }
      }
      await ApplyWork.create({
        com_id: user.com_id,
        user_id,
        lock_mode_id: mode_id,
        audit_id: user.id,
        work_no,
        start_time: start_time?new Date(start_time).getTime():0,
        end_time: end_time?new Date(end_time).getTime():0,
        addtime: Date.now(),
        type: 1,
        status: 1,
      });
      await trans.commit();
    }catch(err){
      await trans.rollback();
      return {
        code: 1,
        msg: err
      }
    }
    return {
      code: 0,
      msg: 'success'
    }

  }

  /**
   * 获取开锁模式
   * @param user
   * @param id
   * @returns {Promise<{}|any>}
   */
  async getMode(user,id) {
    const { app } = this;
    const{ LockMode, Lock } = app.model;
    let mode = await LockMode.findOne({ where: { id, com_id: user.com_id, is_delete: 0 } });

    if (!mode){
      return {};
    }

    let locks = JSON.parse(mode.locks);
    locks = Array.isArray(locks)?Array.isArray(locks[0])?locks:[locks]:[[locks]];
    if (!Array.isArray(locks[0])) {
      locks = [ locks ];
    }
    let locks_id = [];
    for (let lock of locks){
      locks_id = locks_id.concat(lock);
    }

    mode.locks = locks;
    return mode;
  }

  async editMode(user,id) {
    const { ctx, app } = this;
    const { LockMode } = app.model;
    let { name, desc, locks_data } = ctx.request.body;
    let lock_mode = await LockMode.findOne({ where: { id,com_id: user.com_id, is_delete: 0 }});
    if (!lock_mode){
      await LockMode.create({
        com_id: user.com_id,
        name,
        desc,
        locks: JSON.stringify(locks_data),
        addtime: Date.now(),
        type: 1,
      });
    }else{

      if (lock_mode.type === 0){
        locks_data = locks_data[0];
      }else{
        const lock_one = await LockMode.findOne({ where: { com_id: user.com_id, is_delete: 0, type: 0 } });
        let locks_one_data = lock_one?(JSON.parse(lock_one.locks) || []):[];
        if (locks_data.length > 0){
          for (let i in locks_one_data){
            if (locks_one_data.hasOwnProperty(i) && this.inLocks(locks_data,locks_one_data[i])){
              locks_one_data.splice(i,1);
            }
          }
        }
        lock_one.locks = JSON.stringify(locks_one_data);
        await lock_one.save();
      }

      await LockMode.update({ name, desc, locks: JSON.stringify(locks_data) }, { where: { id, com_id: user.com_id } });
    }
    return {
      code: 0,
      msg: 'success'
    }
  }

  inLocks(locks_data,lock_one){
    for (let index in locks_data){
      if (locks_data.hasOwnProperty(index) && index > 0){
        for (let lock of locks_data[index]){
          if (lock.id == lock_one.id){
            return true;
          }
        }
      }
    }
    return false;
  }

  async createSecret(data) {
    const { app } = this;
    const { LockSecret } = app.model;
    const { com_id, work_no, lock_no, start_time, expire_time } = data;
    const secret_key = await this.generateSecretKey();
    await LockSecret.create({
      com_id,
      work_no,
      lock_no,
      secret_key,
      start_time,
      expire_time,
      is_send: 0
    });

  }

  /**
   * 生成开锁指令
   * @returns {Promise<string>}
   */
  async generateSecretKey(){
    return 'secret_key';
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
