'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class LockService extends Service{

  async getLockByNo(lock_no){
    const { ctx } = this;
    const { access_token } = ctx.request.body;
    const { Lock, Region } = ctx.model;
    const user = app.cache.get(access_token + '-user');

    let lock = Lock.findOne({
      where: {
        lock_no: lock_no,
        mch_id: user.mch_id,
        is_delete: 0
      },
      include:[
        {
          model: Region,
          where: {
            is_delete: 0
          },
          attributes: [['name', 'region_name']],
        }
      ],
    });

    if (lock){
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

  async create(){
    const { ctx } = this;
    const { Lock } = ctx.model;
    const { lock_no, agent_id, lock_name, mch_id } = ctx.request.body;
    let res = await Lock.create({ lock_no, agent_id, lock_name, mch_id });
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

  async modify(id,data){
    const { Lock } = this.ctx.model;
    const res = await Lock.update(data,{ id });
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
