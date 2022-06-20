import jwt from './token';

let res:any=jwt.encrypt('11111111111111',1000*60*60);
console.log(res);

res=jwt.decrypt(res);
console.log(res);