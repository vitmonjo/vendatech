const app = require('./src/app');
const connectDB = require('./src/config/database');

// Conectar ao banco de dados
connectDB();

// Para Vercel, não precisamos de app.listen()
// A Vercel gerencia isso automaticamente

module.exports = app;
