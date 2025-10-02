const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Carregar configurações de teste
require('./config');

let mongoServer;

// Configurar banco de dados em memória para testes
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Limpar banco de dados após cada teste
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Fechar conexão após todos os testes
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
