const request = require('supertest');
const app = require('../src/app');

describe('🌐 API Geral', () => {
  describe('GET /api/test', () => {
    it('deve retornar status da API', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('VendaTech API funcionando!');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Rota não encontrada', () => {
    it('deve retornar erro 404 para rota inexistente', async () => {
      const response = await request(app)
        .get('/api/rota-inexistente')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Rota não encontrada');
    });
  });

  describe('CORS', () => {
    it('deve incluir headers CORS', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
