'use strict';

const path = require('path');
const sd = require('silly-datetime');
const Service = require(path.join(process.cwd(),'app/service/baseService'));

class RecordService extends Service{

  async getOperateRecordByUser(id,options){
    const { ctx } = this;
    let { page , page_size } = options;
    const { LockLog, Lock, Region } = ctx.model;

    let data = await LockLog.findAll({
      order: [ ['addtime', 'DESC'] ],
      where: {
        id: id,
        is_delete: 0
      },
      offset: (page - 1)*page_size,
      limit: page_size,
      include: [
        {
          model: Lock,
          attributes: [['name', 'lock_name']],
          include:[
            {
              model: Region,
              where: {
                is_delete: 0
              },
              attributes: [['name', 'region_name']],
            }
          ],
        },

      ]
    });

    if (data){
      data = data.toJSON();
      for ( let i in data){
        data[i].addtime = sd.format(new Date(data[i].addtime),'YYYY年MM月DD日 HH:mm:ss');
      }
    }

    return data

  }

}

module.exports = RecordService;
