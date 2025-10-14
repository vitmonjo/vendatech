const mongoose = require('mongoose');
const Product = require('../src/models/Product');
require('dotenv').config();

// Dados dos produtos do JSON
const productsData = [
  {
    name: "Smartphone Samsung Galaxy A55",
    description: "Samsung Galaxy A55 é um smartphone intermediário com tela Super AMOLED de 6,6 polegadas, processador Exynos 1480, 8 GB de RAM e até 256 GB de armazenamento. Possui câmera tripla com sensor principal de 50 MP e câmera frontal de 32 MP, bateria de 5000 mAh, conectividade 5G e certificação IP67 para resistência à água e poeira. Roda Android 14 com interface One UI.",
    price: 3000,
    image: "https://imgs.casasbahia.com.br/55065963/1g.jpg?imwidth=500?imwidth=384",
    category: "eletrônicos",
    stock: 15
  },
  {
    name: "Notebook Gamer Acer Nitro 5",
    description: "Notebook gamer Acer Nitro 5 com processador Intel Core i5 de 11ª ou 13ª geração, 8GB a 16GB de RAM, SSD de 512GB, placa de vídeo dedicada NVIDIA GeForce RTX 3050 ou superior, e tela de 15,6 polegadas Full HD com alta taxa de atualização (até 144Hz). Ideal para jogos e tarefas pesadas, oferece boa performance gráfica, sistema operacional Windows 11, teclado retroiluminado e conectividade completa para periféricos.",
    price: 6800,
    image: "https://m.media-amazon.com/images/I/51Wv-tEUn6L._AC_SX425_.jpg",
    category: "eletrônicos",
    stock: 8
  },
  {
    name: "Smart TV LG 55\" 4K UHD",
    description: "Smart TV LG 55 polegadas com resolução 4K UHD, processador α7 Gen6, AI ThinQ, webOS 23, HDR10 Pro, Dolby Vision IQ e Dolby Atmos. Possui HDMI 2.1, Gaming Optimizer e modo Filmmaker Mode.",
    price: 2499,
    image: "https://a-static.mlcdn.com.br/800x560/smart-tv-55-lg-4k-ultra-hd-55ua8550psa-webos-25-ai-processor-4k-gen8-com-alexa-3-hdmi/magazineluiza/240243300/e28fa7ebe30acd93a5d9c4af9d8fe702.jpg",
    category: "eletrônicos",
    stock: 12
  },
  {
    name: "Fone de Ouvido Sony WH-1000XM5",
    description: "Fone de ouvido wireless premium com cancelamento de ruído ativo, bateria de 30 horas, som de alta qualidade, microfones para chamadas claras e design confortável para uso prolongado.",
    price: 1899,
    image: "https://m.media-amazon.com/images/I/418zLpCwQuL._AC_SX679_.jpg",
    category: "eletrônicos",
    stock: 20
  },
  {
    name: "Apple Watch Series 9",
    description: "Relógio inteligente da Apple com chip S9 SiP, tela Retina Always-On, GPS, resistente à água, monitoramento de saúde avançado e integração completa com ecossistema Apple.",
    price: 3299,
    image: "https://m.media-amazon.com/images/I/5179Ty9CRoL._AC_SX342_SY445_QL70_ML2_.jpg",
    category: "eletrônicos",
    stock: 25
  },
  {
    name: "PlayStation 5",
    description: "Console de videogame de última geração da Sony com SSD ultrarrápido, controle DualSense com feedback háptico, suporte a 4K 120fps e ray tracing.",
    price: 3899,
    image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$1600px--t$",
    category: "eletrônicos",
    stock: 5
  },
  {
    name: "Máquina de Café Nespresso Essenza Mini",
    description: "Máquina de café compacta e fácil de usar, com bomba de alta pressão (19 bar), aquecimento rápido e dois tamanhos de xícara programáveis (Espresso e Lungo).",
    price: 450,
    image: "https://m.media-amazon.com/images/I/51asY+kBsQL._AC_SX679_.jpg",
    category: "casa",
    stock: 30
  },
  {
    name: "Câmera Mirrorless Fujifilm X-T30 II",
    description: "Câmera compacta com sensor APS-C de 26.1MP, autofoco rápido, gravação de vídeo 4K, visor eletrônico e design retrô. Ideal para fotógrafos e criadores de conteúdo.",
    price: 7500,
    image: "https://m.media-amazon.com/images/I/71IFO4AldiL._AC_SX679_.jpg",
    category: "eletrônicos",
    stock: 3
  },
  {
    name: "Robô Aspirador Roomba i3",
    description: "Robô aspirador inteligente com mapeamento de ambientes, sugere limpeza automática, e se recarrega e retoma a limpeza de onde parou. Conecta-se por Wi-Fi e pode ser controlado por aplicativo.",
    price: 2500,
    image: "https://irobotloja.com.br/cdn/shop/files/101635-3_1000x.jpg?v=1742581485",
    category: "casa",
    stock: 10
  },
  {
    name: "Bicicleta Elétrica Sense Fun",
    description: "Bicicleta elétrica urbana com bateria de 36V, motor de 250W e autonomia de até 40km. Possui quadro de alumínio, freios a disco e display LCD com informações de velocidade e bateria.",
    price: 5500,
    image: "https://m.media-amazon.com/images/I/61PomFXhAyL._AC_SX522_.jpg",
    category: "esportes",
    stock: 7
  },
  {
    name: "Impressora Multifuncional Epson EcoTank L3250",
    description: "Impressora tanque de tinta com Wi-Fi Direct, ideal para casa ou escritório. Oferece alta economia, impressão sem cartuchos e tecnologia Heat-Free que não gasta energia no aquecimento.",
    price: 1200,
    image: "https://m.media-amazon.com/images/I/818P+qYvSHS._AC_SX300_SY300_QL70_ML2_.jpg",
    category: "eletrônicos",
    stock: 18
  },
  {
    name: "Caixa de Som JBL Flip 6",
    description: "Caixa de som portátil com Bluetooth 5.1, design à prova d'água e poeira (IP67), 12 horas de reprodução, e som potente com graves profundos. Disponível em várias cores vibrantes.",
    price: 750,
    image: "https://m.media-amazon.com/images/I/61VkL1WJGxL._AC_SY300_SX300_QL70_ML2_.jpg",
    category: "eletrônicos",
    stock: 22
  },
  {
    name: "Google Nest Hub 2ª Geração",
    description: "Assistente inteligente com tela de 7 polegadas, sensor de movimento Sleep Sensing para monitorar o sono, e alto-falante integrado. Controla dispositivos de casa inteligente e exibe fotos.",
    price: 599,
    image: "https://http2.mlstatic.com/D_NQ_NP_931002-MLB76642492656_062024-O.webp",
    category: "eletrônicos",
    stock: 14
  },
  {
    name: "Console Nintendo Switch OLED",
    description: "Versão mais recente do console híbrido da Nintendo com tela OLED de 7 polegadas, cores vibrantes, suporte ajustável para o modo de mesa e 64 GB de armazenamento interno.",
    price: 2200,
    image: "https://http2.mlstatic.com/D_NQ_NP_696409-MLU78805273511_082024-O.webp",
    category: "eletrônicos",
    stock: 9
  },
  {
    name: "Kindle Paperwhite",
    description: "Leitor de livros digitais à prova d'água com tela de 6,8 polegadas, iluminação embutida ajustável e bateria com autonomia de semanas. Ideal para leitura em qualquer ambiente.",
    price: 850,
    image: "https://http2.mlstatic.com/D_NQ_NP_909408-MLA88028061777_072025-O.webp",
    category: "livros",
    stock: 35
  },
  {
    name: "Xiaomi Smart Band 8",
    description: "Smartband com monitoramento de saúde e fitness, tela AMOLED colorida, bateria de longa duração, mais de 150 modos de exercício e resistência à água de 50 metros.",
    price: 300,
    image: "https://http2.mlstatic.com/D_NQ_NP_805804-MLU77398299919_072024-O.webp",
    category: "esportes",
    stock: 40
  }
];

async function migrateProducts() {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB Atlas');

    // Limpar produtos existentes
    await Product.deleteMany({});
    console.log('🗑️ Produtos existentes removidos');

    // Inserir novos produtos
    const createdProducts = await Product.insertMany(productsData);
    console.log(`✅ ${createdProducts.length} produtos migrados com sucesso!`);

    // Listar produtos criados
    console.log('\n📦 Produtos criados:');
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - R$ ${product.price} (${product.stock} unidades)`);
    });

  } catch (error) {
    console.error('❌ Erro na migração:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
    process.exit(0);
  }
}

// Executar migração
migrateProducts();
