# 🚀 Guia de Desenvolvimento - Sales App

## 📁 Estrutura do Projeto

```
salesapp-angular-material/
├── frontend/          # 👥 Equipe Frontend (Angular)
├── backend/           # 👥 Equipe Backend (Node.js)
└── README.md
```

## 👥 Para a Equipe Frontend

### 📍 Localização
Trabalhem na pasta `frontend/`

### 🛠️ Como começar
```bash
cd frontend
npm install
npm start
```

### 🔗 URLs das APIs (para atualizar nos services)
- **Atual**: `http://localhost:3000/`
- **Nova**: `http://localhost:5000/api/`

### 📋 Services que precisam ser atualizados
- `src/app/services/auth.service.ts`
- `src/app/services/product.service.ts`
- `src/app/services/payment.service.ts`
- `src/app/services/message.service.ts`

### 🎯 Tarefas da Equipe Frontend
1. ✅ **Já implementado**: Login, produtos, carrinho, pagamento
2. 🔄 **Para ajustar**: URLs das APIs nos services
3. 🔄 **Para melhorar**: Conectar carrinho ao sistema de pagamento
4. 🔄 **Para adicionar**: Guards de autenticação nas rotas

---

## 👥 Para a Equipe Backend

### 📍 Localização
Trabalhem na pasta `backend/`

### 🛠️ Como começar
```bash
cd backend
npm install
npm run dev
```

### 📋 APIs a implementar

#### 🔐 Autenticação
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

#### 🛍️ Produtos
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (protegido)
- `PUT /api/products/:id` (protegido)
- `DELETE /api/products/:id` (protegido)

#### 💳 Pagamentos
- `POST /api/payments/process`
- `GET /api/payments/history`
- `GET /api/cards` (protegido)

#### 💬 Mensagens
- `GET /api/messages/:productId`
- `POST /api/messages`
- `GET /api/messages/conversations`

### 🗄️ Banco de Dados
- **MongoDB** com as collections: Users, Products, Cards, Payments, Messages

---

## 🔄 Integração

### Frontend → Backend
- Frontend faz requisições HTTP para `http://localhost:5000/api/`
- Backend responde com JSON

### Backend → Frontend
- Backend fornece APIs REST
- Frontend consome as APIs através dos services

---

## 📞 Comunicação entre Equipes

1. **Backend**: Implemente as APIs conforme especificado
2. **Frontend**: Atualize as URLs nos services quando o backend estiver pronto
3. **Testes**: Testem a integração completa

---

## 🎯 Próximos Passos

1. **Backend**: Começar com autenticação
2. **Frontend**: Ajustar URLs e testar integração
3. **Ambos**: Testar fluxo completo de compra
