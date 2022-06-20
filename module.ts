import index from './controller/index'
import user from './controller/user'
import validate from './middlewares/validateToken'

export default {
  controller: [index, user],
  middleware: [validate]
}