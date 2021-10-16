import mysqlPool from '../database/dbPool';

const addDBtoApp = async (context) => {
    const connection = await mysqlPool.getConnection();
    connection.config.namedPlaceholders = true;
    context.db = connection;
};

// we don't need this middleware bc we've now applied the db to 
// the application context at the very start, but for instructional purposes
// we will use this in authController (i.e. access to db in ctx.state.db)
const dbConnection = async (ctx, next) => {
    // get a connection from the pool
    const connection = await mysqlPool.getConnection();
    connection.config.namedPlaceholders = true;
    ctx.state.db = connection;
    // next is used to pass execution to the next function 
    // in the middleware stack. to skip the rest of the middleware 
    // functions use next('route') to jump to the route function
    await next();
};

export { addDBtoApp, dbConnection };
