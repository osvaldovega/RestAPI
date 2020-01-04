const dotenv = require('dotenv');
const app = require('../src/app');

dotenv.config();

(async () => {
  const service = app();
  try {
    await service.setupLogger();
    await service.validateEnvironment();
    await service.setupMongoDB();
    await service.setupServerAPI();
    // await service.createService();
    // await service.startService();
  } catch (error) {
    process.exit(1);
  }
})();
