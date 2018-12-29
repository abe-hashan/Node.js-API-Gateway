var httpProxy = require('http-proxy');
var express = require('express');
const cors = require('cors');

global.logger = require('./config/log');

var jwt = require('jsonwebtoken');
const jwtSecret = require('./config/constants')["jwt-secret"];

var routing = require('./config/apiMap');
var routingAuthIgnore = require('./config/apiIgnoreMap');

var httpPort = 8080;

const app = express();
//app.use(express.json());

app.use(cors());

// create proxy
var proxy = httpProxy.createProxyServer();

//Check the route in AuthIgnore list
app.use((req, res, next) => {

    logger.info('API Gateway. Auth ignore mapping phase : ' + req.url);
    req.skipGatewayAuth = false;
    logger.debug('routingAuthIgnore.indexOf(req.url) : ' + routingAuthIgnore.indexOf(req.url));
    if (routingAuthIgnore.indexOf(req.url)!== -1) {
        logger.info('Matching route found in auth ignore. Set to skip auth : ' + JSON.stringify(req.url));
        req.skipGatewayAuth = true; // set to skip auth since url is found in white list

    }

    next();

});


//authentication
app.use((req, res, next) => {

    logger.info('API Gateway. Auth Phase. ' + req.url);

    if(req.skipGatewayAuth === true){
        logger.info('API Gateway. Auth Phase Skipping. ' + req.url);
        next();
    }else{
        if (req.get('authorization')) {
            var token = req.get('authorization');
            let headers = { headers: { authorization: token } };

            logger.info('Auth header found. ' + req.url);

            jwt.verify(token.split(' ')[1], jwtSecret, (err, decoded) =>{
                if(err){
                    logger.error('Error verifiying token. ' + err.message);
                    return res.status(401).send({ success: false, message: 'Invalid token' });
                }

                logger.info('Token validated. ' + req.url);
                req.headers['decoded'] = decoded;
                next();
            });
        }

        else {
            logger.info('Auth header not found. ' + req.url);
            return res.status(401).send({ success: false, message: 'Authorization data not found in request' });
        }
    }



});



app.use((req, res, next) => {

    logger.debug(JSON.stringify(req.headers));

    logger.info('API Gateway. Mapping phase. ' + req.url);

    var arr = req.url.split('/');

    let newHost = routing[arr[1]];

    if (newHost !== undefined) {
        logger.info('matching host found for : ' + arr[1]);
        arr.shift();
        arr.shift();
        let newRoute =  arr.join('/');
        logger.debug('mapped url = ' + newHost + "/" +  newRoute);
        req.url =newRoute; 

        return proxy.web(req, res, { target: newHost }, function(e) {
            logger.error('Proxy error : ' + e);
            return res.sendStatus(500);
        });
    }

    //If not found go to next = not found handler
    logger.info('matching host not found for : ' , arr[1]);
    next();

});


app.use((req, res, next) => {
    var requestedUrl = req.protocol + '://' + req.get('Host') + req.url;
    logger.error('Inside \'resource not found\' handler , Req resource: ' + requestedUrl);

    return res.sendStatus(404);
});

// error handler
app.use((err, req, res, next) => {
    logger.error('Error handler:', err);
    res.sendStatus(500);
});

app.listen(httpPort, () => {
    console.log('API gateway listening on port 8080');
});