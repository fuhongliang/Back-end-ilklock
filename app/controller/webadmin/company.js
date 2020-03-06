'use strict';

const path = require('path');
const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class CompanyController extends BaseController {

  async list(){
    const { ctx } = this;
    const list = await ctx.service.company.list(ctx.query);
    await this.ctx.render('webadmin/company/list',{ list: JSON.stringify(list.rows), count: list.count, page_size: list.pageSize });
  }

  async add(){
    const { ctx } = this;
    if (ctx.request.method === 'POST'){

      const validateResult = await ctx.validate('company.add',ctx.request.body);

      if (!validateResult){
        return ;
      }
      ctx.body = await ctx.service.company.add(ctx.request.body);

    }else{
      await ctx.render('webadmin/company/add');
    }
  }

}

module.exports = CompanyController;
