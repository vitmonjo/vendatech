# 🎯 PLANO DE IMPLEMENTAÇÃO - VENDA TECH BACKEND

## 📋 **REQUISITOS SIMPLIFICADOS**

### **✅ O que vamos implementar:**
1. **🔐 Sistema de Autenticação**
   - Login/Registro de usuários
   - JWT para autenticação
   - Campo `isAdmin` para administradores

2. **🛍️ CRUD de Produtos**
   - Listar produtos (público)
   - Criar/Editar/Deletar produtos (admin)
   - Upload de imagens

3. **👑 Área Administrativa**
   - Middleware para verificar `isAdmin`
   - Rotas protegidas para admins
   - Gerenciamento completo de produtos

### **❌ O que vamos pular:**
- ❌ Sistema de cartões
- ❌ Processamento de pagamentos
- ❌ Chat/Mensagens entre usuários
- ❌ Comentários nos produtos

## 🏗️ **ESTRUTURA SIMPLIFICADA**

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Login/Registro
│   │   └── productController.js   # CRUD Produtos
│   ├── models/
│   │   ├── User.js               # Schema do usuário
│   │   └── Product.js            # Schema do produto
│   ├── routes/
│   │   ├── auth.js               # Rotas de autenticação
│   │   └── products.js           # Rotas de produtos
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticação
│   │   └── admin.js             # Middleware de admin
│   └── app.js                   # Configuração Express
├── .env                         # Variáveis de ambiente
└── package.json
```

## 🚀 **PLANO DE IMPLEMENTAÇÃO**

### **FASE 1: Setup (1 dia)**
```bash
# Dependências necessárias
npm install mongoose bcryptjs jsonwebtoken cors dotenv express-validator helmet morgan
npm install -D nodemon
```

### **FASE 2: Autenticação (2-3 dias)**
**APIs:**
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

**Funcionalidades:**
- Hash de senhas
- JWT tokens
- Campo `isAdmin` no usuário

### **FASE 3: Produtos (2-3 dias)**
**APIs:**
- `GET /api/products` - Listar produtos (público)
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Editar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

### **FASE 4: Área Admin (1-2 dias)**
**Funcionalidades:**
- Middleware para verificar admin
- Rotas protegidas
- Interface administrativa

## 📊 **CRONOGRAMA SIMPLIFICADO**

| Fase | Duração | Entregáveis |
|------|---------|-------------|
| **Setup** | 1 dia | Projeto configurado |
| **Auth** | 2-3 dias | Login/Registro funcionando |
| **Products** | 2-3 dias | CRUD de produtos |
| **Admin** | 1-2 dias | Área administrativa |
| **TOTAL** | **6-9 dias** | **Sistema completo** |

## 🎯 **APIS NECESSÁRIAS**

### **Autenticação**
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

### **Produtos**
- `GET /api/products` - Listar produtos (público)
- `GET /api/products/:id` - Produto por ID (público)
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Editar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

## 🗄️ **SCHEMAS MONGODB**

### **User Schema**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### **Product Schema**
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 **DEPENDÊNCIAS**

### **Produção**
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- helmet
- morgan

### **Desenvolvimento**
- nodemon

## 📝 **NOTAS**

- Foco na simplicidade
- Autenticação JWT
- Middleware de admin
- CRUD básico de produtos
- Sem pagamentos por enquanto
- Sem chat/mensagens
