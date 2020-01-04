const os = require('os');

const all = async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    data: {
      upTime: process.uptime(),
      osFreeMem: os.freemem(),
      serviceMemoryUsage: process.memoryUsage(),
    },
  };
  return ctx;
};

module.exports = {
  all,
};
