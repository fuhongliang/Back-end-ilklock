'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));
const sd = require('silly-datetime');

class RoleService extends Service{

  async listRole() {
    const { app } = this;
    const { Role, Permission } = app.model;
    const user = app.userInfo;
    const list = await Role.findAll({
      where: {
        com_id: user.com_id,
        is_delete: 0,
      },
      include: [
        {
          model: Permission,
          as: 'perms',
          attributes: ['name'],
        }
      ],
      attributes: ['id', 'name', 'addtime', 'desc']
    });

    let new_list = [];
    for (let item of list){
      item.addtime = sd.format(new Date(),'YYYY-MM-DD HH:mm');
      new_list.push(item);
    }
    return new_list;
  }

}

module.exports = RoleService;
