import index from './controller/index'
import user from './controller/user'
import validate from './middlewares/validateToken'
import plugins from './middlewares/plugins'

export default {
  controller: [index, user],
  middleware: [plugins, validate]
}