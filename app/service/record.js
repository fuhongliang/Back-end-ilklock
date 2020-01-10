'use strict';

const path = require('path');
const sd = require('silly-datetime');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class RecordService extends Service{

  /**
   * 获取所有开锁日志
   * @returns {Promise<any[]>}
   */
  async getListRecord(where,options) {
    const { app } = this;
    let { page = 1 , page_size = 10 } = options;
    const { LockLog, Lock, Region, User } = app.model;


    let data = await LockLog.findAndCountAll({
      order: [ ['log_time', 'DESC'] ],
      where,
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
              attributes: [],
            }
          ],
        },
        {
          model: User,
          attributes: [],
        }
      ],
      attributes: ['log_time', 'key_status', 'sensor_status', 'soft_status', 'create_at', [app.Sequelize.col('Lock.name'), 'lock_name'], [app.Sequelize.col('User.name'), 'user_name'], [app.Sequelize.col('Lock->area.name'), 'area_name'] ],
    });

    for ( let i in data.rows){
      data.rows[i].log_time = sd.format(new Date(data.rows[i].log_time),'YYYY-MM-DD HH:mm');
    }
    data.pageSize = page_size;
    data.currentPage = page;
    return data;
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

  /**
   * 解析数据
   * @param data
   * @returns {{sensorStatue: *, keyStatus: *, logCode: *, userAddition: *, logVersion: *, company: *, softStatus: *, user: *, locks: *, logOrder: *, logTime: *}}
   */
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
