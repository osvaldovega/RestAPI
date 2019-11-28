const app = require('../app');

const setup = async () => {
  const service = app('LinderaServer');

  try {
    await service.setupLogger();
    await service.validateEnvironment();
    await service.setupMongoDB();
    await service.setupExpress();
    await service.createService();
    await service.startService();
  }
  catch (error) {
    process.exit(1);
  }
};

setup();
