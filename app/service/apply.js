'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));
const sd = require('silly-datetime');

class ApplyService extends Service{

  /**
   * 获取已授权钥匙
   * @returns {Promise<{msg: string, code: number, data: {list: *}}>}
   */
  async getAuthKeys(){
    const { app } = this;
    const user = app.userInfo;
    const { ApplyAuthorize, Lock, LockSecret } = app.model;

    let list = await ApplyAuthorize.findAll({
      where: {
        user_id: user.id,
        status: 1,
        is_delete: 0
      },
      attributes: ['id', 'addtime', 'work_no', [app.Sequelize.col('lock.lock_no') , 'lock_no'], [app.Sequelize.col('lock.name') , 'lock_name'], [app.Sequelize.col('secret.secret_key') , 'secret_key'] ],
      include: [
        {
          model: Lock,
          as: 'lock',
          where: {
            is_delete: 0
          },
          attributes: [],
        },
        {
          model: LockSecret,
          as: 'secret',
          where: {
            start_time: { [app.Sequelize.Op.lt]: Date.now() },
            expire_time: { [app.Sequelize.Op.gt]: Date.now() },
            is_send: 0
          },
          attributes: [],
        }
      ],
    });
    for (let i in list){
      if (list.hasOwnProperty(i)){
        list[i].addtime = sd.format(new Date(list[i].addtime),'YYYY-MM-DD HH:mm');
      }
    }
    return {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    }
  }

  async renewStatus(options) {
    const { app } = this;
    const { LockSecret } = app.model;
    const { lock_no = '', work_no = '' } = options;
    const user = app.userInfo;
    await LockSecret.update({ is_send: 1 }, { where: { work_no, lock_no, com_id: user.com_id } });
  }

  /**
   * type { nl: '新增锁', ol: '申请开锁' }
   * @returns {Promise<void>}
   */
  async getAuditer(){
    const { ctx, app } = this;
    const { User, Role, Permission } = ctx.model;
    const { type } = ctx.request.body;
    let permission_id = 0;
    if ( type === 'nl'){
      permission_id = 1;
    }else if(type === 'ol'){
      permission_id = 3;
    }
    const user = app.userInfo;

    return User.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0,
        is_check: 1,
        id: {
          [app.Sequelize.Op.ne]: user.id
        },
        level: {
          [app.Sequelize.Op.gt]: 0
        }
      },
      include: [
        {
          model: Permission,
          as: 'up',
          attributes: [],
          where: {
            id: permission_id,
          }
        },
        {
          model: Role,
          as: 'role',
          attributes: [],
        },

      ],
      attributes: [['id', 'audit_id'], 'name', [app.Sequelize.col('role.name'), 'role_name']],
    });
    //
    // return list;
  }

  /**
   *
   * @param id
   * @param type = { 0: 待处理, 1:已处理, 2:已提交 3:已批准 4:未完成}
   * @param options = { 0: 待处理, 1:已处理, 2:已提交 3:已批准 4:未完成}
   * @returns {Bluebird<any[]>}
   */
  async getRecordByUserId(id, options){
    const { ctx, app } = this;
    const { ApplyAuthorize, Lock, Region, User } = ctx.model;
    const { page = 1 , page_size = 10, type = 2 } = options;
    const Op = app.Sequelize.Op;
    let where = {
      user_id: id,
      is_delete: 0,
      type: 0,
    };
    switch (type) {
      case 0:
        where.status = 0;
        break;
      case 1:
        where.status = { [Op.ne] : 0 };
        break;
      case 2:
        break;
      case 3:
        where.status = { [Op.gt]: 0 };
        break;
      case 4:
        where.status = 1;
        break;
      default:
        break;
    }
    let list = await ApplyAuthorize.findAndCountAll({
      where,
      include: [
        {
          model: Lock,
          attributes: [],
          as: 'lock',
          where: {
            is_delete: 0
          },
          include: [
            {
              model: Region,
              attributes: [],
              as: 'area'
            }
          ],
        },
        {
          model: User,
          attributes: [],
          as: 'user'
        }
      ],
      attributes: ['id', 'addtime', 'status', [app.Sequelize.col('user.name'), 'user_name'], [app.Sequelize.col('lock.name'), 'lock_name'], [app.Sequelize.col('lock.area.name'), 'region_name']],
      order: [ ['addtime', 'DESC'] ],
      offset: (Number(page) - 1)*page_size,
      limit: Number(page_size)
    });
    for (let i in list.rows){
      if (list.rows.hasOwnProperty(i)){
        list.rows[i].addtime = sd.format(new Date(list.rows[i].addtime),'YYYY-MM-DD HH:mm');
        list.rows[i].status = this.statusToText(list.rows[i].status);
      }
    }
    return list;
  }

  statusToText(status){
    switch (status) {
      case 0:
        return '待处理';
      case 1:
        return '已处理';
      case 2:
        return '已提交';
      case 3:
        return '已批准';
      case 4:
        return '未完成';
      default:
        return '';
    }
  }

  /**
   * 申请开锁
   * @param data
   * @returns {Promise<void>}
   */
  async applyKeySecret(data){

    const { app, ctx } = this;
    const { Lock, ApplyAuthorize, LockMode } = app.model;
    const { lock_id, audit_id, com_id, user_id, duration = 0, start_time = 0, end_time = 0 } = data;

    let locks_order_open = await LockMode.findAll({
      where: { com_id, is_delete: 0, type: 1 },
      attributes: ['locks']
    });
    for (let lock of locks_order_open){

    }

    let locks_open_by_one = await LockMode.findOne({
      where: { com_id, is_delete: 0, type: 0 },
      attributes: ['locks']
    });

    let locks_id = this.getDisableLockId(locks_order_open,locks_open_by_one);

    if ( ctx.helper.inArray(lock_id,locks_id) ){
      throw '该锁不支持申请';
    }
    const checkLock = await Lock.findOne({ where: { com_id , id: lock_id, is_delete: 0 } });
    if (!checkLock){
      throw '锁信息不存在';
    }
    let addtime = Date.now();
    let work_no = await this.ctx.service.lock.createWorkNo(0);
    let start = start_time?new Date(start_time).getTime():0;
    let end = end_time?new Date(end_time).getTime():0;
    await ApplyAuthorize.create({ com_id, user_id, lock_id, audit_id, work_no, duration, start_time: start, end_time: end, addtime, type: 0 });
  }

  getDisableLockId(locks_order_open,locks_open_by_one) {

    const { ctx } = this;
    locks_open_by_one = locks_open_by_one?(JSON.parse(locks_open_by_one.locks) || []):[];
    let lock_ids = [];
    for (let lock of locks_order_open){
      let locks = JSON.parse(lock.locks) || [];
      for (let i in locks){
        if (locks.hasOwnProperty(i)){
          if (i !== 0 && Array.isArray(locks[i])){
            for (let id of locks[i]){
              if (!ctx.helper.inArray(id,locks_open_by_one)){
                lock_ids.push(id);
              }
            }
          }
        }
      }
    }
    return lock_ids;
  }

  /**
   * 申请开锁列表
   * @returns {Bluebird<{rows: any[]; count: number}>}
   */
  async listApply() {
    const { app } = this;
    const { ApplyAuthorize, Region, Lock, User } = app.model;
    const { page = 1, page_size = 10 } = this.ctx.query;
    const user = app.userInfo;

    let list = await ApplyAuthorize.findAndCountAll({
      where: {
        audit_id: user.id,
        is_delete: 0,
        type: 0,
      },
      include: [
        {
          model: Lock,
          as: 'lock',
          attributes: [],
          include: [
            {
              model: Region,
              as: 'area',
              attributes: []
            }
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: []
        }
      ],
      attributes: ['id', 'addtime','status',[app.Sequelize.col('lock.name'), 'lock_name'], [app.Sequelize.col('user.name'), 'user_name'], [app.Sequelize.col('lock.area.name'), 'region_name']],
      limit: Number(page_size),
      offset: (Number(page) - 1)*page_size,
    });


    for (let row in list.rows){
      list.rows[row].addtime = sd.format(new Date(list.rows[row].addtime),'YYYY-MM-DD HH:mm')
    }
    list.pageSize = page_size;
    list.currentPage = page;
    return list;
  }

  async review() {
    const { app } = this;
    const { ApplyAuthorize } = app.model;
    const { id, status } = this.ctx.request.body;
    const user = app.userInfo;

    if (status == 1){
      // 审核通过

    }else{
      // 审核拒绝
    }
    const res = await ApplyAuthorize.update({ status },{ where: { id, audit_id: user.id} });

    return {
      code: 0,
      msg: 'success'
    }

  }

}

module.exports = ApplyService;
