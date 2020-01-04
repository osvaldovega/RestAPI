/**
 * Error handler middleware
 * @return {function} Koa Middleware
 */
const errorHandler = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = ctx.status === 400 ? { error: 'Not Found' } : { error: 'Internal Server Error' };
    ctx.app.emit('error', error, ctx);
  }
};

module.exports = errorHandler;
