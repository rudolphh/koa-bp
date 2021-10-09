// loads all environment variables in .env file and adds to process.env (system global EVs)
// looks in same directory by default for the .env file
// unless specified in config options object passed into .config()
// example: require('dotenv').config({ path: '/custom/path/to/.env' })
require("dotenv").config();

const Koa = require("koa"); // include koa module (require - CommonJS module system)
const app = new Koa();
const port = process.env.PORT || 3000;

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

// A Koa Context encapsulates node's request and response objects into a single object
// for example, ctx.request, ctx.response, ctx.body 

appRouter // are there chainable route handlers (same path) like in express???
    .get('/hello', async (ctx) => {
        // .status useful when we start dealing with various server responses
        // 200 - OK
        // 400 - Bad Request - general server error
        // 404 - Not Found - the server can't find the requested resource
        // 401 - Unauthorized - lacks authentication
        // 403 - Forbidden - lacks authorization (has been authenticated but not authorized for this resource)
        // 500 - Internal Server Error - generic response when no other error code is suitable

        // to get query parameters - e.g. http://localhost/hello?id=5&username=imi
        console.log(ctx.query);
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
    .post('/hello', async (ctx) => {
        ctx.status = 201;// created status
        ctx.body = ctx.request.body;// send back whatever was sent
    })
    .put('/hello', async (ctx) => {})
    .delete('/hello', async (ctx) => {});


// app.use(async (ctx) => {
//     if ('/' == ctx.path) return ctx.body = 'Try GET /package.json';
//     await send(ctx, ctx.path);
//     })

const send = require('koa-send');
appRouter.get('/hello/world', async (ctx) => {
    // if we want to serve a static file within an endpoint,
    await send(ctx, '/public/index.html');
});

appRouter.get('/hello-world/:id', (ctx) => {
    // find record in db by id
    // return the json object 
    ctx.body = JSON.stringify({ id: ctx.params.id });
});



app.use(appRouter.routes()); //Use the routes defined using the router
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});
