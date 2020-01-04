/**
 * Response time header middleware
 * @return {function} Koa Middleware
 */
const responseTime = () => async (ctx, next) => {
  const start = Date.now();
  await next();
  const time = Date.now() - start;
  ctx.set(`rest-api-response-time ${time}ms`);
};

module.exports = responseTime;
