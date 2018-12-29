const env = process.env.ENVIRONMENT || 'DEV_LOCAL';

var routing = {};

if(env === 'DEV'){
    routing = {
        'auth'      : 'http://h2bis-auth-dev-service:7050',
        'hrm'       : 'http://h2bis-hrm-dev-service:7052',
        'image-uploader'       : 'http://image-uploader-service:3006',
        'report'    : 'http://h2biz-report-dev-service:7058',
        'crm'       : 'http://h2bis-crm-dev-service:7054',
        'sys'       : 'http://h2bis-system-dev-service:7051',

    };
} else if(env === 'QA'){
    routing = {
        'auth'      : 'http://h2bis-auth-service:7000',
        'hrm'       : 'http://h2bis-hrm-service:7002',
        'image-uploader'       : 'http://image-uploader-service:3006',
        'report'    : 'http://h2biz-report-service:7008',
        'crm'       : 'http://h2bis-crm-service:7004',
        'sys'       : 'http://h2bis-system-service:7001',
    };
} else if(env === 'ZINCAT_LIVE'){
    routing = {
        'auth'      : 'http://zincat-auth-service:7070',
        'hrm'       : 'http://zincat-hrm-service:7072',
        'image-uploader'       : 'http://image-uploader-service:3006',
        'report'    : 'http://zincat-report-service:7008',
        'crm'       : 'http://zincat-crm-service:7004',
        'sys'       : 'http://zincat-system-service:7071',
    };
} else if(env === 'DEV_LOCAL'){
    routing = {
        'auth'      : 'http://localhost:7000',
        'hrm'       : 'http://localhost:7002',
        'image-uploader'       : 'http://image-uploader-service:3006',
        'report'    : 'http://localhost:7008',
        'crm'       : 'http://localhost:7004',
        'sys'       : 'http://localhost:7001',
    };
}

module.exports = routing;