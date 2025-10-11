#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build de produção...');

// URL da API do backend
const apiUrl = 'https://vendatech-backend.onrender.com/api';

console.log(`📡 API URL: ${apiUrl}`);

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

// Executar o build do Angular
try {
  console.log('🔨 Executando build do Angular...');
  execSync('npx ng build --configuration production', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.error('❌ Erro no build:', error.message);
  process.exit(1);
}
