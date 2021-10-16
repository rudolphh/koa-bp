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
exports.createUser = exports.seedDatabase = void 0;
var dbPool_1 = require("./database/dbPool");
var bcrypt = require("bcrypt");
var createUser = function (connection, username, password) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, now, nowString, results, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // enable mysql2 named placeholders syntax
                connection.config.namedPlaceholders = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                now = new Date();
                //adjust for timezone
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                nowString = now.toISOString().slice(0, 19).replace("T", " ");
                return [4 /*yield*/, connection.query("INSERT INTO user (username, password, created_date, updated_date) \n        VALUES (:username, :hashedPassword, :now, :now)", { username: username, hashedPassword: hashedPassword, nowString: nowString })];
            case 3:
                results = (_a.sent())[0];
                return [2 /*return*/, results.insertId];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createUser = createUser;
var seedDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, dbPool_1.default.getConnection()];
            case 1:
                connection = _a.sent();
                // create database schema
                return [4 /*yield*/, connection.query("CREATE DATABASE IF NOT EXISTS koa_bp_db")];
            case 2:
                // create database schema
                _a.sent();
                // drop user table if exists
                return [4 /*yield*/, connection.query("\n        DROP TABLE IF EXISTS user;")];
            case 3:
                // drop user table if exists
                _a.sent();
                // create user table in database
                return [4 /*yield*/, connection.query("\n        CREATE TABLE IF NOT EXISTS user (\n            id INT NOT NULL AUTO_INCREMENT,\n            username VARCHAR(15) UNIQUE NOT NULL,\n            password CHAR(60) NOT NULL,\n            created_date TIMESTAMP,\n            updated_date TIMESTAMP,\n            PRIMARY KEY ( id )\n        );")];
            case 4:
                // create user table in database
                _a.sent();
                // add record to user table
                createUser(connection, "imi", "loveDaddy3");
                createUser(connection, "rudy", "loveGod1");
                createUser(connection, "honey", "loveLove33");
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.error(err_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seeder.js.map