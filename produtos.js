// FONTE ÚNICA DE DADOS DA LOJA — edite este arquivo para ampliar o catálogo.
// Pix, parcelas e descontos: somente em store. Os preços de kits são calculados
// automaticamente a partir de components e store.kitDiscount.
// Creatina: troque quantity por "300g", "500g" etc. quando confirmar o peso.
// Um novo produto precisa de id e slug únicos, category, tags, images, price e status.
// Para ficar na home, use featured:true. Para lançamentos, use new:true.
window.ATIVO_DATA = {
  "store": {
    "name": "Ativo Nutrition",
    "whatsapp": "5511944790540",
    "instagram": "proativonutrition",
    "demo": true,
    "pixDiscount": 0.03,
    "installments": 6,
    "coupon": {
      "code": "ATIVO10",
      "discount": 0.1,
      "enabled": true
    },
    "campaignEnd": "",
    "freeShippingFrom": null,
    "kitDiscount": 0.1,
    "siteUrl": "",
    "logo": "images/logo-ativo.svg",
    "socialImage": "images/logo-ativo.jpg",
    "legalName": "",
    "cnpj": "",
    "privacyEmail": "",
    "couponStacksWithPix": true,
    "announcementMessages": [
      "Sua evolução começa aqui.",
      "{pix}% OFF no Pix ou {parcelas}x sem juros • Consulte condições",
      "Fale com a Ativo Nutrition pelo WhatsApp"
    ]
  },
  "products": [
    {
      "id": "creatina",
      "slug": "creatina",
      "name": "Creatina Monohidratada",
      "category": "Performance",
      "format": "pó",
      "price": 79.9,
      "description": "Praticidade para complementar sua rotina de suplementação.",
      "images": [
        "images/creatina.webp"
      ],
      "quantity": "Consulte o peso no rótulo",
      "status": "consultar",
      "featured": true,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino"
      ],
      "new": false
    },
    {
      "id": "triplo-magnesio",
      "slug": "triplo-magnesio",
      "name": "Triplo Magnésio 600 mg",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": 59.9,
      "description": "Três formas de magnésio em uma apresentação prática.",
      "images": [
        "images/triplo-magnesio.webp",
        "images/triplo-magnesio-azul.webp"
      ],
      "quantity": "60 cápsulas",
      "status": "consultar",
      "featured": true,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "new": false
    },
    {
      "id": "nac-600mg",
      "slug": "nac-600mg",
      "name": "NAC 600 mg",
      "category": "NAC e antioxidantes",
      "format": "cápsulas",
      "price": 59.9,
      "description": "Suplemento em cápsulas para incluir na sua rotina.",
      "images": [
        "images/nac-600mg.webp"
      ],
      "quantity": "60 cápsulas",
      "status": "consultar",
      "featured": true,
      "kit": false,
      "components": [],
      "tags": [
        "imunidade",
        "bem-estar-diario"
      ],
      "new": false
    },
    {
      "id": "coenzima-q10",
      "slug": "coenzima-q10",
      "name": "Coenzima Q10 600 mg",
      "category": "Performance",
      "format": "cápsulas",
      "price": 69.9,
      "description": "Sua rotina de suplementação com uma apresentação prática.",
      "images": [
        "images/coenzima-q10.webp"
      ],
      "quantity": "60 cápsulas",
      "status": "consultar",
      "featured": true,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino",
        "bem-estar-diario"
      ],
      "new": false
    },
    {
      "id": "selenio-iodo",
      "slug": "selenio-iodo",
      "name": "Selênio + Iodo",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": 49.9,
      "description": "Dois ingredientes em uma apresentação de uso diário.",
      "images": [
        "images/selenio-iodo.webp"
      ],
      "quantity": "60 cápsulas",
      "status": "consultar",
      "featured": true,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "new": false
    },
    {
      "id": "beauty-complex",
      "slug": "beauty-complex",
      "name": "Beauty Complex 3 em 1",
      "category": "Beauty",
      "format": "cápsulas",
      "price": 59.9,
      "description": "Uma fórmula da linha Beauty para complementar a rotina.",
      "images": [
        "images/beauty-complex.webp"
      ],
      "quantity": "60 cápsulas",
      "status": "consultar",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "pele-cabelo"
      ],
      "new": false
    },
    {
      "id": "detox-complex",
      "slug": "detox-complex",
      "name": "Detox Complex 600 mg",
      "category": "Equilíbrio e bem-estar",
      "format": "cápsulas",
      "price": 59.9,
      "description": "Formato em cápsulas e praticidade no dia a dia.",
      "images": [
        "images/detox-complex.webp"
      ],
      "quantity": "60 cápsulas",
      "status": "consultar",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "new": false
    },
    {
      "id": "magnesio-b6",
      "slug": "magnesio-b6",
      "name": "Magnésio + B6",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "new": true
    },
    {
      "id": "zinco-quelato",
      "slug": "zinco-quelato",
      "name": "Zinco Quelato",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario",
        "imunidade",
        "pele-cabelo"
      ],
      "new": true
    },
    {
      "id": "vitamina-d3",
      "slug": "vitamina-d3",
      "name": "Vitamina D3",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario",
        "imunidade"
      ],
      "new": true
    },
    {
      "id": "vitamina-d3-k2",
      "slug": "vitamina-d3-k2",
      "name": "Vitamina D3 + K2",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "new": true
    },
    {
      "id": "vitamina-c",
      "slug": "vitamina-c",
      "name": "Vitamina C",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario",
        "imunidade"
      ],
      "new": true
    },
    {
      "id": "vitamina-b12",
      "slug": "vitamina-b12",
      "name": "Vitamina B12",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "new": true
    },
    {
      "id": "complexo-b",
      "slug": "complexo-b",
      "name": "Complexo B",
      "category": "Vitaminas e minerais",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "new": true
    },
    {
      "id": "coq10-pqq",
      "slug": "coq10-pqq",
      "name": "CoQ10 + PQQ",
      "category": "Performance",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino",
        "bem-estar-diario"
      ],
      "new": true
    },
    {
      "id": "cafeina",
      "slug": "cafeina",
      "name": "Cafeína",
      "category": "Performance",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino"
      ],
      "new": true
    },
    {
      "id": "cafeina-taurina",
      "slug": "cafeina-taurina",
      "name": "Cafeína + Taurina",
      "category": "Performance",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino"
      ],
      "new": true
    },
    {
      "id": "l-carnitina",
      "slug": "l-carnitina",
      "name": "L-Carnitina",
      "category": "Performance",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino"
      ],
      "new": true
    },
    {
      "id": "l-citrulina",
      "slug": "l-citrulina",
      "name": "L-Citrulina",
      "category": "Performance",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino"
      ],
      "new": true
    },
    {
      "id": "creatina-em-capsulas",
      "slug": "creatina-em-capsulas",
      "name": "Creatina em Cápsulas",
      "category": "Performance",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "Apresentação a confirmar",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino"
      ],
      "new": true
    },
    {
      "id": "beta-alanina",
      "slug": "beta-alanina",
      "name": "Beta-Alanina",
      "category": "Performance",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "energia-treino"
      ],
      "new": true
    },
    {
      "id": "colageno-complex",
      "slug": "colageno-complex",
      "name": "Colágeno Complex",
      "category": "Beauty",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "pele-cabelo"
      ],
      "new": true
    },
    {
      "id": "hair-complex",
      "slug": "hair-complex",
      "name": "Hair Complex",
      "category": "Beauty",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "pele-cabelo"
      ],
      "new": true
    },
    {
      "id": "skin-complex",
      "slug": "skin-complex",
      "name": "Skin Complex",
      "category": "Beauty",
      "format": "cápsulas",
      "price": null,
      "description": "Conheça em breve mais uma opção da linha Ativo Nutrition.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "kit": false,
      "components": [],
      "tags": [
        "pele-cabelo"
      ],
      "new": true
    },
    {
      "id": "nac-vitamina-c",
      "slug": "nac-vitamina-c",
      "name": "NAC + Vitamina C",
      "category": "NAC e antioxidantes",
      "format": "cápsulas",
      "price": null,
      "description": "Suplemento alimentar em cápsulas da linha Ativo Nutrition. Confira os detalhes no rótulo atualizado.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "new": true,
      "kit": false,
      "components": [],
      "tags": [
        "imunidade",
        "bem-estar-diario"
      ],
      "source": "Catálogo Ativo Nutrition atualizado"
    },
    {
      "id": "resveratrol",
      "slug": "resveratrol",
      "name": "Resveratrol",
      "category": "NAC e antioxidantes",
      "format": "cápsulas",
      "price": null,
      "description": "Suplemento alimentar em cápsulas da linha Ativo Nutrition. Confira os detalhes no rótulo atualizado.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "new": true,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "source": "Catálogo Ativo Nutrition atualizado"
    },
    {
      "id": "astaxantina",
      "slug": "astaxantina",
      "name": "Astaxantina",
      "category": "NAC e antioxidantes",
      "format": "cápsulas",
      "price": null,
      "description": "Suplemento alimentar em cápsulas da linha Ativo Nutrition. Confira os detalhes no rótulo atualizado.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "new": true,
      "kit": false,
      "components": [],
      "tags": [
        "pele-cabelo",
        "bem-estar-diario"
      ],
      "source": "Catálogo Ativo Nutrition atualizado"
    },
    {
      "id": "multivitaminico-minerais",
      "slug": "multivitaminico-minerais",
      "name": "Multivitamínico + Minerais",
      "category": "Equilíbrio e bem-estar",
      "format": "cápsulas",
      "price": null,
      "description": "Suplemento alimentar em cápsulas da linha Ativo Nutrition. Confira os detalhes no rótulo atualizado.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "new": true,
      "kit": false,
      "components": [],
      "tags": [
        "imunidade",
        "bem-estar-diario"
      ],
      "source": "Catálogo Ativo Nutrition atualizado"
    },
    {
      "id": "omega-3",
      "slug": "omega-3",
      "name": "Ômega 3",
      "category": "Equilíbrio e bem-estar",
      "format": "cápsulas",
      "price": null,
      "description": "Suplemento alimentar em cápsulas da linha Ativo Nutrition. Confira os detalhes no rótulo atualizado.",
      "images": [],
      "quantity": "60 cápsulas",
      "status": "em-breve",
      "featured": false,
      "new": true,
      "kit": false,
      "components": [],
      "tags": [
        "bem-estar-diario"
      ],
      "source": "Catálogo Ativo Nutrition atualizado"
    },
    {
      "id": "kit-rotina-essencial",
      "slug": "kit-rotina-essencial",
      "name": "Kit Rotina Essencial",
      "category": "Kits",
      "format": "kit",
      "price": null,
      "description": "Combine seus produtos preferidos em uma única seleção.",
      "images": [
        "images/triplo-magnesio.webp",
        "images/nac-600mg.webp"
      ],
      "quantity": "2 unidades",
      "status": "consultar",
      "featured": false,
      "kit": true,
      "components": [
        "triplo-magnesio",
        "nac-600mg"
      ],
      "tags": [
        "bem-estar-diario",
        "imunidade"
      ],
      "new": false
    },
    {
      "id": "kit-linha-beauty",
      "slug": "kit-linha-beauty",
      "name": "Kit Linha Beauty",
      "category": "Kits",
      "format": "kit",
      "price": null,
      "description": "Combine seus produtos preferidos em uma única seleção.",
      "images": [
        "images/beauty-complex.webp",
        "images/selenio-iodo.webp"
      ],
      "quantity": "2 unidades",
      "status": "consultar",
      "featured": false,
      "kit": true,
      "components": [
        "beauty-complex",
        "selenio-iodo"
      ],
      "tags": [
        "pele-cabelo",
        "bem-estar-diario"
      ],
      "new": false
    },
    {
      "id": "kit-performance",
      "slug": "kit-performance",
      "name": "Kit Performance",
      "category": "Kits",
      "format": "kit",
      "price": null,
      "description": "Combine seus produtos preferidos em uma única seleção.",
      "images": [
        "images/creatina.webp",
        "images/triplo-magnesio.webp"
      ],
      "quantity": "2 unidades",
      "status": "consultar",
      "featured": false,
      "kit": true,
      "components": [
        "creatina",
        "triplo-magnesio"
      ],
      "tags": [
        "energia-treino",
        "bem-estar-diario"
      ],
      "new": false
    },
    {
      "id": "kit-rotina-completa",
      "slug": "kit-rotina-completa",
      "name": "Kit Rotina Completa",
      "category": "Kits",
      "format": "kit",
      "price": null,
      "description": "Combine seus produtos preferidos em uma única seleção.",
      "images": [
        "images/triplo-magnesio.webp",
        "images/nac-600mg.webp",
        "images/coenzima-q10.webp"
      ],
      "quantity": "3 unidades",
      "status": "consultar",
      "featured": false,
      "kit": true,
      "components": [
        "triplo-magnesio",
        "nac-600mg",
        "coenzima-q10"
      ],
      "tags": [
        "bem-estar-diario",
        "imunidade",
        "energia-treino"
      ],
      "new": false
    },
    {
      "id": "kit-cuidado-diario",
      "slug": "kit-cuidado-diario",
      "name": "Kit Cuidado Diário",
      "category": "Kits",
      "format": "kit",
      "price": null,
      "description": "Combine seus produtos preferidos em uma única seleção.",
      "images": [
        "images/detox-complex.webp",
        "images/beauty-complex.webp"
      ],
      "quantity": "2 unidades",
      "status": "consultar",
      "featured": false,
      "kit": true,
      "components": [
        "detox-complex",
        "beauty-complex"
      ],
      "tags": [
        "bem-estar-diario",
        "pele-cabelo"
      ],
      "new": false
    },
    {
      "id": "kit-selecao-ativo",
      "slug": "kit-selecao-ativo",
      "name": "Kit Seleção Ativo",
      "category": "Kits",
      "format": "kit",
      "price": null,
      "description": "Combine seus produtos preferidos em uma única seleção.",
      "images": [
        "images/nac-600mg.webp",
        "images/coenzima-q10.webp",
        "images/selenio-iodo.webp"
      ],
      "quantity": "3 unidades",
      "status": "consultar",
      "featured": false,
      "kit": true,
      "components": [
        "nac-600mg",
        "coenzima-q10",
        "selenio-iodo"
      ],
      "tags": [
        "imunidade",
        "bem-estar-diario",
        "energia-treino"
      ],
      "new": false
    }
  ],
  "categories": [
    "Todos",
    "NAC e antioxidantes",
    "Vitaminas e minerais",
    "Performance",
    "Beauty",
    "Equilíbrio e bem-estar",
    "Kits"
  ],
  "articles": [
    {
      "slug": "como-escolher",
      "category": "Guia de compra",
      "title": "O que observar ao escolher seu suplemento",
      "time": "3 min",
      "color": "peach",
      "body": [
        "Confira a indicação de uso, a lista de ingredientes, a tabela nutricional e a recomendação de consumo no rótulo atualizado.",
        "A quantidade de cápsulas e o peso da embalagem não são a mesma informação que a quantidade de cada ingrediente por porção.",
        "Procure orientação de um profissional de saúde para avaliar suas necessidades."
      ]
    },
    {
      "slug": "rotina-pratica",
      "category": "Dia a dia",
      "title": "Uma rotina de suplementação mais prática",
      "time": "2 min",
      "color": "sage",
      "body": [
        "Organize seus produtos em um local seco, protegido do calor e fora do alcance de crianças.",
        "Mantenha a embalagem original para consultar validade, ingredientes e recomendação de consumo.",
        "Não exceda a recomendação indicada no rótulo. Em caso de dúvidas, procure orientação profissional."
      ]
    },
    {
      "slug": "entenda-rotulo",
      "category": "Informação",
      "title": "Como ler o rótulo antes de comprar",
      "time": "4 min",
      "color": "lilac",
      "body": [
        "Confira o tamanho da porção, as porções por embalagem, os alergênicos e os avisos.",
        "As informações definitivas são as presentes no rótulo atualizado de cada produto.",
        "Solicite fotos do verso da embalagem ao atendimento antes da compra se precisar de mais detalhes."
      ]
    }
  ],
  "objectives": [
    {
      "id": "energia-treino",
      "name": "Energia e treino"
    },
    {
      "id": "pele-cabelo",
      "name": "Pele e cabelo"
    },
    {
      "id": "imunidade",
      "name": "Imunidade"
    },
    {
      "id": "bem-estar-diario",
      "name": "Bem-estar diário"
    }
  ],
  "pages": {
    "/sobre": {
      "title": "Sua evolução começa aqui.",
      "text": [
        "A Ativo Nutrition nasceu para acompanhar diferentes momentos da sua rotina. Ciência, nutrição e bem-estar orientam nossa identidade.",
        "Nossa linha reúne suplementos em diferentes apresentações. Valorizamos informação clara, escolhas conscientes e atendimento próximo.",
        "Conheça as categorias, consulte os rótulos atualizados e fale com nossa equipe para conferir disponibilidade e detalhes antes de comprar."
      ]
    },
    "/como-comprar": {
      "title": "Como comprar",
      "text": [
        "Encontre seu produto pelo nome, pela categoria ou pelo objetivo. O botão “Escolher” dos cards adiciona diretamente à seleção; o restante do card abre os detalhes.",
        "No carrinho, confira itens e quantidades. Você pode aplicar um cupom válido e comparar o total com o valor no Pix.",
        "Clique em “Finalizar pelo WhatsApp”. A mensagem leva sua seleção e campos para informar Nome e CEP. O atendimento confirma disponibilidade, condições de pagamento e entrega antes de concluir o pedido.",
        "A compra só é concluída após a confirmação com o atendimento. O site não cobra valores nem envia a mensagem automaticamente."
      ],
      "demoText": "Os preços e as condições apresentados nesta versão são exemplos editáveis."
    },
    "/trocas": {
      "title": "Trocas e devoluções",
      "text": [
        "Nas compras realizadas fora do estabelecimento comercial, você pode exercer o direito de arrependimento em até 7 dias, contados da assinatura ou do recebimento do produto, conforme o artigo 49 do Código de Defesa do Consumidor.",
        "Para solicitar, fale com o atendimento e informe o número do pedido. Nossa equipe orientará a devolução sem ônus pelo exercício desse direito e o reembolso dos valores pagos, inclusive o frete da compra.",
        "Se receber um item com avaria, defeito ou divergência, informe o ocorrido. Fotos ajudam na conferência, sem limitar seus direitos previstos em lei.",
        "Os dados de contato e a logística de devolução são confirmados pelo atendimento. Condições comerciais de troca voluntária, quando houver, são informadas separadamente e não restringem os direitos legais."
      ]
    },
    "/privacidade": {
      "title": "Sua privacidade",
      "text": [
        "Este site armazena o carrinho e a preferência do pop-up no seu navegador, quando permitido. Você pode apagar esses dados pelas configurações do navegador. Não há login, cadastro em servidor ou processamento de pagamento nesta versão.",
        "Os dados que você decide enviar pelo WhatsApp são usados no atendimento, na consulta de pedidos e nas providências necessárias à compra. O formulário de novidades solicita seu e-mail apenas para essa finalidade e depende de sua autorização.",
        "Você pode solicitar confirmação do tratamento, acesso e correção dos seus dados, informações sobre compartilhamento, revogação do consentimento e eliminação nas hipóteses previstas na LGPD. Faça sua solicitação ao atendimento da Ativo Nutrition. A conservação exigida por lei pode impedir a exclusão imediata de certos dados.",
        "Ao usar WhatsApp ou Instagram, você também está sujeito às políticas desses serviços. A fonte Poppins pode ser carregada do Google Fonts, que recebe os dados técnicos da conexão.",
        "A empresa deve manter identificados o controlador, o canal de privacidade, as finalidades, os compartilhamentos e os prazos reais de conservação. Esses campos devem refletir a operação efetiva da loja."
      ]
    },
    "/frete": {
      "title": "Entrega e frete",
      "text": [
        "O frete e o prazo dependem do CEP de destino, dos itens e do serviço disponível. A consulta de CEP desta loja prepara uma solicitação ao atendimento; não calcula uma cotação automática de transportadora.",
        "Antes de concluir a compra, o atendimento informa o valor do frete, o prazo estimado, a modalidade e as condições de postagem. Confira seus dados de entrega na confirmação do pedido.",
        "Após a postagem, solicite o código de rastreio em “Consultar pedido”. Se houver atraso, divergência ou avaria, fale com nossa equipe para acompanhamento.",
        "Promoções de frete, quando configuradas, seguem as condições confirmadas para o destino e os produtos escolhidos."
      ]
    },
    "/conta": {
      "title": "Seu atendimento Ativo.",
      "text": [
        "Precisa de informações sobre seus pedidos, disponibilidade ou formas de pagamento? Fale com a equipe pelo WhatsApp.",
        "Não há área de login nesta versão. O carrinho fica neste navegador e os pedidos confirmados são acompanhados pelo atendimento."
      ]
    }
  },
  "policySources": {
    "CDC": "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
    "LGPD": "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
  }
};
