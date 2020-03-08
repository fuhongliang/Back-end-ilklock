'use strict';

const path = require('path');
const sd = require('silly-datetime');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class WorkService extends Service{

  // 作业列表
  async list() {
    const { ApplyWork, User, LockMode } = this.app.model;
    const user = this.app.userInfo;
    let list = await ApplyWork.findAll({
      where: {
        user_id: user.id,
        status: 1,
        is_delete: 0,
        work_status: 0
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: []
        },
        {
          model: LockMode,
          as: 'mode',
          attributes: []
        }
      ],
      attributes: ['id','addtime', 'start_time', 'end_time', 'duration', [this.app.Sequelize.col('mode.locks'), 'locks'], [this.app.Sequelize.col('author.name'), 'user_name'], [this.app.Sequelize.col('mode.name'), 'mode_name'] ]
      ,raw: true
    });
    for (let i in list){
      if (list.hasOwnProperty(i)){
        list[i].addtime = sd.format(new Date(list[i].addtime),'YYYY-MM-DD HH:mm');
        list[i].locks = JSON.parse(list[i].locks) || '';
      }
    }
    return {
      code: 0,
      msg: 'success',
      data: {
        list
      }
    };
  }

  // 完成作业
  async finish() {
    const user = this.app.userInfo;
    const { ApplyWork } = this.app.model;
    const { ids } = this.ctx.request.body;
    ApplyWork.update({ work_status: 1 },{ where: { id: { [this.app.Sequelize.Op.in]: ids }, user_id: user.id }});
    return {
      code: 0,
      msg: 'success'
    }
  }

  async getWorkLocks() {
    const { ApplyWork, LockMode } = this.app.model;
    const { id } = this.ctx.request.body;
    const user = this.app.userInfo;
    const lock = await ApplyWork.findOne({
      where:{
        id,
        status: 1,
        is_delete: 0,
        is_worked: 0
      },
      include: [
        {
          model: LockMode,
          as: 'mode',
          required: true,
          attributes: []
        }
      ],
      attributes: ['id', 'work_no', 'start_time', 'end_time', 'duration', [this.app.Sequelize.col('mode.locks'), 'locks'] ]
    }).then(
      result => result.toJSON()
    );

    if (!lock || !Array.isArray(JSON.parse(lock.locks))){
      return {
        code: 1,
        msg: '未查询到开锁数据信息'
      }
    }
    // let secrets = await this.findAllSecret(lock.work_no,user.com_id);

    let locks = JSON.parse(lock.locks);
    // for (let i in locks){
    //   if (locks.hasOwnProperty(i)){
    //     if (Array.isArray(locks[i])){
    //       for (let j in locks[i]){
    //         if (locks[i].hasOwnProperty(j)){
    //           locks[i][j].secret_key = secrets[locks[i][j].lock_no];
    //         }
    //
    //       }
    //     }else{
    //       locks[i].secret_key = secrets[locks[i].lock_no];
    //     }
    //   }
    // }

    return {
      code: 0,
      msg: 'success',
      data: {
        start_time: lock.start_time,
        end_time: lock.end_time,
        duration: lock.duration,
        locks
      }
    }
  }

  async findAllSecret(work_no,com_id){
    const { LockSecret } = this.app.model;
    const list = await LockSecret.findAll({
      where: {
        work_no,
        com_id,
        is_send: 0,
      },
      attributes: [ 'lock_no', 'secret_key' ]
    });
    LockSecret.update({ is_send: 1 }, { work_no , com_id });
    let new_list = {};
    for (let secret of list){
      Object.assign(new_list,{ [secret.lock_no]: secret.secret_key });
    }
    return new_list;
  }

}
module.exports = WorkService;
