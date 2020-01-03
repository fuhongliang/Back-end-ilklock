'use strict';

const path = require('path');
const sd = require('silly-datetime');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class RecordService extends Service{

  async getOperateRecordByUser(user_id,options){
    const { ctx, app } = this;
    let { page , page_size } = options;
    const { LockLog, Lock, Region } = ctx.model;

    let data = await LockLog.findAll({
      order: [ ['log_time', 'DESC'] ],
      where: {
        user: user_id,
      },
      offset: (page - 1)*page_size,
      limit: page_size,
      include: [
        {
          model: Lock,
          attributes: [],
          include:[
            {
              model: Region,
              as: 'area',
              where: {
                is_delete: 0
              },
              attributes: [],
            }
          ],
        },
      ],
      attributes: ['log_time', 'key_status', 'sensor_status', 'soft_status', 'create_at', [app.Sequelize.col('Lock.name'), 'lock_name'], [app.Sequelize.col('Lock->area.name'), 'area_name'] ],
    });

    for ( let i in data){
      data[i].log_time = sd.format(new Date(data[i].log_time),'YYYY年MM月DD日 HH:mm:ss');
    }

    return data

  }

  /**
   * 插入一条日志
   * @param {Number} keyId 钥匙ID
   * @param {Buffer} ciperLog 加密后的串
   */
  async insertLogs(keyId, ciperLog) {

    const logData = this.decrypt(ciperLog);
    const { LockLog } = this.app.model;
    const results = await LockLog.create({
      key_id: keyId,
      key_status: logData.keyStatus,
      log_time: logData.logTime,
      log_version: logData.logVersion,
      log_order: logData.logOrder,
      log_code: logData.logCode,
      user: logData.user,
      company: logData.company,
      user_addition: logData.userAddition,
      locks: logData.locks,
      soft_status: logData.softStatus,
      sensor_status: logData.sensorStatue,
      create_at: new Date(),
    });

    return results;
  }

  decrypt(data) {
    const { helper } = this.ctx;
    assert(data instanceof Buffer, 'Error');

    const logVersion = helper.readInt(data, 0, 4);
    const logTime = helper.readInt(data, 4, 32);
    const logOrder = helper.readInt(data, 36, 16);
    const keyStatus = helper.readInt(data, 52, 8);
    const logCode = helper.readInt(data, 60, 8);
    const user = helper.readInt(data, 68, 32);
    const company = helper.readInt(data, 100, 32);
    const userAddition = helper.readInt(data, 132, 32);
    const locks = helper.readInt(data, 164, 32);
    const softStatus = helper.readInt(data, 196, 4);
    const sensorStatue = helper.readInt(data, 200, 16);

    return {
      logVersion,
      logTime,
      logOrder,
      keyStatus,
      logCode,
      user,
      company,
      userAddition,
      locks,
      softStatus,
      sensorStatue,
    };
  }

}

module.exports = RecordService;
