# 🚀 Deploy na Vercel - Guia Atualizado (CORRIGIDO)

## ✅ **Problema Resolvido:**
- ❌ Frontend tentando acessar `localhost:5000` em produção
- ✅ Agora usa configuração de ambiente dinâmica

## 🎯 **Passo a Passo - Deploy em 10 minutos:**

### **1. Fazer Commit das Correções (2 min)**

```bash
# Fazer commit das correções
git add .
git commit -m "Correção: Configuração de ambiente para produção"
git push origin master
```

### **2. Deploy do Backend (3 min)**

1. **Acesse**: https://vercel.com
2. **Clique em "New Project"**
3. **Importe seu repositório**
4. **Configure o projeto:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (deixar vazio)
   - **Install Command**: `npm install`

5. **Adicionar Variáveis de Ambiente:**
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://vitmonjo_db:XYfD9Rermgd3vx1L@vendatech-cluster.9slpe4o.mongodb.net/vendatech?retryWrites=true&w=majority&appName=vendatech-cluster`
   - `JWT_SECRET` = `vendatech_super_secret_key_2025_production`
   - `JWT_EXPIRE` = `7d`
   - `FRONTEND_URL` = `https://seu-frontend.vercel.app` (vamos configurar depois)

6. **Clique em "Deploy"**
7. **ANOTE A URL DO BACKEND** (ex: `https://backend-abc123.vercel.app`)

### **3. Deploy do Frontend (3 min)**

1. **Clique em "New Project" novamente**
2. **Importe o mesmo repositório**
3. **Configure o projeto:**
   - **Framework Preset**: Angular
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build:prod`
   - **Output Directory**: `dist/sales-app/browser`
   - **Install Command**: `npm install`

4. **Adicionar Variável de Ambiente:**
   - `API_URL` = `https://seu-backend.vercel.app/api` (URL do backend que você anotou)

5. **Clique em "Deploy"**
6. **ANOTE A URL DO FRONTEND** (ex: `https://frontend-xyz789.vercel.app`)

### **4. Configurar URLs Finais (2 min)**

1. **Volte ao backend na Vercel:**
   - **Settings** → **Environment Variables**
   - **Edite `FRONTEND_URL`** com a URL do frontend
   - **Redeploy**

2. **Volte ao frontend na Vercel:**
   - **Settings** → **Environment Variables**
   - **Edite `API_URL`** com a URL do backend
   - **Redeploy**

## 🎉 **Pronto! Sua aplicação está online!**

### **URLs:**
- **Frontend**: `https://seu-frontend.vercel.app`
- **Backend API**: `https://seu-backend.vercel.app/api`

### **Testando:**
1. **Acesse a URL do frontend**
2. **Teste o login/registro**
3. **Teste a criação de produtos**
4. **Teste o carrinho de compras**

## 🔧 **O que foi corrigido:**

### ✅ **Configuração de Ambiente:**
- `frontend/src/environments/environment.ts` - Desenvolvimento
- `frontend/src/environments/environment.prod.ts` - Produção
- Script automático para atualizar URL da API

### ✅ **Serviços Atualizados:**
- `AuthService` - Usa `environment.apiUrl`
- `ProductService` - Usa `environment.apiUrl`
- Build automático com URL correta

### ✅ **Deploy Otimizado:**
- Build command atualizado
- Variáveis de ambiente configuradas
- URLs dinâmicas

## 🚨 **Troubleshooting:**

### **Erro de CORS:**
- Verifique se `FRONTEND_URL` está correto no backend
- Verifique se `API_URL` está correto no frontend

### **Erro de Build:**
- Verifique se todas as dependências estão no `package.json`
- Verifique se o script `update-api-url.js` está funcionando

### **Erro de MongoDB:**
- Verifique se a string de conexão está correta
- Verifique se o IP está liberado no Atlas

## 📞 **Suporte:**
- **Vercel Docs**: https://vercel.com/docs
- **Discord Vercel**: https://vercel.com/discord
- **GitHub Issues**: Para problemas específicos do projeto

---

## 🎯 **Resumo das Correções:**

✅ **Configuração de ambiente** para desenvolvimento e produção  
✅ **Script automático** para atualizar URL da API  
✅ **Serviços atualizados** para usar configuração de ambiente  
✅ **Build otimizado** para produção  
✅ **Guia completo** de deploy corrigido  

**Agora o frontend vai se conectar corretamente ao backend em produção!** 🚀
