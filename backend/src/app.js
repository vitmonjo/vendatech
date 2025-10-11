const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar rotas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

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

// Rota de teste para produtos (sem banco)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    message: 'Produtos carregados com sucesso',
    data: {
      products: [
        {
          _id: '1',
          name: 'Produto Teste',
          description: 'Descrição do produto teste',
          price: 99.99,
          category: 'teste'
        }
      ],
      total: 1,
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
