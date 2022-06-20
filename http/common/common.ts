import 'reflect-metadata'
import KoaRouter from 'koa-router';
export const router = new KoaRouter();

export const Controller = (url?: string): ClassDecorator => {
    return (target: Function) => {
        let funs = Object.getOwnPropertyNames(target.prototype);
        funs = funs.filter(item => item != 'constructor');
        for (let i in funs) {
            let res = Reflect.getMetadata('request', target.prototype, funs[i]);
            if (res) {
                if (url) {
                    res.url = res.url ? url + res.url : url;
                }
                // console.log(url, res);
                if (res.method == 'get') {
                    router.get(res.url ? res.url : '/', res.fun)
                } else if (res.method == 'post') {
                    router.post(res.url ? res.url : '/', res.fun)
                } else if (res.method == 'put') {
                    router.put(res.url ? res.url : '/', res.fun)
                } else if (res.method == 'delete') {
                    router.delete(res.url ? res.url : '/', res.fun)
                } else if (res.method == 'patch') {
                    router.patch(res.url ? res.url : '/', res.fun)
                }
            }
        }

    }
}

const createMappingDecorator = (method: string, url?: string): MethodDecorator => {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {

        if (method == 'get') {
            Reflect.defineMetadata('request', { method: 'get', url: url, fun: descriptor.value }, target, propertyKey);
        } else if (method == 'post') {
            Reflect.defineMetadata('request', { method: 'post', url: url, fun: descriptor.value }, target, propertyKey);
        } else if (method == 'put') {
            Reflect.defineMetadata('request', { method: 'put', url: url, fun: descriptor.value }, target, propertyKey);
        } else if (method == 'delete') {
            Reflect.defineMetadata('request', { method: 'delete', url: url, fun: descriptor.value }, target, propertyKey);
        } else if (method == 'patch') {
            Reflect.defineMetadata('request', { method: 'patch', url: url, fun: descriptor.value }, target, propertyKey);
        }
    }
}

export const Get = (url?: string) => createMappingDecorator('get', url);
export const Post = (url?: string) => createMappingDecorator('post', url);
export const Put = (url?: string) => createMappingDecorator('put', url);
export const Delete = (url?: string) => createMappingDecorator('delete', url);
export const Patch = (url?: string) => createMappingDecorator('patch', url);

export const Middleware: MethodDecorator = (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    console.log(descriptor.value);
}
