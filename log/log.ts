import fs from 'fs';
import config from '../config';

export default (msg: any, type: any) => {
    fs.readdir(__dirname, 'utf-8', (err, data) => {
        data = data.filter(value => value.endsWith(".log"));
        let record = data.filter(item => /record[0-9]*.log/.test(item));
        let query = data.filter(item => /query[0-9]*.log/.test(item));
        if (type == 'query') {
            if (config.server.environment == 'development' && config.logConsole)
                console.log('query:记录sql查询日志');
            for (let i = 0; i < query.length; i++) {
                for (let j = i + 1; j < query.length; j++) {
                    if (parseInt(query[i].slice(5, query[i].length)) > parseInt(query[j].slice(5, query[j].length))) {
                        let t = query[i];
                        query[i] = query[j];
                        query[j] = t;
                    }
                }
            }

            if (query.length == 0) {
                fs.writeFileSync('./query1.log', '');
                query = fs.readdirSync(__dirname, 'utf-8').filter(value => value.endsWith(".log"));
            }
            fs.stat(`./${query[query.length - 1]}`, (err, stat) => {
                if (stat.size < 50340) {
                    fs.readFile(`./${query[query.length - 1]}`, 'utf-8', (err, infor) => {
                        infor += msg;
                        fs.writeFileSync(`./${query[query.length - 1]}`, infor, 'utf-8');
                    });
                } else {
                    fs.writeFileSync(`./query${parseInt(query[query.length - 1].toString().slice(5)) + 1}.log`, msg);
                }
            });
        } else {
            if (config.server.environment == 'development' && config.logConsole)
                console.log('error:发生错误记录日志');
            for (let i = 0; i < record.length; i++) {
                for (let j = i + 1; j < record.length; j++) {
                    if (parseInt(record[i].slice(6, record[i].length)) > parseInt(record[j].slice(6, record[j].length))) {
                        let t = record[i];
                        record[i] = record[j];
                        record[j] = t;
                    }
                }
            }
            if (record.length == 0) {
                fs.writeFileSync('./record1.log', '');
                record = fs.readdirSync(__dirname, 'utf-8').filter(value => value.endsWith(".log"));
            }
            fs.stat(`./${record[record.length - 1]}`, (err, stat) => {
                if (stat.size < 50340) {
                    fs.readFile(`./${record[record.length - 1]}`, 'utf-8', (err, infor) => {
                        infor += msg;
                        fs.writeFileSync(`./${record[record.length - 1]}`, infor, 'utf-8');
                    });
                } else {
                    fs.writeFileSync(`./record${parseInt(record[record.length - 1].toString().slice(6)) + 1}.log`, msg);
                }
            });
        }
    });
}
