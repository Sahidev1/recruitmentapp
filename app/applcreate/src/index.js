const path = require('path');
const APP_ROOT_DIR = path.resolve(__dirname, '..');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const routes = require('./api/index')

require('dotenv').config({
    path: path.join(APP_ROOT_DIR, '.env') 
});

const express = require('express');
const { errorLogger, requestLogger } = require('./middleware/loggers');
const errorHandler = require('./middleware/errorhandler');
const logger = require('./util/Logger');

const controller = require('./controller/controller')


async function main(){
    try {
        await controller.connectMQ();
        const args = process.argv.slice(2);
        const app = express();
        app.use(bodyparser.json());
        app.use(bodyparser.urlencoded({ extended: true }));
        app.use(cookieparser());

        app.use(requestLogger);

        //add use routes here
        app.use(routes);
        
        app.use(errorLogger);
        app.use(errorHandler);
        const DEFAULT_PORT = '8040';
        const port = process.env.PORT || args[0] || DEFAULT_PORT;
        
        const server = app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (error) {
        logger.log(error);
    }
}

    (async () => {
        const fetch = (await import('node-fetch')).default;
        fetch(process.env.AUTH_MICRO_URL, { method: "GET" })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));        // Your code using fetch here
    })();

main();