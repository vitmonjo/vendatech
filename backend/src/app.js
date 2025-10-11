const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Importar rotas (comentadas temporariamente)
// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');

const app = express();

// Middlewares de segurança
app.use(helmet());

// CORS configurado para permitir todas as origens
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para lidar com preflight requests
app.options('*', cors());

// Middleware de logging
app.use(morgan('combined'));

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'VendaTech API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de produtos (dados de teste - sempre funciona)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    message: 'Produtos carregados com sucesso',
    data: {
      products: [
        {
          _id: '1',
          name: 'Smartphone Samsung Galaxy',
          description: 'Smartphone Samsung Galaxy S23 com 128GB',
          price: 1299.99,
          category: 'eletronicos',
          image: 'https://via.placeholder.com/300x200',
          isActive: true
        },
        {
          _id: '2',
          name: 'Notebook Dell Inspiron',
          description: 'Notebook Dell Inspiron 15 com Intel i5',
          price: 2499.99,
          category: 'eletronicos',
          image: 'https://via.placeholder.com/300x200',
          isActive: true
        },
        {
          _id: '3',
          name: 'Camiseta Nike',
          description: 'Camiseta Nike Dry Fit Masculina',
          price: 89.99,
          category: 'roupas',
          image: 'https://via.placeholder.com/300x200',
          isActive: true
        }
      ],
      total: 3,
      page: 1,
      limit: 10
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

module.exports = app;
