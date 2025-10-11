const express = require('express');
const cors = require('cors');

const app = express();

// CORS configurado para permitir todas as origens
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para parsing de JSON
app.use(express.json());

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'VendaTech API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota de produtos (dados de teste)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    message: 'Produtos carregados com sucesso',
    data: {
      products: [
        {
          _id: '1',
          name: 'Produto Teste 1',
          description: 'Descrição do produto teste 1',
          price: 99.99,
          category: 'eletronicos',
          image: 'https://via.placeholder.com/300x200'
        },
        {
          _id: '2',
          name: 'Produto Teste 2',
          description: 'Descrição do produto teste 2',
          price: 149.99,
          category: 'roupas',
          image: 'https://via.placeholder.com/300x200'
        }
      ],
      total: 2,
      page: 1,
      limit: 10
    }
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
