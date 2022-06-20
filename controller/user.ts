import { Get, Controller } from "../http/common/common";

@Controller('/user')
class user {
  @Get()
  public async indexPage(ctx: any) {
    let { render } = ctx;
    await render('detail/detail.html', {});
  }
  @Get('/getMsg')
  async getMsg(ctx: any) {
    let { moment, log, request, response } = ctx;
    response.body = `user api ${moment().format('YYYY-MM-DD hh:mm:ss')}`;
  }
};

export default user;