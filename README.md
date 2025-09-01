### 💻 SalesApp: Seu E-commerce Simples e Completo

Bem-vindo ao **SalesApp**\! Este é um projeto de e-commerce Front-End desenvolvido em **Angular**, com o objetivo de simular uma loja virtual completa. Desde a exibição de produtos até o gerenciamento de um carrinho de compras funcional, o SalesApp foi construído para demonstrar as habilidades em desenvolvimento web full stack.

-----

### 🌟 Destaques do Projeto

  * **Página Inicial (Home)**: Um layout moderno e limpo, com produtos em destaque para uma navegação intuitiva.
  * **Catálogo de Produtos**: Visualização de todos os itens em um design de grid, com cards padronizados para uma experiência de compra consistente.
  * **Carrinho de Compras**: Funcionalidade completa para adicionar, remover e ajustar a quantidade de produtos, com cálculo automático do total do pedido.
  * **Design Responsivo**: O layout se adapta perfeitamente a diferentes tamanhos de tela, de desktops a dispositivos móveis.
  * **Tema Moderno**: Estilo visual coeso e profissional, inspirado nas cores do **Azure**.

-----

### 🛠️ Tecnologias Utilizadas

  * **Front-End**: **Angular** (Framework), **Angular Material** (Componentes de UI), **TypeScript** (Linguagem).
  * **Back-End (Simulado)**: **JSON Server** para simular uma API REST.
  * **Gerenciamento de Pacotes**: **npm** (Node Package Manager).

-----

### 🧠 Desafios de Desenvolvimento e Código

A construção deste projeto apresentou alguns desafios importantes que foram superados com a implementação de conceitos-chave do Angular e do desenvolvimento web.

#### **1. Gerenciamento de Estado Reativo no Carrinho**

A implementação do carrinho de compras exigiu uma abordagem reativa para garantir que a interface do usuário (UI) se atualizasse automaticamente quando um item fosse adicionado, removido ou sua quantidade alterada.

  * **Desafio**: Como manter o total do carrinho sempre atualizado sem a necessidade de recarregar a página?
  * **Implementação**: A solução foi o uso de um **`BehaviorSubject`** no `CartService`. O `cartItemsSubject` emite o novo estado do carrinho sempre que uma mudança ocorre. O total do carrinho é calculado a partir desse `Subject` usando um `pipe` e o operador `map` do **RxJS**, que monitora o fluxo de dados e recalcula o valor em tempo real.

<!-- end list -->

```typescript
// Exemplo de código no cart.service.ts
private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
cartItems$ = this.cartItemsSubject.asObservable();

getCartTotal(): Observable<number> {
  return this.cartItems$.pipe(
    map((items) =>
      items.reduce((total, item) => total + item.price * item.quantity, 0)
    )
  );
}
```

#### **2. Layout e Consistência Visual com CSS Grid**

As imagens dos produtos estavam com tamanhos inconsistentes e o layout da página de produtos não exibia os itens em colunas, prejudicando o visual do e-commerce.

  * **Desafio**: Criar um layout de grid responsivo e garantir que todas as imagens tivessem o mesmo tamanho, sem serem cortadas.
  * **Implementação**: A solução foi a adoção do **CSS Grid**. No arquivo `products.css`, a propriedade `grid-template-columns` foi utilizada para criar um layout de 3 colunas que se adapta a telas menores. Além disso, as propriedades `height: 200px;` e **`object-fit: contain;`** foram aplicadas nas imagens para forçar uma altura fixa e garantir que a imagem inteira fosse exibida sem cortes, preenchendo o espaço restante com um fundo cinza.

<!-- end list -->

```css
/* Exemplo de código no products.css */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: #f3f2f1;
}
```

-----

### 🚀 Como Rodar o Projeto

1.  Clone este repositório:
    ```bash
    git clone https://github.com/Damasceno11/sales-app.git
    cd sales-app
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
3.  Inicie o servidor de API simulada (JSON Server):
    ```bash
    npm run json-server
    ```
4.  Em outro terminal, inicie a aplicação Angular:
    ```bash
    npm start
    ```
5.  Acesse o projeto no navegador:
    ```
    http://localhost:4200
    ```

-----

### 🖼️ Páginas da Aplicação

<img width="1919" height="1047" alt="Captura de tela 2025-08-31 213122" src="https://github.com/user-attachments/assets/c8c29e74-0b87-43b7-9db6-e57ffea4c9e1" />

<img width="1919" height="1046" alt="Captura de tela 2025-08-31 213250" src="https://github.com/user-attachments/assets/f31d7b1b-45b7-4f70-97f9-949f45cea3b2" />

<img width="1919" height="1049" alt="Captura de tela 2025-08-31 213229" src="https://github.com/user-attachments/assets/9549128c-99bd-40d0-8ba5-d0107478dc59" />

<img width="1919" height="1059" alt="Captura de tela 2025-08-31 213212" src="https://github.com/user-attachments/assets/0c91555d-2a01-454c-9cc9-94dbce492939" />


#### 🏠 Página Inicial (Home)


<img width="1919" height="1051" alt="Captura de tela 2025-08-31 214052" src="https://github.com/user-attachments/assets/0e05837b-3b25-4c51-9162-c7b4bcaa708e" />


#### 🛒 Carrinho de Compras


<img width="1919" height="1055" alt="Captura de tela 2025-08-31 213155" src="https://github.com/user-attachments/assets/f076d930-4531-48df-8ea5-9d3605652855" />


#### 📦 Produtos à Venda


<img width="1919" height="1050" alt="Captura de tela 2025-08-31 213058" src="https://github.com/user-attachments/assets/202016a2-1e47-497a-a604-d01f60a0779c" />

<img width="1919" height="1054" alt="Captura de tela 2025-08-31 213334" src="https://github.com/user-attachments/assets/6d42ac1f-304e-47f1-998d-6ddb0448bbf0" />

-----

### 📈 Melhorias Futuras

  * **Página de Checkout**: Implementar um formulário de pagamento e a lógica para finalizar a compra.
  * **Gerenciamento de Produtos**: Adicionar funcionalidades de CRUD para que o usuário possa editar e remover seus próprios produtos.
  * **Sistema de Login**: Criar um sistema de autenticação real para gerenciar os usuários logados.
  * **Filtros e Pesquisa**: Adicionar filtros por categoria e uma barra de pesquisa para os produtos.

-----

### 👨‍💻 Desenvolvido por

**Pedro Paulo Damasceno Muniz**

  * 📊 Contador | 💻 Analista de Sistemas em Formação
  * 🎓 +Devs2Blu - Formação Intensiva em Desenvolvimento Full Stack
  * 📍 Blumenau/SC - Brasil
  * 🔗 [**LinkedIn**](https://www.linkedin.com/in/pedro-damasceno-23b330150/)
  * 🐙 [**GitHub**](https://github.com/Damasceno11)

-----

### 🙏 Agradecimentos

  * **Professor Ralf Lima** pela orientação em desenvolvimento front-end e back-end.
  * **Blusoft** - Associação das empresas de tecnologia de Blumenau.
  * **Proway Cursos** pelo treinamento e suporte.
  * **+Devs2Blu** pela formação intensiva e oportunidade.

-----

### 📞 Suporte

Para dúvidas ou problemas, sinta-se à vontade para **abrir uma issue** no repositório ou entre em contato diretamente através do meu [**LinkedIn**](https://www.linkedin.com/in/pedro-damasceno-23b330150/).

-----

### 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

⭐️ Se este projeto te ajudou ou foi útil, por favor, **deixe uma estrela** no repositório\!
