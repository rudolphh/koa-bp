"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Router = require("koa-router");
var compose = require("koa-compose");
var dbConnection_1 = require("../middlewares/dbConnection");
var authController_1 = require("../controllers/authController");
// is provided to the app.use to expand the routes of the application
var auth = new Router(); // could call it 'router' but 'auth' better choice
// use the middleware we created for getting a connection from the pool
// and provide it to all routes within this router in order to use the db
//auth.use(dbConnection);
// bring in the authController object with its functions 
// for handling auth routes requests and responses
// lets use compose to create one function that executes all middlewares
var loginMiddlewareStack = compose([dbConnection_1.dbConnection, authController_1.login]);
var registerMiddlewareStack = compose([dbConnection_1.dbConnection, authController_1.register]);
auth.post('/login', loginMiddlewareStack);
auth.post('/register', registerMiddlewareStack);
exports.default = auth;
//# sourceMappingURL=auth.js.map