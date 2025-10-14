#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Obter a URL da API das variáveis de ambiente
const apiUrl = process.env.API_URL || 'https://vendatech-backend.onrender.com/api';

// Caminho para o arquivo de ambiente de produção
const envProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Conteúdo do arquivo atualizado
const envContent = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};`;

// Escrever o arquivo
fs.writeFileSync(envProdPath, envContent);

console.log(`✅ API URL atualizada para: ${apiUrl}`);
