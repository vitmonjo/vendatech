const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

describe('🛍️ Produtos API', () => {
  let authToken;
  let adminToken;

  beforeEach(async () => {
    // Criar usuário comum
    const user = await User.create({
      name: 'Usuário Teste',
      email: 'teste@test.com',
      password: '123456'
    });

    // Criar usuário admin
    const admin = await User.create({
      name: 'Admin Teste',
      email: 'admin@test.com',
      password: '123456',
      isAdmin: true
    });

    // Gerar tokens
    const jwt = require('jsonwebtoken');
    authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test-secret');
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'test-secret');
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Criar produtos de teste
      await Product.create([
        {
          name: 'Smartphone XYZ',
          description: 'Smartphone moderno',
          price: 1200.00,
          category: 'eletrônicos',
          stock: 10
        },
        {
          name: 'Camiseta Azul',
          description: 'Camiseta confortável',
          price: 50.00,
          category: 'roupas',
          stock: 20
        },
        {
          name: 'Livro de Programação',
          description: 'Livro sobre JavaScript',
          price: 80.00,
          category: 'livros',
          stock: 5
        }
      ]);
    });

    it('deve listar todos os produtos', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(3);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('deve filtrar produtos por categoria', async () => {
      const response = await request(app)
        .get('/api/products?category=eletrônicos')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].category).toBe('eletrônicos');
    });

    it('deve buscar produtos por nome', async () => {
      const response = await request(app)
        .get('/api/products?search=Smartphone')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].name).toContain('Smartphone');
    });

    it('deve paginar resultados', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
      expect(response.body.data.pagination.current).toBe(1);
      expect(response.body.data.pagination.pages).toBe(2);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Produto Teste',
        description: 'Descrição do produto',
        price: 100.00,
        category: 'eletrônicos',
        stock: 5
      });
      productId = product._id;
    });

    it('deve retornar produto por ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.product.name).toBe('Produto Teste');
    });

    it('deve retornar erro para ID inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Produto não encontrado');
    });
  });

  describe('POST /api/products', () => {
    it('deve criar produto como admin', async () => {
      const productData = {
        name: 'Novo Produto',
        description: 'Descrição do novo produto',
        price: 200.00,
        category: 'eletrônicos',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Produto criado com sucesso');
      expect(response.body.data.product.name).toBe('Novo Produto');
    });

    it('deve retornar erro ao criar produto sem autenticação', async () => {
      const productData = {
        name: 'Novo Produto',
        description: 'Descrição do novo produto',
        price: 200.00,
        category: 'eletrônicos',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token de acesso necessário');
    });

    it('deve retornar erro ao criar produto como usuário comum', async () => {
      const productData = {
        name: 'Novo Produto',
        description: 'Descrição do novo produto',
        price: 200.00,
        category: 'eletrônicos',
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Apenas administradores');
    });

    it('deve retornar erro com dados inválidos', async () => {
      const productData = {
        name: '', // Nome vazio
        description: 'Descrição',
        price: -100, // Preço negativo
        category: 'categoria-invalida', // Categoria inválida
        stock: -5 // Estoque negativo
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dados inválidos');
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Produto Original',
        description: 'Descrição original',
        price: 100.00,
        category: 'eletrônicos',
        stock: 5
      });
      productId = product._id;
    });

    it('deve atualizar produto como admin', async () => {
      const updateData = {
        name: 'Produto Atualizado',
        description: 'Descrição atualizada',
        price: 150.00,
        category: 'eletrônicos',
        stock: 10
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Produto atualizado com sucesso');
      expect(response.body.data.product.name).toBe('Produto Atualizado');
    });

    it('deve retornar erro ao atualizar produto inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Produto Atualizado',
        description: 'Descrição atualizada',
        price: 150.00,
        category: 'eletrônicos',
        stock: 10
      };

      const response = await request(app)
        .put(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Produto não encontrado');
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Produto para Deletar',
        description: 'Este produto será deletado',
        price: 100.00,
        category: 'eletrônicos',
        stock: 5
      });
      productId = product._id;
    });

    it('deve deletar produto como admin', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Produto deletado com sucesso');

      // Verificar se produto foi deletado
      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    it('deve retornar erro ao deletar produto inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Produto não encontrado');
    });
  });
});
