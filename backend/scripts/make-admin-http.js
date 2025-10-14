const axios = require('axios');

async function makeUserAdmin() {
  try {
    console.log('🔐 Fazendo login como vitmonjo@gmail.com...');
    
    // Primeiro, fazer login para obter o token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'vitmonjo@gmail.com',
      password: '123456' // Assumindo que a senha é 123456
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login realizado com sucesso!');

    // Agora fazer a requisição para tornar admin
    console.log('👑 Tornando usuário administrador...');
    
    const adminResponse = await axios.put('http://localhost:5000/api/auth/make-admin', {
      email: 'vitmonjo@gmail.com'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Usuário vitmonjo@gmail.com agora é administrador!');
    console.log('👤 Dados do usuário:');
    console.log(`   Nome: ${adminResponse.data.data.user.name}`);
    console.log(`   Email: ${adminResponse.data.data.user.email}`);
    console.log(`   Admin: ${adminResponse.data.data.user.isAdmin}`);
    
  } catch (error) {
    if (error.response) {
      console.error('❌ Erro da API:', error.response.data);
    } else {
      console.error('❌ Erro:', error.message);
    }
  }
}

makeUserAdmin();
