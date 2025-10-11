const app = require('./src/app');
const connectDB = require('./src/config/database');

// Conectar ao banco de dados
connectDB();

// Para Render, precisamos expor a porta
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 VendaTech Backend rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
});

module.exports = app;
