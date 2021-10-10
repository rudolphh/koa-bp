const Router = require('koa-router');
const koaBody = require('koa-body');

// is provided to the app.use to expand the routes of the application
const auth = new Router();// could call it 'router' but 'auth' better choice

// use the middleware we created for getting a connection from the pool
// and provide it to all routes within this router in order to use the db
const { dbConnection } = require('../middlewares/dbConnection');
//auth.use(dbConnection);


// bring in the authController object with its functions 
// for handling auth routes requests and responses
const authController = require('../controllers/authController');

// lets use compose to create one function that executes all middlewares
const compose = require('koa-compose');
const loginMiddlewareStack = compose([dbConnection, authController.login]);
const registerMiddlewareStack = compose([dbConnection, authController.register]);

auth.post('/login', loginMiddlewareStack);
auth.post('/register', registerMiddlewareStack);

module.exports = auth;
