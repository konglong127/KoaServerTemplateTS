import MySQL from 'mysql';
import config from '../../config';
const { mysql, server } = config;
var arr:Array<any> = [];

var connection:any;

function reconnnectProcessing() {
    if (arr.length == 10) {
        arr = arr.slice(1, 10);
    }
    arr.push(new Date().getTime());
    if (arr.length == 10 && arr[9] - arr[0] < 10000) {
        return true;
    }
    return false;
}

function keepConnection() {
    connection = MySQL.createConnection({
        host: mysql.host,
        user: mysql.user,
        password: mysql.password,
        database: mysql.database
    });

    connection.connect(() => {
        if (server.environment == 'development')
            console.log('mysql database connected')
    });

    connection.on('error', () => {
        if (reconnnectProcessing())
            return;
        keepConnection();
    });

    connection.on('end', () => {
        if (reconnnectProcessing())
            return;
        keepConnection();
    });
};

keepConnection();

setInterval(() => {
    connection.ping();
    connection.query("select 'keep connection'");
}, 3600000);

export default connection;
