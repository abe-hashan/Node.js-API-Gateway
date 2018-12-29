var winston = require('winston');
require('winston-daily-rotate-file');
var moment = require('moment');

const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

var dailyRotatedTransport = new (winston.transports.DailyRotateFile)({
    filename: './logs/logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    timestamp: tsFormat,
    level:'debug'
});

var dailyRotatedTransportExceptions = new (winston.transports.DailyRotateFile)({
    filename:  './logs/exceptionLogs/exceptions-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    timestamp: tsFormat
});

var logger = new (winston.Logger)({
    transports: [
        dailyRotatedTransport,
        new (winston.transports.Console)({ json: false, timestamp: tsFormat, colorize:true, level:'debug' }),
        //new winston.transports.File({ filename: './logs/debugLogs/debug.log', json: false })
    ],
    exceptionHandlers: [
        dailyRotatedTransportExceptions,
        new (winston.transports.Console)({ json: false, timestamp: tsFormat, colorize:true }),
        //new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
    ],
    exitOnError: false
});

module.exports = logger;