const mongoose = require('mongoose');
require('dotenv').config({ path: './env.local' });

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('../src/models/User');

async function makeUserAdmin() {
  try {
    // Buscar o usuário pelo email
    const user = await User.findOne({ email: 'vitmonjo@gmail.com' });
    
    if (!user) {
      console.log('❌ Usuário vitmonjo@gmail.com não encontrado!');
      console.log('📝 Certifique-se de que o usuário foi criado primeiro.');
      return;
    }

    // Tornar o usuário administrador
    user.isAdmin = true;
    await user.save();

    console.log('✅ Usuário vitmonjo@gmail.com agora é administrador!');
    console.log('👤 Dados do usuário:');
    console.log(`   Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Admin: ${user.isAdmin}`);
    
  } catch (error) {
    console.error('❌ Erro ao tornar usuário admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

makeUserAdmin();
