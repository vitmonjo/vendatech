// Configurações para testes
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.JWT_EXPIRE = '1d';
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'http://localhost:4200';
