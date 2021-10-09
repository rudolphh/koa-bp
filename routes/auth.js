const Router = require('koa-router');
const koaBody = require('koa-body');

// is provided to the app.use to expand the routes of the application
const auth = new Router();// could call it 'router' but 'auth' better choice

// use the middleware we created for getting a connection from the pool
// and provide it to all routes within this router in order to use the db
const { dbConnection } = require('../middlewares/dbConnection');
auth.use(dbConnection);

// bring in the authController object with its functions 
// for handling auth routes requests and responses
const authController = require('../controllers/authController');

auth.post('/login', authController.login);
auth.post('/register', authController.register);

module.exports = auth;
