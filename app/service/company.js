'use strict';

const path = require('path');
const Service = require(path.join(process.cwd(),'app/service/baseService'));
const crypto = require('crypto');

class CompanyService extends Service{
  async list(options){
    const { Company } = this.app.model;
    const { page = 1 , page_size = 10 } = options;
    return Company.findAndCountAll({
      where: {
        is_delete: 0,
      },
      offset: (Number(page) - 1)*page_size,
      limit: Number(page_size)
    });
  }

  async add(data){
    const { Company, User } = this.app.model;
    const { account, password, com_name, address, name, phone } = data;
    let transaction;
    try {
      // 建立事务对象
      transaction = await this.ctx.model.transaction();
      let com = await Company.create({ account, com_name, address, name, phone, is_checked: 1 });
      if (!com){
        throw '添加失败';
      }
      await User.create({
        com_id: com.id,
        username: account,
        password: crypto.createHash('sha1').update(password).digest('hex'),
        avatar: this.ctx.helper.getDefaultAvatar(),
        level: 0,
        name,
        addtime: Date.now(),
        phone,
        is_check: 1
      })

    }catch (err) {
      // 事务回滚
      await transaction.rollback();
      return {
        code: 1,
        msg: err,
      };
    }

    return {
      code: 1,
      msg: '添加企业成功'
    }
  }
}

module.exports = CompanyService;
