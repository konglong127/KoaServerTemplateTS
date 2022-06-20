import config from '../config';
import { httpServer } from './http';

if (config.server.type == 'https') {
  httpServer.create(config.server.workers[0] || { port: 443, role: 'worker' }, false);
} else {
  httpServer.create(config.server.workers[0] || { port: 80, role: 'worker' }, false);
}