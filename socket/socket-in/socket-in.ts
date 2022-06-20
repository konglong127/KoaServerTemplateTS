// 子进程接收外部连接，包括代理进程
// const path = require('path');
// const mysql = require(path.resolve(__dirname, '../../utils/database/mysql'));
// const redis = require(path.resolve(__dirname, '../../utils/database/redis'));
const keys: string = '8y_n+2=d3<y!e@r#a,d;12ja|"h?m8`!2,>j.dj1';

let agent;
const users: Array<any> = [];

export default async (server: any, port: number) => {

  server.on('connection', async (socket: any) => {

    console.log('连接成功！！！！！');

    socket.on('message', async (message: any) => {
      // socket.send(JSON.stringify({ message: 'OK!' }));
    });

    socket.on('close', async () => {

    });
  })
}
