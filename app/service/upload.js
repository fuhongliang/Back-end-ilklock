'use strict';

const path = require('path');
const fs = require('fs');
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write;
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole');

const Service = require(path.join(process.cwd(),'app/service/baseService'));
const crypto = require('crypto');

class UploadService extends  Service{

  async upload(baseDir,filename = '') {
    if (!baseDir){
      throw '上传目录不能为空'
    }
    const { ctx } = this;
    const { user } = ctx.service;
    const stream = await ctx.getFileStream();
    if (!fs.existsSync(baseDir)){
      fs.mkdirSync(baseDir,{ recursive: true });
    }
    if (!filename){
      filename = Date.now() + path.extname(stream.filename).toLocaleLowerCase();
    }
    const target = path.join(baseDir,filename);
    const writeStream = fs.createWriteStream(target);

    try {
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
      // 导入数据
      await user.importUser(target);
    } catch (err) {
      //如果出现错误，关闭管道
      await sendToWormhole(stream);
      throw err;
    } finally {
      fs.unlinkSync(target);
    }

  }
}

module.exports = UploadService;
