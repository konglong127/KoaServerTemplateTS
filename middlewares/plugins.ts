import moment from 'moment';
import log from '../log/log';
import jwt from '../utils/token/token';
import config from '../config';
// import mysql from '../utils/database/mysql';
// import redis from '../database/redis';


export default class validate {
  plugins() {
    return async function (ctx: any, next: any) {
      ctx.log = log;
      ctx.jwt = jwt;
      ctx.config = config;
      ctx.moment = moment;
      // ctx.mysql = mysql;
      // ctx.redis=redis;
      await next();
    }
  }
}


