'use strict';


class Authorization {

  constructor(app,model) {
    this.app = app;
    this.model = model;
  }

  /**
   *
   * @param key
   * @param value
   * @param ttl
   * @returns {Promise<void>}
   */
  async set(key,value,ttl = 600){
    this.model.create({id: key,});
  }

  async get(){

  }

}

module.exports = Authorization;

