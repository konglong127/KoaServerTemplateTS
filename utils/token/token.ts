import jwt from 'jsonwebtoken';

const Token = {
  encrypt:function(data:any,time:number){ //data加密数据，time过期时间
    return jwt.sign({ data }, 'secret', { expiresIn: time });
  },
  decrypt:function(token:string){
    try {
      let data = jwt.verify(token, 'secret');
      return { token:true, data };
    } catch (error) {
      return { token:false, data:error }
    }
  }
}

export default Token;
