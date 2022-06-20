// 代理进程去连接其它子进程
import WebSocket from 'ws';
const keys: string = '8y_n+2=d3<y!e@r#a,d;12ja|"h?m8`!2,>j.dj1';
const workers: Array<any> = [];//记录每一个子进程

export default (port: number) => {
  const ws = new WebSocket(`ws://127.0.0.1:${port}/shouyu/websocket`);
  workers.push({ port, ws });

  ws.on('open', () => {
    console.log('openning !!!!!!!!!!!!!!');
    ws.send(JSON.stringify({ port, keys, addAgent: true }));
  });

  ws.on('message', (message: any) => {

    for (let i in workers) {
      workers[i].ws.send(JSON.stringify({ message: "send to this work", type: 'broadcast' }));
    }

  });
}
