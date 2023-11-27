const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');
const db = require("./integration/dbconfig");
const bodyparser = require('body-parser');
const routes = require('./api/routes/index');
const authMiddleware = require('./api/middleware/auth');
const cookieparser = require('cookie-parser');
const errorLogger = require('./api/middleware/loggers').errorLogger;

require('dotenv').config({
    path: path.join(APP_ROOT_DIR, '.env')
});

const express = require('express');

const DEFAULT_PORT = '8000';
const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(errorLogger);
app.use(cookieparser());
app.use(authMiddleware);

app.use(routes);


db.authenticate().then(e => console.log("db connected!")).catch(err => console.error(err));

const server = app.listen(
    process.env.PORT||DEFAULT_PORT, () => {
        console.log('Server is up');
    }
);
