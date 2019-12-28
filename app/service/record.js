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
      order: [ ['addtime', 'DESC'] ],
      where: {
        user_id: user_id,
        is_delete: 0
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
      attributes: ['addtime', 'status', [app.Sequelize.col('Lock.name'), 'lock_name'], [app.Sequelize.col('Lock->area.name'), 'area_name'] ],
    });

    for ( let i in data){
      data[i].addtime = sd.format(new Date(data[i].addtime),'YYYY年MM月DD日 HH:mm:ss');
    }

    return data

  }

}

module.exports = RecordService;
