"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.config();
var mysql = require("mysql2/promise");
// using environment variables injected from .env file
// create a connection pool to the mysql server
var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
exports.default = pool;
//# sourceMappingURL=dbPool.js.map