import { Product } from '../types';

export const CATEGORIES = [
  { id: 'todos', label: 'Todos los Productos' },
  { id: 'labiales', label: 'Labiales & Cuidado Labial' },
  { id: 'rostro', label: 'Rostro & Piel' },
  { id: 'ojos', label: 'Ojos, Pestañas & Delineadores' },
  { id: 'fragancias', label: 'Fragancias & Body Mists' },
  { id: 'sets', label: 'Sets & Promociones' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'ushas-duo-lip-gloss',
    name: 'USHAS® Duo Lip Gloss Fresa & Brillo Cristalino',
    subtitle: 'Brillo labial doble acabado con aroma frutal dulce',
    brand: 'USHAS®',
    category: 'labiales',
    categoryLabel: 'Cuidado Labial & Gloss',
    price: 8.50,
    originalPrice: 11.00,
    rating: 4.9,
    reviewCount: 142,
    image: '/products/ushas-lip-gloss-duo.jpg',
    gallery: [
      '/products/ushas-lip-gloss-duo.jpg'
    ],
    shortDescription: 'Brillo labial de doble fórmula con diseño de fresa y tapa espiral rosa pastel. Proporciona un acabado jugoso tipo espejo sin sensación pegajosa.',
    fullDescription: 'El icónico Duo Lip Gloss de USHAS combina dos texturas en un diseño encantador: un brillo transparente perlado y un tinte translúcido con sutil toque rosado y aroma a pastel de fresa. Enriquecido con aceites hidratantes que nutren los labios mientras aportan volumen óptico inmediato.',
    presentation: 'Tubo aplicador duo con aplicador suave tipo cushion',
    benefits: [
      'Efecto labios jugosos y cristalinos (Glass Lips)',
      'Fórmula ligera no pegajosa de larga duración',
      'Delicioso aroma a fresa dulce',
      'Protege los labios contra la resequedad ambiental'
    ],
    howToUse: 'Aplicar directamente sobre los labios limpios desde el centro hacia las comisuras. Puedes usarlo solo o sobre tu labial mate favorito para darle un acabado brillante.',
    badges: ['Bestseller', 'Aroma a Fresa', 'Efecto Gloss'],
    inStock: true,
    variants: [
      { id: 'fresa-pink', name: 'Strawberry Candy (Rosa Dulce)', colorHex: '#F472B6' },
      { id: 'crystal-clear', name: 'Crystal Glass (Cristalino)', colorHex: '#E2E8F0' },
      { id: 'cherry-shine', name: 'Cherry Glow (Cereza Suave)', colorHex: '#FB7185' }
    ]
  },
  {
    id: 'ushas-bear-lip-balm-pack',
    name: 'USHAS® Bálsamos Labiales Ositos Kawaii (Pack Colección x6)',
    subtitle: 'Set de 6 bálsamos nutritivos coleccionables en colores pastel',
    brand: 'USHAS®',
    category: 'sets',
    categoryLabel: 'Sets & Promociones',
    price: 18.00,
    originalPrice: 24.00,
    rating: 5.0,
    reviewCount: 218,
    image: '/products/ushas-bear-lip-balm.jpg',
    gallery: [
      '/products/ushas-bear-lip-balm.jpg'
    ],
    shortDescription: 'La viral colección completa de 6 ositos tiernos con bálsamo ultra humectante con manteca de karité y vitamina E.',
    fullDescription: 'Adorables bálsamos labiales con diseño 3D de osito en 6 tonalidades pastel (Rosa Bebé, Rosa Chicle, Menta Refrescante, Vainilla Crema, Durazno Peach y Lavanda Silvestre). Cada uno ofrece hidratación profunda instantánea, alivia labios resecos y deja una textura aterciopelada irresistible.',
    presentation: 'Caja coleccionable con los 6 ositos en tonos pastel',
    benefits: [
      'Reparación profunda para labios agrietados o secos',
      'Fórmula enriquecida con Manteca de Karité y Vitamina E',
      'Empaque coleccionable Kawaii con expresiones adorables',
      'Textura suave fundente que no deja color blanco'
    ],
    howToUse: 'Girar la tapa del osito y aplicar generosamente en los labios tantas veces como sea necesario a lo largo del día.',
    badges: ['Top Ventas', 'Colección Viral', '6 Tonos Incluidos'],
    inStock: true,
    variants: [
      { id: 'pack-completo', name: 'Pack Completo x6 Ositos', colorHex: '#FBCFE8' }
    ]
  },
  {
    id: 'ushas-bear-lip-balm-single',
    name: 'USHAS® Bálsamo Labial Osito Kawaii (Unidad)',
    subtitle: 'Bálsamo hidratante labial en envase con forma de osito',
    brand: 'USHAS®',
    category: 'labiales',
    categoryLabel: 'Cuidado Labial & Gloss',
    price: 4.00,
    rating: 4.8,
    reviewCount: 95,
    image: '/products/ushas-bear-lip-balm.jpg',
    gallery: [
      '/products/ushas-bear-lip-balm.jpg'
    ],
    shortDescription: 'Bálsamo individual ultra suave en envase de osito pastel con aroma frutal y nutrición emoliente.',
    fullDescription: 'Lleva tu osito favorito a donde vayas. Perfecto para llevar en la cartera o cosmetiquero. Hidrata, suaviza y cuida la piel delicada de tus labios con una caricia sedosa.',
    presentation: 'Bálsamo compacto en forma de oso 3D',
    benefits: [
      'Hidratación de bolsillo lista para usar',
      'Sensación sedosa y reconfortante',
      'Aromas frutales suaves y deliciosos'
    ],
    howToUse: 'Aplicar suavemente con la yema del dedo o directamente sobre los labios.',
    badges: ['Favorito del Público', 'Ultra Suave'],
    inStock: true,
    variants: [
      { id: 'bear-pink', name: 'Osito Rosa Bebé (Fresa Dulce)', colorHex: '#F472B6' },
      { id: 'bear-mint', name: 'Osito Verde Menta (Menta Fresca)', colorHex: '#A7F3D0' },
      { id: 'bear-yellow', name: 'Osito Vainilla (Crema Suave)', colorHex: '#FEF08A' },
      { id: 'bear-peach', name: 'Osito Durazno (Melocotón Jugoso)', colorHex: '#FDBA74' },
      { id: 'bear-lavender', name: 'Osito Lila (Mora Berry)', colorHex: '#DDD6FE' }
    ]
  },
  {
    id: 'ushas-mascara-eyeliner-2in1',
    name: 'USHAS® Kit 2 en 1 Máscara de Pestañas & Lápiz Delineador',
    subtitle: 'Máscara voluminizadora Pandora + Lápiz negro de precisión',
    brand: 'USHAS®',
    category: 'ojos',
    categoryLabel: 'Ojos, Pestañas & Delineadores',
    price: 9.50,
    originalPrice: 13.00,
    rating: 4.9,
    reviewCount: 167,
    image: '/products/ushas-mascara-eyeliner.jpg',
    gallery: [
      '/products/ushas-mascara-eyeliner.jpg'
    ],
    shortDescription: 'Set dúo para ojos en caja de diseño geométrico. Incluye máscara voluminizadora de pestañas y lápiz retráctil negro mate.',
    fullDescription: 'El dúo definitivo para definir tu mirada: la máscara de pestañas USHAS Pandora aporta longitud dramática y volumen sin grumos, mientras que el lápiz delineador de alta pigmentación se desliza suavemente para trazar líneas limpias o difuminados ahumados de larga duración.',
    presentation: 'Kit en caja 2 en 1 (Máscara 10ml + Lápiz Delineador 1.5g)',
    benefits: [
      'Fórmula a prueba de agua (Waterproof) que no se corre',
      'Cepillo de silicona que separa pestaña por pestaña',
      'Pigmento negro carbón ultra intenso',
      'Fácil desmaquillado con agua tibia o bifásico'
    ],
    howToUse: 'Aplica la máscara desde la raíz hasta las puntas con movimiento en zigzag. Luego delinea la línea superior de las pestañas con el lápiz para un efecto más denso.',
    badges: ['2 en 1 Práctico', 'Waterproof', 'Negro Intenso'],
    inStock: true,
    variants: [
      { id: 'kit-black', name: 'Negro Carbón Intenso', colorHex: '#18181B' }
    ]
  },
  {
    id: 'ushas-chrome-heart-eyeliner',
    name: 'USHAS® Delineador Líquido Plateado con Mango Corazón',
    subtitle: 'Delineador de precisión punta plumón en aplicador cromado plata',
    brand: 'USHAS®',
    category: 'ojos',
    categoryLabel: 'Ojos, Pestañas & Delineadores',
    price: 7.50,
    rating: 4.8,
    reviewCount: 88,
    image: '/products/ushas-mascara-eyeliner.jpg',
    gallery: [
      '/products/ushas-mascara-eyeliner.jpg'
    ],
    shortDescription: 'Delineador líquido de secado rápido con espectacular envase cromado en forma de corazón y punta flexible para cat-eye impecable.',
    fullDescription: 'Una joya cosmética en tu tocador. Su envase metálico plateado con diseño de corazón estilizado ofrece un agarre ergonómico superior. Su tinta líquida fluye de manera uniforme sin saltos, permitiendo desde un delineado fino milimétrico hasta un ala dramática.',
    presentation: 'Envase corazón cromado plata de 3.5 ml',
    benefits: [
      'Punta ultrafina de fieltro de alta precisión',
      'Secado en 5 segundos resistente a roces y sudor',
      'Diseño de lujo con grabado USHAS® plateado',
      'No se cuartea ni pierde intensidad con las horas'
    ],
    howToUse: 'Agitar suavemente antes de usar. Apoyar la punta cerca del lagrimal y trazar suavemente a lo largo de la línea de las pestañas hacia el exterior.',
    badges: ['Diseño Corazón', 'Secado Rápido', 'Larga Duración'],
    inStock: true,
    variants: [
      { id: 'silver-black', name: 'Tinta Negra Brillante', colorHex: '#09090B' }
    ]
  },
  {
    id: 'sas-lip-care-repair',
    name: 'SAS® Lip Care Suero Labial Hidratante Roll-On',
    subtitle: 'Tratamiento labial de brillo cristalino y nutrición profunda',
    brand: 'SAS Beauty',
    category: 'labiales',
    categoryLabel: 'Cuidado Labial & Gloss',
    price: 5.50,
    rating: 4.7,
    reviewCount: 76,
    image: '/products/ushas-lip-gloss-duo.jpg',
    gallery: [
      '/products/ushas-lip-gloss-duo.jpg'
    ],
    shortDescription: 'Tratamiento labial transparente en tubo con tapa blanca perlada. Sella la hidratación y repara la barrera labial.',
    fullDescription: 'Formulado para proporcionar un alivio instantáneo a los labios secos. El SAS Lip Care contiene aceites botánicos ligeros que penetran rápidamente sin dejar sensación pesada ni grasa, dejando una capa sedosa de brillo natural.',
    presentation: 'Tubo cilíndrico roll-on transparente con tapa blanca',
    benefits: [
      'Alivio inmediato de la tirantez labial',
      'Acabado húmedo y natural para uso diario',
      'Fórmula hipoalergénica sin colorantes pesados'
    ],
    howToUse: 'Deslizar sobre los labios antes de dormir o antes de tu maquillaje habitual para prepararlos.',
    badges: ['Nutrición Diaria', 'Efecto Calmante'],
    inStock: true,
    variants: [
      { id: 'lipcare-clear', name: 'Fórmula Cristalina Nutritiva', colorHex: '#F1F5F9' }
    ]
  },
  {
    id: 'ushas-complete-glam-bundle',
    name: 'Combo Glam Completo: Lip Gloss Fresa + Osito Kawaii + Kit Ojos 2en1',
    subtitle: 'El set completo de maquillaje y cuidado con todos los favoritos',
    brand: 'USHAS® & SAS',
    category: 'sets',
    categoryLabel: 'Sets & Promociones',
    price: 24.50,
    originalPrice: 32.00,
    rating: 5.0,
    reviewCount: 310,
    image: '/products/ushas-mascara-eyeliner.jpg',
    gallery: [
      '/products/ushas-mascara-eyeliner.jpg',
      '/products/ushas-bear-lip-balm.jpg',
      '/products/ushas-lip-gloss-duo.jpg'
    ],
    shortDescription: 'Super pack que incluye el Duo Lip Gloss fresa, un bálsamo osito kawaii y el kit 2 en 1 de máscara con delineador.',
    fullDescription: 'Lleva la colección completa a un precio promocional especial. Incluye todo lo necesario para lucir labios sedosos y jugosos y una mirada delineada y voluminosa lista para cualquier ocasión.',
    presentation: 'Set especial con empaque de regalo',
    benefits: [
      'Ahorra un 25% respecto a la compra individual',
      'Incluye los 3 productos más vendidos de la colección',
      'Ideal para regalo o para renovar tu cosmetiquero completo'
    ],
    howToUse: 'Combina los productos en tu rutina diaria de maquillaje y cuidado personal.',
    badges: ['Super Oferta', 'Set Completo', 'Envío Gratis'],
    inStock: true,
    variants: [
      { id: 'bundle-all', name: 'Set Completo 3 en 1', colorHex: '#F43F5E' }
    ]
  },
  {
    id: 'sas-gold-bullet-lipstick',
    name: 'SAS® Gold Bullet Lipstick (Labial Cremoso Aterciopelado)',
    subtitle: 'Labial en barra de alta pigmentación en estuche bala dorado espejo',
    brand: 'SAS Beauty',
    category: 'labiales',
    categoryLabel: 'Labiales & Cuidado Labial',
    price: 7.50,
    originalPrice: 10.00,
    rating: 4.9,
    reviewCount: 94,
    image: '/products/sas-gold-lipstick.jpg',
    gallery: [
      '/products/sas-gold-lipstick.jpg'
    ],
    shortDescription: 'Labial en barra cremoso con acabado velvet aterciopelado. Su lujoso envase cilíndrico en oro rosa protege una fórmula nutritiva que no reseca los labios.',
    fullDescription: 'Deslumbra con la línea SAS Lipstick. Su textura cremosa se funde delicadamente en los labios aportando un color intenso desde la primera pasada con un tacto aterciopelado y confortable. Diseñado en un elegante envase cilíndrico dorado con tapa protectora transparente.',
    presentation: 'Barra retráctil de 3.8g en estuche bala dorado espejo',
    benefits: [
      'Alta cobertura en una sola pasada con acabado velvet',
      'Textura hidratante con aceites emolientes que no cuartea',
      'Elegante estuche metálico dorado espejo',
      'Sensación ligera y confortable durante horas'
    ],
    howToUse: 'Girar la base para deslizar la barra de labial. Aplicar directamente sobre los labios limpios desde el arco de cupido hacia los bordes.',
    badges: ['Textura Velvet', 'Estuche Oro Rosa', 'Alta Pigmentación'],
    inStock: true,
    variants: [
      { id: 'sas-07-nude', name: '07 Warm Terracotta (Nude Cálido)', colorHex: '#C08065' },
      { id: 'sas-08-rose', name: '08 Soft Rose (Rosa Palo Elegante)', colorHex: '#D47E84' },
      { id: 'sas-09-mauve', name: '09 Dusty Mauve (Malva Aterciopelado)', colorHex: '#AF5F6E' },
      { id: 'sas-10-berry', name: '10 Berry Pink (Frambuesa Vibrante)', colorHex: '#C0394F' },
      { id: 'sas-11-wine', name: '11 Classic Wine (Borgoña Profundo)', colorHex: '#8B263E' }
    ]
  },
  {
    id: 'precision-lip-liner-pencil',
    name: 'Lápiz Delineador de Labios de Precisión (Lip Liner)',
    subtitle: 'Perfilador labial cremoso de larga fijación para labios definidos',
    brand: 'USHAS / SAS',
    category: 'labiales',
    categoryLabel: 'Labiales & Cuidado Labial',
    price: 4.50,
    originalPrice: 6.00,
    rating: 4.8,
    reviewCount: 78,
    image: '/products/lip-liner-pencils.jpg',
    gallery: [
      '/products/lip-liner-pencils.jpg'
    ],
    shortDescription: 'Lápiz delineador plateado con punta cremosa de deslizamiento suave. Define el contorno, evita desbordes y potencia el volumen labial.',
    fullDescription: 'El complemento infaltable para lucir labios esculpidos y con volumen óptico. Su mina cremosa de alta pigmentación permite definir el contorno de los labios con máxima precisión o rellenarlos como base de larga duración para tu labial o gloss favorito.',
    presentation: 'Lápiz de madera plateado de 1.4g con capuchón protector transparente',
    benefits: [
      'Trazo ultra suave y pigmentado sin tirones',
      'Fórmula resistente al agua y roces leves',
      'Prolonga la fijación de cualquier labial o gloss',
      'Perfecto para efecto labios carnosos (Overlining)'
    ],
    howToUse: 'Delinear suavemente el borde exterior de los labios siguiendo su forma natural. Rellenar sutilmente hacia el centro antes de aplicar labial o gloss.',
    badges: ['Definición Total', 'Waterproof', 'Alta Precisión'],
    inStock: true,
    variants: [
      { id: 'liner-carmine', name: '01 Carmine Red (Rojo Pasión)', colorHex: '#DC2626' },
      { id: 'liner-cherry', name: '02 Deep Cherry (Cereza Seductor)', colorHex: '#BE123C' },
      { id: 'liner-fuchsia', name: '03 Berry Rose (Rosa Profundo)', colorHex: '#E11D48' },
      { id: 'liner-wine', name: '04 Dark Wine (Vino Tinto Intenso)', colorHex: '#881337' },
      { id: 'liner-nude', name: '05 Nude Cinnamon (Nude Canela)', colorHex: '#B45309' },
      { id: 'liner-mauve', name: '06 Dusty Mauve (Malva Viejo)', colorHex: '#9F1239' }
    ]
  },
  {
    id: 'sas-forever-love-loose-powder',
    name: 'SAS® Forever Love Smooth Loose Powder (Polvo Traslúcido)',
    subtitle: 'Polvo fijador suelto con borla puff en estuche corazón de lujo',
    brand: 'SAS Beauty',
    category: 'rostro',
    categoryLabel: 'Rostro & Piel',
    price: 12.00,
    originalPrice: 16.00,
    rating: 4.9,
    reviewCount: 115,
    image: '/products/sas-loose-powder.jpg',
    gallery: [
      '/products/sas-loose-powder.jpg'
    ],
    shortDescription: 'Polvo fijador microfino que matifica, sella el maquillaje y difumina poros. Presentado en un exclusivo estuche corazón rosa con borla suave.',
    fullDescription: 'El polvo traslúcido favorito para un acabado piel de porcelana libre de brillos. Su fórmula micropulverizada controla el exceso de grasa durante horas sin dejar efecto blanquecino ni flashback en fotografías. Viene en un precioso estuche coleccionable en forma de corazón con tamiz y borla aplicadora.',
    presentation: 'Estuche corazón rosado de 6g con borla puff incluida',
    benefits: [
      'Control de brillo y oleosidad durante todo el día',
      'Efecto filtro difuminador de poros (Blur Effect)',
      'Cero efecto blanco o flashback en fotografías',
      'Estuche coleccionable en forma de corazón'
    ],
    howToUse: 'Tomar una pequeña cantidad con la borla o brocha, retirar el exceso y presionar suavemente sobre la zona T (frente, nariz, barbilla) y contorno de ojos.',
    badges: ['Efecto Blur', 'Estuche Corazón', 'Cero Flashback'],
    inStock: true,
    variants: [
      { id: 'saf082c-translucent', name: 'SAF082C Banana Beige (Traslúcido Natural)', colorHex: '#F3E5D8' },
      { id: 'saf082b-pink', name: 'SAF082B Pink Radiance (Rosa Iluminador & Anti-Ojeras)', colorHex: '#FAD2E1' }
    ]
  },
  {
    id: 'ushas-all-day-flawless-cc-cream',
    name: 'USHAS® All Day Flawless CC Cream (Correctora y Perfeccionadora)',
    subtitle: 'Crema perfeccionadora que unifica tono, disimula poros y neutraliza rojeces',
    brand: 'USHAS®',
    category: 'rostro',
    categoryLabel: 'Rostro & Piel',
    price: 8.50,
    originalPrice: 12.00,
    rating: 4.8,
    reviewCount: 93,
    image: '/products/ushas-cc-cream.jpg',
    gallery: [
      '/products/ushas-cc-cream.jpg'
    ],
    shortDescription: 'CC Cream ligera que disimula imperfecciones, unifica el tono y protege la piel del desgaste diario con acabado fresco no graso.',
    fullDescription: 'La CC Cream All Day Flawless de USHAS fusiona cuidado de la piel y maquillaje en un solo paso. Formulada para corregir discromías, atenuar poros dilatados y brindar una cobertura fresca y radiante. Disponible en tono piel unificador, verde corrector de rojeces y lila iluminador.',
    presentation: 'Tubo dosificador flexible de 27g / 0.95 oz',
    benefits: [
      'Cobertura ligera y transpirable que no satura los poros',
      'Disimula líneas finas, textura irregular y rojeces',
      'Efecto piel descansada, fresca y luminosa',
      'Rápida absorción sin sensación pegajosa'
    ],
    howToUse: 'Aplicar una pequeña cantidad sobre el rostro limpio e hidratado. Extender con los dedos, brocha o esponja húmeda desde el centro hacia afuera.',
    badges: ['Piel Perfecta', 'Control Poros', 'Todo el Día'],
    inStock: true,
    variants: [
      { id: 'cc-natural-beige', name: 'Natural Skin (Unificador de Tono)', colorHex: '#F5DEB3' },
      { id: 'cc-green-corrector', name: 'Green Mint (Neutraliza Rojeces & Marcas)', colorHex: '#A7F3D0' },
      { id: 'cc-purple-corrector', name: 'Lavender Bright (Ilumina Piel Cetrina/Apagada)', colorHex: '#E9D5FF' }
    ]
  },
  {
    id: 'ushas-double-coverage-matte-foundation',
    name: 'USHAS® Double Coverage Matte Foundation 24H',
    subtitle: 'Base líquida de alta cobertura mate aterciopelada y larga duración',
    brand: 'USHAS®',
    category: 'rostro',
    categoryLabel: 'Rostro & Piel',
    price: 11.50,
    originalPrice: 15.00,
    rating: 4.9,
    reviewCount: 135,
    image: '/products/ushas-matte-foundation.jpg',
    gallery: [
      '/products/ushas-matte-foundation.jpg'
    ],
    shortDescription: 'Base de maquillaje de cobertura total construible con acabado mate impecable que resiste sudor y humedad durante 24 horas.',
    fullDescription: 'Consigue un rostro libre de imperfecciones con la base USHAS Double Coverage Matte. Su fórmula líquida ligera proporciona una cobertura uniforme de manchas, marcas y rojeces, manteniendo el rostro sin brillos indeseados sin sensación acartonada.',
    presentation: 'Frasco dispensador de 30ml con tapa beige dosificadora',
    benefits: [
      'Cobertura media a total modulable',
      'Acabado mate sedoso de 24 horas de duración',
      'Resistente a la humedad, transferencias y clima cálido',
      'No oxida ni cambia de color a lo largo de la jornada'
    ],
    howToUse: 'Agitar bien antes de usar. Dosificar una pequeña cantidad y difuminar sobre el rostro con brocha kabuki o esponja húmeda a toques suaves.',
    badges: ['24 Horas Mate', 'Alta Cobertura', 'No Grasa'],
    inStock: true,
    variants: [
      { id: 'fnd-01-porcelain', name: '01 Porcelain (Piel muy clara subtono neutro)', colorHex: '#F7E7D7' },
      { id: 'fnd-02-fair-nude', name: '02 Fair Nude (Piel clara con subtono cálido)', colorHex: '#F1D8C1' },
      { id: 'fnd-03-natural-beige', name: '03 Natural Beige (Piel media balanceada)', colorHex: '#E7C8AA' },
      { id: 'fnd-04-warm-honey', name: '04 Warm Honey (Piel media-oscura dorada)', colorHex: '#D7B492' }
    ]
  },
  {
    id: 'febble-hybrid-crystal-highlighter',
    name: 'Febble® Hybrid Crystal Highlight (Iluminador Marmoleado)',
    subtitle: 'Iluminador horneado duocromático en compacto corazón translúcido',
    brand: 'Febble®',
    category: 'rostro',
    categoryLabel: 'Rostro & Piel',
    price: 12.50,
    originalPrice: 17.00,
    rating: 5.0,
    reviewCount: 156,
    image: '/products/febble-heart-highlighter.jpg',
    gallery: [
      '/products/febble-heart-highlighter.jpg'
    ],
    shortDescription: 'Iluminador horneado con vetas marmoleadas multicromáticas que otorgan un resplandor cósmico deslumbrante en pómulos y clavículas.',
    fullDescription: 'Una pieza de ensueño en tu colección de maquillaje. El iluminador Febble Hybrid Crystal combina pigmentos minerales horneados con reflejos cristalinos que capturan la luz desde cualquier ángulo. Su estuche en forma de corazón fucsia con tipografía holográfica es un deleite visual.',
    presentation: 'Compacto en forma de corazón acrílico de 8g',
    benefits: [
      'Resplandor perlado multidimensional sin purpurina gruesa',
      'Textura horneada sedosa que no enfatiza poros',
      'Uso versátil: iluminador facial, sombra de ojos y brillo corporal',
      'Pigmento ultra reflectivo de larga fijación'
    ],
    howToUse: 'Aplicar con brocha abanico o con las yemas de los dedos en la parte alta de los pómulos, puente de la nariz, arco de cupido y lagrimales.',
    badges: ['Glow Marmoleado', 'Estuche Corazón', 'Efecto Cristalino'],
    inStock: true,
    variants: [
      { id: 'febble-01-crystal-frost', name: '01 Galactic Frost (Rosa, Azul & Plata Duocromo)', colorHex: '#DDD6FE' },
      { id: 'febble-02-sunset-gold', name: '02 Sunset Bronze (Oro Rosa, Melocotón & Cobre)', colorHex: '#FED7AA' }
    ]
  },
  {
    id: 'vvlove-sweet-dessert-charm-mist',
    name: 'V.V.LOVE® Sweet Dessert Fragrance Mist (Con Dije Metálico)',
    subtitle: 'Body mist perfumado de 250ml con dije colgante exclusivo de postre',
    brand: 'V.V.LOVE®',
    category: 'fragancias',
    categoryLabel: 'Fragancias & Body Mists',
    price: 18.00,
    originalPrice: 24.00,
    rating: 5.0,
    reviewCount: 189,
    image: '/products/vvlove-sweet-dessert-mist.jpg',
    gallery: [
      '/products/vvlove-sweet-dessert-mist.jpg'
    ],
    shortDescription: 'Deliciosas brumas corporales inspiradas en postres gourmet, acompañadas de una cadenilla con dije metálico esmaltado coleccionable.',
    fullDescription: 'Déjate envolver por la dulzura irresistible de la colección Sweet Dessert de V.V.LOVE. Cada fragancia de 250ml incluye una fina cadenilla con dije esmaltado en el cuello del frasco (cono de helado, barra de chocolate, cóctel tropical o cupcake) que puedes usar como llavero o amuleto. Aromas gourmand duraderos que endulzan tu día.',
    presentation: 'Botella de 250 ml / 8.4 fl. oz. con cadenilla y dije metálico',
    benefits: [
      'Fijación prolongada en piel, ropa y cabello',
      'Notas gourmand deliciosas y no empalagosas',
      'Incluye colgante/dije metálico esmaltado coleccionable',
      'Fórmula con aloe vera hidratante para la piel'
    ],
    howToUse: 'Vaporizar a unos 15 cm de distancia sobre puntos de pulso (muñecas, cuello, escote) y sobre la ropa.',
    badges: ['Con Dije Coleccionable', 'Aroma Gourmand', 'Edición Especial 250ml'],
    inStock: true,
    variants: [
      { id: 'mist-scoop-haunt', name: 'Scoop Haunt (Helado de Fresa & Crema Vainilla)', colorHex: '#F472B6' },
      { id: 'mist-choc-top', name: 'Choc Top Eclipse (Chocolate Belga & Waffle Tostado)', colorHex: '#78350F' },
      { id: 'mist-dulce-heist', name: 'Dulce Heist (Cóctel Caribeño de Coco & Lima Dulce)', colorHex: '#38BDF8' },
      { id: 'mist-souffle-sky', name: 'Souffle Sky (Cupcake de Frambuesa & Merengue)', colorHex: '#FB7185' }
    ]
  },
  {
    id: 'vvlove-luxury-noir-mist',
    name: 'V.V.LOVE® Luxury Noir & Berry Fragrance Mist (250ml)',
    subtitle: 'Brumas corporales seductoras de alta gama con lazo de satén y notas nocturnas',
    brand: 'V.V.LOVE®',
    category: 'fragancias',
    categoryLabel: 'Fragancias & Body Mists',
    price: 17.50,
    originalPrice: 23.00,
    rating: 4.9,
    reviewCount: 144,
    image: '/products/vvlove-luxury-mist.jpg',
    gallery: [
      '/products/vvlove-luxury-mist.jpg'
    ],
    shortDescription: 'Fragancias sofisticadas y sensuales para la noche y ocasiones especiales, con notas florales amaderadas y toques de frutos rojos licorosos.',
    fullDescription: 'La línea de lujo de V.V.LOVE combina elegancia y misterio. Lovely Cherry cuenta con un coqueto lazo de satén dorado y aroma a cereza negra licorosa con almendras; Party Dream Noir destila diversión nocturna con ciruela oscura y flores silvestres; y Noble Berry destaca por su sensual bouquet de moras y vainilla bourbon.',
    presentation: 'Botella de 250 ml / 8.4 fl. oz. con acabados metálicos y detalles de lujo',
    benefits: [
      'Fragancia intensa con proyección seductora',
      'Acordes sofisticados tipo perfume fino',
      'Frascos decorativos elegantes para tu tocador',
      'Larga duración de hasta 8 horas en tejidos'
    ],
    howToUse: 'Rociar generosamente sobre el cuerpo después de la ducha o antes de salir para una estela cautivadora.',
    badges: ['Lujo & Seducción', 'Con Lazo de Satén', 'Larga Fijación'],
    inStock: true,
    variants: [
      { id: 'mist-lovely-cherry', name: 'Lovely Cherry (Cereza Negra, Rosa & Almendra con Lazo Dorado)', colorHex: '#881337' },
      { id: 'mist-party-dream', name: 'Party Dream Noir (Ciruela Oscura, Peonía & Ámbar)', colorHex: '#A21CAF' },
      { id: 'mist-noble-berry', name: 'Noble Berry (Frutos del Bosque & Vainilla Bourbon)', colorHex: '#9F1239' }
    ]
  },
  {
    id: 'vvlove-glam-sweet-temptation-mist',
    name: 'V.V.LOVE® Glam Sweet Temptation Fragrance Mist (250ml)',
    subtitle: 'Splash corporal dulce y seductor con tapas glitter y diseños temáticos',
    brand: 'V.V.LOVE®',
    category: 'fragancias',
    categoryLabel: 'Fragancias & Body Mists',
    price: 16.00,
    originalPrice: 22.00,
    rating: 4.8,
    reviewCount: 120,
    image: '/products/vvlove-glam-mist.jpg',
    gallery: [
      '/products/vvlove-glam-mist.jpg'
    ],
    shortDescription: 'Brumas corporales ultra frescas con notas de vainilla dulce, cacao, flores rosadas y bombón frutal en botellas con tapas brillantes.',
    fullDescription: 'Colección de brumas corporales llenas de personalidad y feminidad. Stunner Pour Femme evoca glamour y sensualidad con vainilla oriental; Sweety Cacao cautiva a las amantes del chocolate dulce y la canela; Refreshing Sweet brinda una caricia de malvaviscos y bombones de fresa; y Amazing Pink aporta un halo de frescura floral chispeante.',
    presentation: 'Frasco spray de 250 ml / 8.4 fl. oz. con tapa glitter',
    benefits: [
      'Sensación refrescante e hidratante instantánea',
      'Aromas adictivos ideales para el uso diario',
      'Excelente atomizador con micro-niebla envolvente'
    ],
    howToUse: 'Aplicar en cuello, brazos y cabello para una frescura dulce durante todo el día.',
    badges: ['Tapa Glitter', 'Uso Diario', 'Aroma Femenino'],
    inStock: true,
    variants: [
      { id: 'mist-stunner-femme', name: 'Stunner Pour Femme (Vainilla Oriental & Orquídea)', colorHex: '#F472B6' },
      { id: 'mist-sweety-cacao', name: 'Sweety Cacao (Malteada de Chocolate & Avellanas)', colorHex: '#9333EA' },
      { id: 'mist-refreshing-sweet', name: 'Refreshing Sweet (Bombón de Fresa & Azúcar Glass)', colorHex: '#FDA4AF' },
      { id: 'mist-amazing-pink', name: 'Amazing Pink (Flores Rosadas Chispeantes & Durazno)', colorHex: '#FBCFE8' }
    ]
  }
];
