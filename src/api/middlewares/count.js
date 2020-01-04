/**
 * Total object count middleware
 * @return {function} Koa Middleware
 */
const count = () => async (ctx, next) => {
  await next();

  if (ctx.state.data) {
    const counter = await ctx.state.data.count(false);
    ctx.set('rest-api-count', counter);
    ctx.state.count = counter;
  }
};

module.exports = count;
