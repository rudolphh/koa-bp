"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// loads all environment variables in .env file and adds to process.env (system global EVs)
// looks in same directory by default for the .env file
// unless specified in config options object passed into .config()
// example: dotenv.config({ path: '/custom/path/to/.env' })
var dotenv = require("dotenv");
var Koa = require("koa"); // include koa module (require - CommonJS module system)
var koaBody = require("koa-body");
var jwt = require("koa-jwt"); // a koa middleware for handling the jwt verify
var mount = require("koa-mount");
var Router = require("koa-router"); // koa is modularized so separate modules for routing, etc.
var send = require("koa-send");
var serve = require("koa-static");
var path = require("path");
var auth_1 = require("./routes/auth");
var seeder_1 = require("./seeder");
var dbConnection_1 = require("./middlewares/dbConnection");
dotenv.config();
// created this function to seed our mysql database with some user data
seeder_1.seedDatabase();
var app = new Koa();
// this function will add the db to the context object (i.e. ctx.db)
// instead of adding the db connection object in middleware (i.e. ctx.state.db)
// may be more performant (no middleware) and/or easier (fewer require(s)) at the expense 
// of relying more on ctx, which could be considered an anti-pattern.
dbConnection_1.addDBtoApp(app.context);
var appRouter = new Router();
// like app.use(express.json()) and app.use(express.urlencoded({ extended: true }))
// for parsing json and urlencoded request bodies
app.use(koaBody());
// sets up a virtual path (e.g. http://site.com/assets) for files (css, js, images, etc.)
// to make publicly available to the client (browser)
// so something like an image in the public folder '/public/images/kitty.jpg' can be
// viewed in the browser at http://site.com/assets/images/kitty.jpg
app.use(mount("/assets", serve(path.join(__dirname, "/public/assets"))));
// logger middleware with format options (good practice)
function logger(format) {
    if (format === void 0) { format = ''; }
    format = format || ':method ":url"';
    return function (ctx, next) {
        return __awaiter(this, void 0, void 0, function () {
            var str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        str = format.replace(":method", ctx.method).replace(":url", ctx.url);
                        console.log(str);
                        return [4 /*yield*/, next()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
}
app.use(logger());
app.use(logger(":method :url"));
// A Koa Context encapsulates node's request and response objects into a single object
// for example, ctx.request, ctx.response, ctx.body
appRouter // are there chainable route handlers (same path) like in express???
    .get("/hello", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
        return [2 /*return*/];
    });
}); })
    // important: GET, POST, PUT, DELETE are just conventions.
    // one can still send a body to a GET endpoint and process it,
    // but this IS NOT best practice
    // send a post request (postman) using body as either
    // "raw" application/json or application/x-www-form-urlencoded
    .post("/hello", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.status = 201; // created status
        ctx.body = ctx.request.body; // send back whatever was sent
        return [2 /*return*/];
    });
}); })
    .put("/hello", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); })
    .delete("/hello", function (ctx) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
// app.use(async (ctx) => {
//     if ('/' == ctx.path) return ctx.body = 'Try GET /package.json';
//     await send(ctx, ctx.path);
//     })
appRouter.get("/hello/world", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // if we want to serve a static file within an endpoint,
            return [4 /*yield*/, send(ctx, "/public/index.html")];
            case 1:
                // if we want to serve a static file within an endpoint,
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
appRouter.get("/hello-world/:id", function (ctx) {
    // find record in db by id
    // return the json object
    ctx.type = 'application/json';
    ctx.body = JSON.stringify({ id: ctx.params.id });
});
//app.use(require('./middlewares/dbConnection'));
// to verify the jwt on all routes, use middleware like this:
// app.use(jwt({ secret: process.env.SECRET_KEY }));
// to use 'key' option if you prefer to use another ctx key for the decoded data
// app.use(jwt({ secret: process.env.SECRET_KEY, key: 'jwtData' }));
// to use the jwt (verify) middleware on this route only, provide as an argument
appRouter.get('/users', jwt({ secret: process.env.SECRET_KEY }), function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var results, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // if the token is valid the middleware allowed us to reach the route
                // and we have access to the user object (with id property) for queries
                console.log('the user id is : ', ctx.state.user.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ctx.db.query("SELECT * FROM user")];
            case 2:
                results = (_a.sent())[0];
                ctx.body = results;
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error(err_1);
                ctx.body = { error: err_1.message };
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// bring in auth (login, register) routes
app.use(auth_1.default.routes());
app.use(auth_1.default.allowedMethods());
app.use(appRouter.routes()); //apply the routes to the application
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("listening on port " + port);
});
//# sourceMappingURL=server.js.map