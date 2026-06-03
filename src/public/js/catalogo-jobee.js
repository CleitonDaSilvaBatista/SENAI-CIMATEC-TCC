(function () {
  const produtos = [
    {
      id: 'produto-demo-bermuda', slug: 'shorts', tipo: 'produto', categoria: 'Moda', marca: 'Jobee Basic',
      nome: 'Kit 4 Bermuda Masculina Short Moletom Leve Caminhada com Bolso Academia',
      preco: 67.85, precoAntigo: 79.99, desconto: '25% OFF', imagem: '/img/shorts.webp',
      href: '/produto-shorts', local: 'Salvador - BA', vendedor: 'Loja Demo', avaliacao: 4.8,
      descricao: 'Bermudas masculinas leves, confortáveis e ideais para caminhada, academia e uso casual.',
      tags: ['short', 'bermuda', 'moda', 'academia', 'roupa']
    },
    {
      id: 'produto-demo-tv', slug: 'tv', tipo: 'produto', categoria: 'Tecnologia', marca: 'TCL',
      nome: 'Smart TV TCL 65 Polegadas QLED 4K P7K WiFi Bluetooth Google TV',
      preco: 2867.90, precoAntigo: 3299.90, desconto: '15% OFF', imagem: '/img/tv.webp',
      href: '/produto-tv', local: 'Salvador - BA', vendedor: 'Tech Vision Store', avaliacao: 4.7,
      descricao: 'Smart TV QLED 4K com Google TV, Wi-Fi, Bluetooth, HDR10+ e Dolby Atmos.',
      tags: ['tv', 'smart tv', 'tecnologia', 'qled', 'televisao']
    },
    {
      id: 'produto-demo-ferramentas', slug: 'ferramentas', tipo: 'produto', categoria: 'Ferramentas', marca: 'Titanium',
      nome: 'Jogo de Ferramentas 200 Peças Maleta Resistente Completa Profissional',
      preco: 59.90, precoAntigo: 89.90, desconto: '33% OFF', imagem: '/img/ferramenta.webp',
      href: '/produto-ferramentas', local: 'Lauro de Freitas - BA', vendedor: 'Titanium Platina', avaliacao: 4.6,
      descricao: 'Maleta completa com ferramentas para reparos, montagem e manutenção doméstica ou profissional.',
      tags: ['ferramenta', 'kit', 'maleta', 'manutencao']
    },
    {
      id: 'produto-demo-painel', slug: 'painel-tv', tipo: 'produto', categoria: 'Casa e Móveis', marca: 'Paris Móveis',
      nome: 'Painel para TV até 55 Polegadas Paris com Efeito Ripado Moderno',
      preco: 349.00, precoAntigo: 429.00, desconto: '19% OFF', imagem: '/img/painel.webp',
      href: '/produto-painel-tv', local: 'Salvador - BA', vendedor: 'Casa Paris Móveis', avaliacao: 4.5,
      descricao: 'Painel moderno para TV até 55 polegadas com acabamento ripado e visual sofisticado.',
      tags: ['painel', 'tv', 'moveis', 'casa', 'sala']
    },
    {
      id: 'produto-demo-espelho', slug: 'espelho', tipo: 'produto', categoria: 'Casa e Móveis', marca: 'Vidrex',
      nome: 'Espelho Vidrex Pisa 70x50cm Retangular Decorativo Elegante',
      preco: 58.10, precoAntigo: 79.90, desconto: '27% OFF', imagem: '/img/espelho.webp',
      href: '/produto-espelho', local: 'Salvador - BA', vendedor: 'Vidrex Decor', avaliacao: 4.7,
      descricao: 'Espelho retangular decorativo para quarto, sala, banheiro e ambientes modernos.',
      tags: ['espelho', 'decoracao', 'casa', 'banheiro']
    },
    {
      id: 'produto-demo-mesa-cadeiras', slug: 'mesa-cadeiras', tipo: 'produto', categoria: 'Casa e Móveis', marca: 'Lar Quentinho',
      nome: 'Conjunto Mesa com Cadeiras para Sala de Jantar',
      preco: 1874.14, precoAntigo: 2019.90, desconto: '7% OFF', imagem: '/img/conjuntomesa.webp',
      href: '/produto-mesa-cadeiras', local: 'Camaçari - BA', vendedor: 'Lar Quentinho Móveis', avaliacao: 4.8,
      descricao: 'Conjunto completo para sala de jantar com visual confortável e moderno.',
      tags: ['mesa', 'cadeira', 'moveis', 'sala de jantar']
    },
    {
      id: 'produto-demo-smartwatch', slug: 'smartwatch', tipo: 'produto', categoria: 'Tecnologia', marca: 'PEJE',
      nome: 'Smartwatch PEJE ZW04 com Recursos Inteligentes e Monitoramento',
      preco: 669.99, precoAntigo: 905.87, desconto: '26% OFF', imagem: '/img/relogio.png',
      href: '/produto-smartwatch', local: 'Salvador - BA', vendedor: 'Peje Oficial', avaliacao: 4.6,
      descricao: 'Relógio inteligente para rotina, treinos, notificações e monitoramento diário.',
      tags: ['smartwatch', 'relogio', 'tecnologia', 'wearable']
    },
    {
      id: 'produto-demo-rtx5070ti', slug: 'placa-video', tipo: 'produto', categoria: 'Tecnologia', marca: 'NVIDIA',
      nome: 'Placa de Vídeo NVIDIA RTX 5070 Ti 16GB GDDR6 Alto Desempenho',
      preco: 6899.90, precoAntigo: 7149.90, desconto: '3% OFF', imagem: '/img/placa de video.png',
      href: '/produto-placa-video', local: 'Salvador - BA', vendedor: 'Hardware Pro', avaliacao: 4.9,
      descricao: 'Placa de vídeo para jogos, edição, renderização e tarefas de alto desempenho.',
      tags: ['placa de video', 'rtx', 'nvidia', 'hardware', 'pc gamer']
    }
  ];

  const lojas = [
    {
      id: 'loja-tech-assistencia', tipo: 'loja', categoria: 'Serviços', marca: 'Tech Assistência',
      nome: 'Tech Assistência', preco: 120.00, precoAntigo: null, desconto: 'Serviços', imagem: '/img/barbearia.jpeg',
      href: '/loja/tech-assistencia', local: 'São Paulo - SP', vendedor: 'Tech Assistência', avaliacao: 4.8,
      descricao: 'Conserto de celulares, computadores, troca de tela, formatação e suporte técnico.',
      tags: ['conserto', 'celular', 'computador', 'assistencia', 'servico', 'tecnologia']
    },
    {
      id: 'loja-barbeiro', tipo: 'loja', categoria: 'Serviços', marca: 'Barbearia Premium',
      nome: 'Barbearia Premium', preco: 35.90, precoAntigo: null, desconto: 'Agenda aberta', imagem: '/img/barbearia.jpeg',
      href: '/loja/barbearia-vintage', local: 'Salvador - BA', vendedor: 'Barbearia Premium', avaliacao: 4.9,
      descricao: 'Cortes, barba completa, hidratação capilar e combos masculinos.',
      tags: ['barbearia', 'corte', 'barba', 'servico', 'beleza']
    },
    {
      id: 'loja-restaurante', tipo: 'loja', categoria: 'Alimentos', marca: 'Sabor Caseiro',
      nome: 'Sabor Caseiro Restaurante', preco: 22.90, precoAntigo: null, desconto: 'Entrega rápida', imagem: '/img/restaurante.jpg',
      href: '/loja/sabor-caseiro-restaurante', local: 'Salvador - BA', vendedor: 'Sabor Caseiro', avaliacao: 4.7,
      descricao: 'Comida caseira, marmitas, pratos feitos e opções para almoço.',
      tags: ['restaurante', 'comida', 'marmita', 'almoço', 'delivery']
    },
    {
      id: 'loja-salao', tipo: 'loja', categoria: 'Beleza', marca: 'Beleza Pura',
      nome: 'Beleza Pura Salão', preco: 70.00, precoAntigo: null, desconto: 'Agenda aberta', imagem: '/img/salao.jpg',
      href: '/loja/beleza-pura-salao', local: 'Salvador - BA', vendedor: 'Beleza Pura Salão', avaliacao: 4.8,
      descricao: 'Corte feminino, escova, maquiagem e estética completa.',
      tags: ['salão', 'beleza', 'cabelo', 'maquiagem', 'serviço']
    }
  ];

  window.JOBEE_CATALOGO = [...produtos, ...lojas];
  window.JOBEE_PRODUTOS = produtos;
})();
