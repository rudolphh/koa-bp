import * as Router from 'koa-router';
import * as compose from 'koa-compose';
import { dbConnection } from '../middlewares/dbConnection';
import { login, register } from '../controllers/authController';

// is provided to the app.use to expand the routes of the application
const auth = new Router();// could call it 'router' but 'auth' better choice

// use the middleware we created for getting a connection from the pool
// and provide it to all routes within this router in order to use the db
//auth.use(dbConnection);

// bring in the authController object with its functions 
// for handling auth routes requests and responses

// lets use compose to create one function that executes all middlewares
const loginMiddlewareStack = compose([dbConnection, login]);
const registerMiddlewareStack = compose([dbConnection, register]);

auth.post('/login', loginMiddlewareStack);
auth.post('/register', registerMiddlewareStack);

export default auth;
