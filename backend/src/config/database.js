const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error.message);
    // Não matar o processo na Vercel, apenas logar o erro
    console.error('Continuando sem conexão com o banco...');
  }
};

module.exports = connectDB;
