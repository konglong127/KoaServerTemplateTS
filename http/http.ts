import KOA from 'koa';
import sslify from 'koa-sslify';
import http from 'http';
import http2 from 'http2';
import https from 'https';
import logger from 'koa-logger';
import body from '../utils/koa-body3';
import cors from 'koa2-cors';
import range from 'koa-range';
import koaStatic from 'koa-static';
import session from 'koa-session';
import views from 'koa-views';
// import KoaRouter from 'koa-router';
import fs from 'fs';

import config from '../config';

import socketout from '../socket/socket-out/socket-out';
import WebSocketApi from '../socket/socket-in/socket-in';

import { router } from './common/common'
import Modules from '../module';


const koa = new KOA();
// const router = new KoaRouter();

class HttpServer {
    port: number = 80;
    role: string | undefined;
    serverSocket: any;
    httpConfig: any;
    uploadUrl: any;
    constructor() {
        // http配置文件
        this.httpConfig = config.server;
        // 指定文件上传接口
        this.uploadUrl = config.uploadUrl;
    }
    public create(info: any, serverSocket: any) {
        this.port = info.port;
        this.role = info.role;
        this.serverSocket = serverSocket;
        this.middleware(koa);
    }
    private middleware(koa: any) {

        const sessionConfig = {
            key: 'koa:http-https-socket', //cookie key (default is koa:sess) 
            maxAge: 1000 * 60 * 60, // cookie 的过期时间 1小时 
            overwrite: true, //是否可以 overwrite (default true) 
            httpOnly: true, //cookie 是否只有服务器端可以访问 false or true (default true) 
            signed: true, //签名默认 true 
            rolling: true, //在每次请求时刷新过期时间(deault false)
            renew: false, //再快过期时刷新有效期
        }

        koa.keys = ['some secret hurr'];

        koa.use(session(sessionConfig, koa));

        // koa.use(plugins());

        if (this.httpConfig.environment == 'development')
            koa.use(logger());

        koa.use(cors({
            origin: '*',
            // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
            maxAge: 100,
            credentials: true,
            allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
            allowHeaders: ['X-Requested-With', 'X_Requested_With', 'Content-Type', 'Content-Length', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous', 'token'],
        }));

        koa.use(body({
            multipart: true,
            strict: false,
            formidable: {
                uploadDir: this.httpConfig.uploadPath || './public/upload',
                keepExtensions: true,
                maxFieldsSize: 1024 * 1024 * 1024,
                uploadUrl: this.uploadUrl || []
            }
        }));

        koa.use(views('./views', {
            extension: this.httpConfig.template || 'html'
        }));

        if (this.role != 'agent') {
            koa.use(range);

            koa.use(koaStatic('../public'));

            if (this.httpConfig.environment != 'development') {
                koa.use(async (ctx: any, next: any) => {
                    try {
                        await next();
                    } catch (err) {
                        ctx.app.emit('error', err, ctx);
                    }
                });
            }

            for (let i in Modules.middleware) {
                let md=Object.getOwnPropertyNames(Modules.middleware[i].prototype);
                md=md.filter(item=>item!='constructor')
                for(let j in md){
                    koa.use(Object.getOwnPropertyDescriptors(Modules.middleware[i].prototype)[md[j]].value());                
                }
            }

            for (let i in Modules.controller) { }

            koa.use(router.routes(), router.allowedMethods());

            if (this.httpConfig.environment != 'development') {
                koa.on('error', (err: any, ctx: any) => {
                    ctx.response.status = 200;
                    ctx.response.body = '404,您访问路径不存在！';
                    ctx.log(`
                        --------------------------------------------------------------------------\n
                            出错时间：${new Date()}\n
                            文件名：http.js\n
                            错误描述：查询处理中发生错！\n
                            错误信息：${JSON.stringify(err)}\n
                        --------------------------------------------------------------------------\n
                    `);
                });
            }
        }

        this.start();

    }
    private serverSocketConnect(server: any) {
        const WebSocket = require('ws');

        if (this.httpConfig.webSocket) {

            const wss = new WebSocket.Server({ server });

            WebSocketApi(wss, this.port);
        }

        if ((this.httpConfig.serverSocket == undefined && this.serverSocket ||
            this.httpConfig.serverSocket) && this.role == 'agent') {

            let arr = this.httpConfig.workers.filter((item: any) => item.port != this.port);
            for (let i in arr) {
                socketout(arr[i].port);
            }

        }
    }
    private start() {
        const options: { key: string, cert: string } = {
            key: fs.readFileSync(this.httpConfig.keyPath, 'utf-8'),
            cert: fs.readFileSync(this.httpConfig.certPath, 'utf-8')
        };

        if (this.httpConfig.type == 'https') {
            koa.use(sslify());

            const server = https.createServer(options, koa.callback());

            this.serverSocketConnect(server);

            koa.use((ctx) => {
                ctx.response.type = 'html';
                ctx.response.body = '404';
            });

            server.listen(this.port, () => {
                if (this.httpConfig.environment == 'development')
                    console.log('server:', this.httpConfig.desc || '127.0.0.1', this.port);
            });
        } else if (this.httpConfig.type == 'http2') {

            const server = http2.createSecureServer(options, koa.callback());

            koa.use((ctx) => {
                ctx.response.type = 'html';
                ctx.response.body = '404';
            });

            server.listen(this.port, () => {
                if (this.httpConfig.environment == 'development')
                    console.log('server:', this.httpConfig.desc || '127.0.0.1', this.port);
            });
        } else {
            const server = http.createServer(koa.callback());
            // const server=http2.createServer(options, koa.callback());

            this.serverSocketConnect(server);

            koa.use((ctx) => {
                ctx.response.type = 'html';
                ctx.response.body = '404';
            });

            server.listen(this.port, () => {
                if (this.httpConfig.environment == 'development')
                    console.log('server:', this.httpConfig.desc || '127.0.0.1', this.port);
            });
        }

    }
}

export const httpServer = new HttpServer();
