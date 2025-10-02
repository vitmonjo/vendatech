# 🛒 Sales App - Sistema de Vendas

Sistema completo de e-commerce com frontend Angular e backend Node.js.

## 📁 Estrutura do Projeto

```
salesapp-angular-material/
├── frontend/          # Aplicação Angular (Equipe Frontend)
│   ├── src/
│   ├── package.json
│   └── angular.json
├── backend/           # API Node.js (Equipe Backend)
│   ├── index.js
│   ├── package.json
│   └── README.md
└── README.md          # Este arquivo
```

## 🚀 Tecnologias

### Frontend
- Angular 20
- Angular Material
- TypeScript
- RxJS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 👥 Equipes

- **Frontend Team**: Desenvolve a interface Angular
- **Backend Team**: Desenvolve a API Node.js

## 🛠️ Como Executar

### Frontend (Porta 4200)
```bash
cd frontend
npm install
npm start
```

### Backend (Porta 5000)
```bash
cd backend
npm install
npm run dev
```

## 📋 Funcionalidades

- ✅ Sistema de autenticação
- ✅ Catálogo de produtos
- ✅ Carrinho de compras
- ✅ Sistema de pagamentos
- ✅ Chat entre usuários
- ✅ Alertas de preço

## 🔗 Integração

O frontend consome as APIs do backend através de HTTP requests.
As URLs base são configuradas nos services do Angular.

## 📝 Desenvolvimento

As equipes podem trabalhar em paralelo:
- Frontend: Desenvolve componentes e services
- Backend: Desenvolve APIs e lógica de negócio