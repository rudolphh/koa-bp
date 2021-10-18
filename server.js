// loads all environment variables in .env file and adds to process.env (system global EVs)
// looks in same directory by default for the .env file
// unless specified in config options object passed into .config()
// example: require('dotenv').config({ path: '/custom/path/to/.env' })
require("dotenv").config();

const Koa = require("koa"); // include koa module (require - CommonJS module system)

// created this function to seed our mysql database with some user data
const { seedDatabase } = require('./seeder');
seedDatabase();

const app = new Koa();// new app instance (singleton)

// this function will add the db to the context object (i.e. ctx.db)
// instead of adding the db connection object in middleware (i.e. ctx.state.db)
// may be more performant (no middleware) and/or easier (fewer require(s)) at the expense 
// of relying more on ctx, which could be considered an anti-pattern.
const { addDBtoApp } = require('./middlewares/dbConnection');
addDBtoApp(app.context);

const Router = require("koa-router"); // koa is modularized so separate modules for routing, etc.
const appRouter = new Router();

const koaBody = require("koa-body");
// like app.use(express.json()) and app.use(express.urlencoded({ extended: true }))
// for parsing json and urlencoded request bodies
app.use(koaBody());

// sets up a virtual path (e.g. http://site.com/assets) for files (css, js, images, etc.)
// to make publicly available to the client (browser)
// so something like an image in the public folder '/public/images/kitty.jpg' can be
// viewed in the browser at http://site.com/assets/images/kitty.jpg
const serve = require("koa-static");
const mount = require("koa-mount");
const path = require("path");
app.use(mount("/assets", serve(path.join(__dirname, "/public/assets"))));

// logger middleware with format options (good practice)
function logger(format) {
  format = format || ':method ":url"';

  return async function (ctx, next) {
    // we can change this to log whatever information about the ctx (there is a lot)
    const str = format.replace(":method", ctx.method).replace(":url", ctx.url);

    console.log(str);

    await next();// onto the next middleware
  };
}

app.use(logger());
app.use(logger(":method :url"));// set the format of logger responses

// bring in auth (login, register) routes
const authRouter = require('./routes/auth');
// even routes are middleware, register them
app.use(authRouter.routes());
// request verbs not defined for a given to path will respond 'method not allowed'
app.use(authRouter.allowedMethods());

// A Koa Context encapsulates node's request and response objects into a single object
// for example, ctx.request, ctx.response, ctx.body
appRouter // are there chainable route handlers (same path) like in express???
  .get("/hello", async (ctx) => {
    // .status useful when we start dealing with various server responses
    // 200 - OK
    // 400 - Bad Request - general server error
    // 404 - Not Found - the server can't find the requested resource
    // 401 - Unauthorized - lacks authentication
    // 403 - Forbidden - lacks authorization (has been authenticated but not authorized for this resource)
    // 500 - Internal Server Error - generic response when no other error code is suitable

    // to get query parameters - e.g. http://localhost/hello?id=5&username=imi
    console.log("query params: ", ctx.query);
    ctx.status = 200;
    // ctx.body references the response body
    ctx.body = "Hello";
    //ctx.body = JSON.stringify({ hello: "world" });
  })

  // important: GET, POST, PUT, DELETE are just conventions.
  // one can still send a body to a GET endpoint and process it,
  // but this IS NOT best practice

  // send a post request (postman) using body as either
  // "raw" application/json or application/x-www-form-urlencoded
  .post("/hello", async (ctx) => {
    ctx.status = 201; // created status
    ctx.body = ctx.request.body; // send back whatever was sent
  })
  .put("/hello", async (ctx) => {})
  .delete("/hello", async (ctx) => {});

// app.use(async (ctx) => {
//     if ('/' == ctx.path) return ctx.body = 'Try GET /package.json';
//     await send(ctx, ctx.path);
//     })

const send = require("koa-send");
appRouter.get("/hello/world", async (ctx) => {
  // if we want to serve a static file within an endpoint,
  await send(ctx, "/public/index.html");
});

appRouter.get("/hello-world/:id", (ctx) => {
  // find record in db by id
  // return the json object
  ctx.type = 'application/json';// unless set, a string response will be plain text
  ctx.body = JSON.stringify({ id: ctx.params.id });
});


//app.use(require('./middlewares/dbConnection'));
const jwt = require('koa-jwt');// a koa middleware for handling the jwt verify
// to verify the jwt on all routes, use middleware like this:
// app.use(jwt({ secret: process.env.SECRET_KEY }));

// to use 'key' option if you prefer to use another ctx key for the decoded data
// app.use(jwt({ secret: process.env.SECRET_KEY, key: 'jwtData' }));

// to use the jwt (verify) middleware on this route only, provide as an argument
appRouter.get('/users', jwt({ secret: process.env.SECRET_KEY }), async (ctx) => {
    // if the token is valid the middleware allowed us to reach the route
    // and we have access to the user object (with id property) for queries
    console.log('the user id is : ', ctx.state.user.id);
    try {
        const [results] = await ctx.db.query("SELECT * FROM user");
        ctx.body = results;
    } catch (err) {
        console.error(err);
        ctx.body = { error: err.message };
    }
});


app.use(appRouter.routes()); //apply the routes to the application

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
