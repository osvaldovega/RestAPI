const supertest = require('supertest');
const app = require('../src/app');

const setup = async () => {
  const service = app('LinderaServer');
  let api = null;
  try {
    await service.setupLogger();
    await service.validateEnvironment();
    await service.setupMongoDB();
    await service.setupExpress();
    await service.createService();
    api = await service.startService();
    return api;
  } catch (error) {
    return process.exit(1);
  }
};

const api = supertest(setup());


describe('API', () => {
  it('GET /health', async (done) => {
    const response = await api.get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toBe({});
    done();
  });

  it('GET unknown route /testing', async (done) => {
    const response = await api.get('/testing');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route unknown');
    done();
  });
});
