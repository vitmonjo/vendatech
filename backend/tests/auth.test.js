const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('🔐 Autenticação API', () => {
  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com dados válidos', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@test.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Usuário registrado com sucesso');
      expect(response.body.data.user.name).toBe('João Silva');
      expect(response.body.data.user.email).toBe('joao@test.com');
      expect(response.body.data.user.isAdmin).toBe(false);
      expect(response.body.data.token).toBeDefined();
    });

    it('deve retornar erro ao tentar registrar com email duplicado', async () => {
      // Criar primeiro usuário
      await User.create({
        name: 'Usuário Existente',
        email: 'existente@test.com',
        password: '123456'
      });

      const userData = {
        name: 'Novo Usuário',
        email: 'existente@test.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuário já existe com este email');
    });

    it('deve retornar erro com dados inválidos', async () => {
      const userData = {
        name: 'A', // Nome muito curto
        email: 'email-invalido', // Email inválido
        password: '123' // Senha muito curta
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dados inválidos');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Criar usuário para teste
      await User.create({
        name: 'Usuário Teste',
        email: 'teste@test.com',
        password: '123456'
      });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const loginData = {
        email: 'teste@test.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login realizado com sucesso');
      expect(response.body.data.user.email).toBe('teste@test.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const loginData = {
        email: 'teste@test.com',
        password: 'senha-errada'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email ou senha inválidos');
    });

    it('deve retornar erro com email inexistente', async () => {
      const loginData = {
        email: 'inexistente@test.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email ou senha inválidos');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;

    beforeEach(async () => {
      // Criar usuário e obter token
      const user = await User.create({
        name: 'Usuário Teste',
        email: 'teste@test.com',
        password: '123456'
      });

      // Simular login para obter token
      const jwt = require('jsonwebtoken');
      authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test-secret');
    });

    it('deve retornar perfil do usuário autenticado', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('teste@test.com');
      expect(response.body.data.user.password).toBeUndefined(); // Senha não deve aparecer
    });

    it('deve retornar erro sem token de autorização', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token de acesso necessário');
    });

    it('deve retornar erro com token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token inválido');
    });
  });
});
