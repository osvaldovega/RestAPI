const dotenv = require('dotenv');
const app = require('../app');

dotenv.config();

const setup = async () => {
  const service = app();
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
