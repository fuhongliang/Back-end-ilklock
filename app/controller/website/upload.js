'use strict';

const path = require('path');

const BaseController = require(path.join(process.cwd(),'app/controller/baseController'));

class UploadController extends BaseController {

  async uploadFile() {
    const { ctx } = this;
    const { upload } = ctx.service;
    const baseDir = path.join(this.config.baseDir, '/run/uploadFile/');

    try{
      await upload.upload(baseDir);
    }catch(err){
      ctx.body = {
        code: 1,
        msg: err
      };
      return ;
    }
    ctx.body = {
      code: 0,
      msg: 'success'
    }

  }
}
module.exports = UploadController;
