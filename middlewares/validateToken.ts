export default class validate {
  m1() {
    return async (ctx: any, next: any) => {
      console.log('middleware1');
      await next();
    }
  }
  m2(){
    return async (ctx: any, next: any) => {
      console.log('middleware2');
      await next();
    }
  }
}
