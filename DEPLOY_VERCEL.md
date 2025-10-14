# 🚀 Deploy na Vercel - Guia Completo

## ✅ **Pré-requisitos:**
- ✅ Projeto no GitHub
- ✅ MongoDB Atlas configurado
- ✅ Arquivos de configuração criados

## 🎯 **Passo a Passo - Deploy em 10 minutos:**

### **1. Preparar o Repositório (2 min)**

```bash
# Fazer commit dos arquivos de configuração
git add .
git commit -m "Configuração para deploy na Vercel"
git push origin master
```

### **2. Criar Conta na Vercel (2 min)**

1. **Acesse**: https://vercel.com
2. **Clique em "Sign Up"**
3. **Escolha "Continue with GitHub"**
4. **Autorize a Vercel a acessar seus repositórios**

### **3. Deploy do Backend (3 min)**

1. **Clique em "New Project"**
2. **Importe seu repositório**
3. **Configure o projeto:**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (deixar vazio)
   - **Install Command**: `npm install`

4. **Adicionar Variáveis de Ambiente:**
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://vitmonjo_db:XYfD9Rermgd3vx1L@vendatech-cluster.9slpe4o.mongodb.net/vendatech?retryWrites=true&w=majority&appName=vendatech-cluster`
   - `JWT_SECRET` = `vendatech_super_secret_key_2025_production`
   - `JWT_EXPIRE` = `7d`
   - `FRONTEND_URL` = `https://seu-frontend.vercel.app` (vamos configurar depois)

5. **Clique em "Deploy"**

### **4. Deploy do Frontend (3 min)**

1. **Clique em "New Project" novamente**
2. **Importe o mesmo repositório**
3. **Configure o projeto:**
   - **Framework Preset**: Angular
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/sales-app/browser`
   - **Install Command**: `npm install`

4. **Clique em "Deploy"**

### **5. Configurar URLs (1 min)**

1. **Anote a URL do backend** (ex: `https://backend-abc123.vercel.app`)
2. **Anote a URL do frontend** (ex: `https://frontend-xyz789.vercel.app`)
3. **Volte ao backend na Vercel:**
   - **Settings** → **Environment Variables**
   - **Edite `FRONTEND_URL`** com a URL do frontend
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

## 🔧 **Configurações Avançadas (Opcional):**

### **Domínio Personalizado:**
1. **Settings** → **Domains**
2. **Adicione seu domínio**
3. **Configure DNS**

### **Monitoramento:**
- **Analytics** automático
- **Logs** em tempo real
- **Performance** metrics

## 🚨 **Troubleshooting:**

### **Erro de CORS:**
- Verifique se `FRONTEND_URL` está correto no backend

### **Erro de Build:**
- Verifique se todas as dependências estão no `package.json`

### **Erro de MongoDB:**
- Verifique se a string de conexão está correta
- Verifique se o IP está liberado no Atlas

## 📞 **Suporte:**
- **Vercel Docs**: https://vercel.com/docs
- **Discord Vercel**: https://vercel.com/discord
- **GitHub Issues**: Para problemas específicos do projeto

---

## 🎯 **Resumo do que foi configurado:**

✅ `vercel.json` - Configuração principal  
✅ `backend/vercel.json` - Configuração do backend  
✅ `frontend/vercel.json` - Configuração do frontend  
✅ `backend/env.vercel` - Variáveis de ambiente  
✅ **Guia completo de deploy**

**Agora é só seguir o passo a passo acima!** 🚀

