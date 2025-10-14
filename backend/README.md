# 🚀 VendaTech - Backend API

Backend API para o sistema de vendas VendaTech.

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas

## 📋 Funcionalidades

### 🔐 Autenticação
- Registro de usuários
- Login com JWT
- Perfil do usuário
- Sistema de administradores

### 🛍️ Produtos
- Listar produtos (público)
- Criar/Editar/Deletar produtos (admin)
- Filtros por categoria
- Busca por nome/descrição
- Paginação

## 🚀 Como Executar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `env.local` para `.env` e configure:
```bash
cp env.local .env
```

### 3. Executar em desenvolvimento
```bash
npm run dev
```

### 4. Executar em produção
```bash
npm start
```

## 📊 APIs Disponíveis

### Autenticação
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil (protegido)

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Produto por ID
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Editar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

### Teste
- `GET /api/test` - Teste da API

## 🔧 Configuração

### Variáveis de Ambiente
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vendatech
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:4200
```

### MongoDB
Certifique-se de que o MongoDB está rodando:
```bash
# Instalar MongoDB
# Windows: https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── models/         # Schemas MongoDB
│   ├── routes/         # Rotas da API
│   ├── middleware/     # Middlewares
│   ├── config/         # Configurações
│   └── app.js          # Configuração Express
├── docs/               # Documentação
├── .env                # Variáveis de ambiente
└── package.json
```

## 🔐 Autenticação

### Registro
```bash
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Usar Token
```bash
GET /api/auth/profile
Authorization: Bearer <token>
```

## 🛍️ Produtos

### Listar Produtos
```bash
GET /api/products?category=eletrônicos&search=smartphone&page=1&limit=10
```

### Criar Produto (Admin)
```bash
POST /api/products
Authorization: Bearer <admin_token>
{
  "name": "Smartphone XYZ",
  "description": "Smartphone moderno",
  "price": 1200.00,
  "category": "eletrônicos",
  "stock": 50
}
```

## 👑 Área Administrativa

Para acessar funcionalidades administrativas, o usuário deve ter `isAdmin: true`.

### Tornar usuário admin (via MongoDB)
```javascript
db.users.updateOne(
  { email: "admin@email.com" },
  { $set: { isAdmin: true } }
)
```

## 📝 Desenvolvimento

### Scripts Disponíveis
- `npm start` - Executar em produção
- `npm run dev` - Executar em desenvolvimento
- `npm test` - Executar testes

### Logs
O servidor usa Morgan para logging. Em desenvolvimento, todos os requests são logados.

## 🔗 Integração com Frontend

O backend está configurado para aceitar requests do frontend Angular em `http://localhost:4200`.

### CORS
```javascript
cors({
  origin: 'http://localhost:4200',
  credentials: true
})
```

## 📊 Status da API

- ✅ Autenticação completa
- ✅ CRUD de produtos
- ✅ Sistema de admin
- ✅ Validações
- ✅ Tratamento de erros
- ✅ Logging
- ✅ Segurança (Helmet, CORS)
