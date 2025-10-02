# Sales App - Backend

Backend API para o sistema de vendas Sales App.

## 🚀 Tecnologias

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt para hash de senhas

## 📋 APIs Planejadas

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Produto por ID
- `POST /api/products` - Criar produto (protegido)
- `PUT /api/products/:id` - Atualizar produto (protegido)
- `DELETE /api/products/:id` - Deletar produto (protegido)

### Pagamentos
- `POST /api/payments/process` - Processar pagamento
- `GET /api/payments/history` - Histórico de pagamentos
- `GET /api/cards` - Cartões do usuário (protegido)

### Mensagens
- `GET /api/messages/:productId` - Mensagens do produto
- `POST /api/messages` - Enviar mensagem
- `GET /api/messages/conversations` - Conversas do usuário

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

## 📝 Notas

Este backend será desenvolvido em paralelo com o frontend Angular.
