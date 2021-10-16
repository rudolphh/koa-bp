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
exports.register = exports.login = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.config();
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
var seeder_1 = require("../seeder");
var createTokens = function (payload) {
    //jwt.sign takes a payload, most often string or object,
    // a secret key we grab from our user defined (.env) environment variables
    // and some options like 'expiresIn' for when the token will be invalid
    var token = jsonwebtoken_1.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "10m",
    });
    var refresh_token = jsonwebtoken_1.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "30m",
    });
    return [token, refresh_token];
};
// handler for login route
var login = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, results, user, passwordMatching, _b, token, refresh_token, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = ctx.request.body, username = _a.username, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                if (!username || !password)
                    throw new Error("no username or password given");
                return [4 /*yield*/, ctx.state.db.query("SELECT * FROM user WHERE username=:username", { username: username })];
            case 2:
                results = (_c.sent())[0];
                if (results.length === 0)
                    throw new Error("username or password are invalid");
                user = results[0];
                return [4 /*yield*/, bcrypt_1.compare(password, user.password)];
            case 3:
                passwordMatching = _c.sent();
                if (!passwordMatching)
                    throw new Error("username or password are invalid");
                _b = createTokens({ id: user.id }), token = _b[0], refresh_token = _b[1];
                user.password = undefined; // remove password field before sending user info
                ctx.body = { user: user, token: token, refresh_token: refresh_token };
                return [3 /*break*/, 5];
            case 4:
                err_1 = _c.sent();
                console.error(err_1);
                ctx.body = { error: err_1.message };
                return [3 /*break*/, 5];
            case 5:
                // release the db connection given from the pool in dbConnection middleware
                ctx.state.db.release();
                return [2 /*return*/];
        }
    });
}); };
exports.login = login;
// handler for register route
var register = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, insertedId, _b, token, refresh_token, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = ctx.request.body, username = _a.username, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                if (!username || !password)
                    throw new Error("no username or password given");
                return [4 /*yield*/, seeder_1.createUser(ctx.state.db, username, password)];
            case 2:
                insertedId = _c.sent();
                if (!insertedId)
                    throw new Error("Username already exists");
                _b = createTokens({ id: insertedId }), token = _b[0], refresh_token = _b[1];
                ctx.status = 201;
                ctx.body = { id: insertedId, token: token, refresh_token: refresh_token };
                return [3 /*break*/, 4];
            case 3:
                err_2 = _c.sent();
                console.error(err_2);
                ctx.body = { error: err_2.message };
                return [3 /*break*/, 4];
            case 4:
                ctx.state.db.release();
                return [2 /*return*/];
        }
    });
}); };
exports.register = register;
//# sourceMappingURL=authController.js.map