import { Get, Controller } from "../http/common/common";

@Controller()
class index {
  @Get('/')
  async indexPage(ctx: any) {
    let { render } = ctx;
    await render('index/index.html', {});
  }
  @Get('/getMsg')
  async getMsg(ctx: any) {
    let { mysql, redis, moment, log, request, response, config } = ctx;
    console.log('mysql=',mysql,log,config);
    response.body = moment().format('YYYY-MM-DD hh:mm:ss');
  }
};

export default index;