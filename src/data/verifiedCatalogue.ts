export interface VerifiedCatalogHotel {
  name: string;
  destination: string;
  category: 'budget' | 'mid-range' | 'luxury' | 'boutique-heritage' | 'eco-stay';
  pricePerNightINR: number;
  reviewCount: number;
  isOffbeat: boolean;
  romantic: boolean;
  familyFriendly: boolean;
  tagline: string;
}

export interface VerifiedCatalogActivity {
  name: string;
  destination: string;
  slot: 'morning' | 'afternoon' | 'evening';
  costINR: number;
  reviewCount: number;
  isOffbeat: boolean;
  isKidFriendly: boolean;
  isRomanticDinner?: boolean;
  duration: string;
  description: string;
  interests: string[];
}

export const VERIFIED_CATALOG_HOTELS: VerifiedCatalogHotel[] = [
  // Munnar
  {
    name: 'Windermere Estate Munnar',
    destination: 'Munnar',
    category: 'boutique-heritage',
    pricePerNightINR: 8500,
    reviewCount: 420,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Colonial cardamon & coffee plantation estate overlooking tea hills.'
  },
  {
    name: 'Tea County Munnar (KTDC)',
    destination: 'Munnar',
    category: 'mid-range',
    pricePerNightINR: 5200,
    reviewCount: 1850,
    isOffbeat: false,
    romantic: false,
    familyFriendly: true,
    tagline: 'Nestled between two hills with easy access to Blossom Hydel Park.'
  },
  {
    name: 'Tall Trees Resort Munnar',
    destination: 'Munnar',
    category: 'eco-stay',
    pricePerNightINR: 9200,
    reviewCount: 680,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Cottages built under 600 preserved giant shola forest trees.'
  },
  {
    name: 'Munnar Queen Hotel',
    destination: 'Munnar',
    category: 'budget',
    pricePerNightINR: 2800,
    reviewCount: 1400,
    isOffbeat: false,
    romantic: false,
    familyFriendly: true,
    tagline: 'Scenic budget stay in Chithirapuram with valley views.'
  },
  {
    name: 'Amber Dale Luxury Heritage Munnar',
    destination: 'Munnar',
    category: 'luxury',
    pricePerNightINR: 11500,
    reviewCount: 890,
    isOffbeat: false,
    romantic: true,
    familyFriendly: true,
    tagline: 'Panoramic mist balcony rooms with private jacuzzi suites.'
  },

  // Goa
  {
    name: 'The Postcard Moira (Ancestral Haven)',
    destination: 'Goa',
    category: 'boutique-heritage',
    pricePerNightINR: 9500,
    reviewCount: 140,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Restored 350-year-old Portuguese mansion in Moira banana groves.'
  },
  {
    name: 'Olaulim Backyards Eco Sanctuary',
    destination: 'Goa',
    category: 'eco-stay',
    pricePerNightINR: 5800,
    reviewCount: 310,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Rustic backwater cottages with kayaking & home-cooked meals.'
  },
  {
    name: 'Panjim Heritage Inn - Fontainhas',
    destination: 'Goa',
    category: 'mid-range',
    pricePerNightINR: 3800,
    reviewCount: 820,
    isOffbeat: false,
    romantic: false,
    familyFriendly: true,
    tagline: 'Charming townhouse in the heart of the Portuguese Latin quarter.'
  },
  {
    name: 'Santi Sol Eco Retreat Agonda',
    destination: 'Goa',
    category: 'budget',
    pricePerNightINR: 2400,
    reviewCount: 110,
    isOffbeat: true,
    romantic: true,
    familyFriendly: false,
    tagline: 'Eco-stay tucked away amidst coconut palm valleys.'
  },

  // Jaipur
  {
    name: 'Royal Heritage Haveli Khatipura',
    destination: 'Jaipur',
    category: 'boutique-heritage',
    pricePerNightINR: 7500,
    reviewCount: 420,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Serene 18th-century royal hunting lodge with frescoed dining.'
  },
  {
    name: 'Dera Mandawa Heritage Homestay',
    destination: 'Jaipur',
    category: 'mid-range',
    pricePerNightINR: 4200,
    reviewCount: 190,
    isOffbeat: true,
    romantic: false,
    familyFriendly: true,
    tagline: 'Authentic aristocratic family haveli with slow Rajasthani living.'
  },
  {
    name: 'Umaid Bhawan Heritage House',
    destination: 'Jaipur',
    category: 'budget',
    pricePerNightINR: 2800,
    reviewCount: 2200,
    isOffbeat: false,
    romantic: false,
    familyFriendly: true,
    tagline: 'Classic carved balconies and rooftop pool in Bani Park.'
  },

  // Kerala / Alleppey
  {
    name: 'Emerald Isle Heritage Villa Alleppey',
    destination: 'Kerala',
    category: 'mid-range',
    pricePerNightINR: 4200,
    reviewCount: 320,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: '150-year-old wooden ancestral retreat amidst paddy waterways.'
  },
  {
    name: 'Vanilla County Heritage Homestay Vagamon',
    destination: 'Kerala',
    category: 'eco-stay',
    pricePerNightINR: 5200,
    reviewCount: 115,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: '75-year-old Dutch-style estate bungalow with natural rock pool.'
  },

  // Himachal / Manali
  {
    name: 'The Naggar Castle Heritage Lodge',
    destination: 'Himachal',
    category: 'boutique-heritage',
    pricePerNightINR: 4800,
    reviewCount: 620,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Authentic 15th-century wood & stone castle overlooking Beas river.'
  },
  {
    name: 'Tirthan Riverside Himalayan Homestay',
    destination: 'Himachal',
    category: 'budget',
    pricePerNightINR: 2400,
    reviewCount: 290,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Pristine timber homestay right beside crystal Tirthan river.'
  },
  {
    name: 'Shoja Apple Grove Wooden Chalet',
    destination: 'Himachal',
    category: 'eco-stay',
    pricePerNightINR: 3900,
    reviewCount: 88,
    isOffbeat: true,
    romantic: true,
    familyFriendly: true,
    tagline: 'Off-grid cedarwood hideaway next to Jalori Pass.'
  }
];

export const VERIFIED_CATALOG_ACTIVITIES: VerifiedCatalogActivity[] = [
  // Munnar
  {
    name: 'Lockhart Estate Tea Plantation Walk & Factory Experience',
    destination: 'Munnar',
    slot: 'morning',
    costINR: 450,
    reviewCount: 520,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '2 hours',
    description: 'Guided family stroll through emerald tea slopes showing artisanal orthodox tea processing.',
    interests: ['nature', 'relaxation']
  },
  {
    name: 'Eravikulam National Park Nilgiri Tahr Safari',
    destination: 'Munnar',
    slot: 'morning',
    costINR: 600,
    reviewCount: 3800,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '2.5 hours',
    description: 'Paved, child-safe bus safari to observe the endangered Nilgiri Tahr against misty rolling peaks.',
    interests: ['nature', 'adventure']
  },
  {
    name: 'Kolukkumalai Sunrise 4x4 Jeep Safari',
    destination: 'Munnar',
    slot: 'morning',
    costINR: 1800,
    reviewCount: 820,
    isOffbeat: true,
    isKidFriendly: false,
    duration: '3 hours',
    description: 'Rugged early morning jeep ride to the world highest organic tea estate at 7,900 ft.',
    interests: ['adventure', 'nature']
  },
  {
    name: 'Chinnar Spice Garden Walk & Vanilla Orchid Tour',
    destination: 'Munnar',
    slot: 'afternoon',
    costINR: 350,
    reviewCount: 290,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '1.5 hours',
    description: 'Interactive sensory aroma walk tasting fresh cardamom pods, nutmeg, and organic honey.',
    interests: ['nature', 'food']
  },
  {
    name: 'Mattupetty Lake Boat Ride & Dam Viewpoint',
    destination: 'Munnar',
    slot: 'afternoon',
    costINR: 500,
    reviewCount: 2900,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '2 hours',
    description: 'Leisurely speed boat cruise along the calm reservoir surrounded by eucalyptus trees.',
    interests: ['relaxation', 'nature']
  },
  {
    name: 'Punarjani Traditional Kathakali & Kalaripayattu Cultural Show',
    destination: 'Munnar',
    slot: 'evening',
    costINR: 500,
    reviewCount: 2200,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '2 hours',
    description: 'Mesmerizing evening martial arts feats and classical Kerala dance performance.',
    interests: ['culture']
  },
  {
    name: 'Candlelit Mist-Valley Gazebo Dinner at Windermere Estate',
    destination: 'Munnar',
    slot: 'evening',
    costINR: 2200,
    reviewCount: 180,
    isOffbeat: true,
    isKidFriendly: false,
    isRomanticDinner: true,
    duration: '2 hours',
    description: 'Private candlelit 4-course Malabar spiced dinner under the star-lit Western Ghats canopy.',
    interests: ['food', 'relaxation']
  },
  {
    name: 'Kundala Lakeside Sunset Walk & Pedal Boating',
    destination: 'Munnar',
    slot: 'evening',
    costINR: 250,
    reviewCount: 780,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '1.5 hours',
    description: 'Quiet dusk stroll by the arch dam with pedal boat rides amidst cherry blossom trees.',
    interests: ['relaxation', 'nature']
  },

  // Goa
  {
    name: 'Backwater Kayaking & Otter Spotting in Chorao Island',
    destination: 'Goa',
    slot: 'morning',
    costINR: 1400,
    reviewCount: 120,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '2.5 hours',
    description: 'Paddle silently through dense mangrove canals of Mandovi with local naturalist guide.',
    interests: ['adventure', 'nature']
  },
  {
    name: 'Fontainhas Secret Architectural & Bakery Trail',
    destination: 'Goa',
    slot: 'morning',
    costINR: 950,
    reviewCount: 350,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '2 hours',
    description: 'Taste authentic warm Bebinca and cashew biscuits in an 80-year-old family wood-fired bakery.',
    interests: ['culture', 'food']
  },
  {
    name: 'Sahakari Organic Spice Plantation Tour & Traditional Thali',
    destination: 'Goa',
    slot: 'afternoon',
    costINR: 850,
    reviewCount: 2900,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '3 hours',
    description: 'Aromatic walk amidst vanilla and betelnut trees followed by clay-pot lunch buffet.',
    interests: ['nature', 'food', 'culture']
  },
  {
    name: 'Savoi Secret Cashew Feni Distillation Tasting',
    destination: 'Goa',
    slot: 'afternoon',
    costINR: 1200,
    reviewCount: 80,
    isOffbeat: true,
    isKidFriendly: false,
    duration: '2 hours',
    description: 'Behind-the-scenes family distillery visit with artisanal pairing bites.',
    interests: ['culture', 'food']
  },
  {
    name: 'Romantic Sunset Cliffside Candlelight Dinner at Cabo de Rama',
    destination: 'Goa',
    slot: 'evening',
    costINR: 2400,
    reviewCount: 210,
    isOffbeat: true,
    isKidFriendly: false,
    isRomanticDinner: true,
    duration: '2 hours',
    description: 'Private candlelit dinner on the high cliff overlooking the secluded blue sea bay.',
    interests: ['food', 'relaxation']
  },
  {
    name: 'Cabo de Rama Cliff Sunset & Acoustic Music',
    destination: 'Goa',
    slot: 'evening',
    costINR: 300,
    reviewCount: 210,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '2 hours',
    description: 'Breathtaking high-cliff view overlooking pristine blue sea away from crowded beaches.',
    interests: ['relaxation', 'nature']
  },
  {
    name: 'Sunset Dolphin Cruise at Aguada Bay',
    destination: 'Goa',
    slot: 'evening',
    costINR: 600,
    reviewCount: 4500,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '1.5 hours',
    description: 'Classic boat tour along Arabian sea bay watching schools of humpback dolphins.',
    interests: ['relaxation', 'nature']
  },

  // Jaipur
  {
    name: 'Amer Fort Early Morning Rampart Walk',
    destination: 'Jaipur',
    slot: 'morning',
    costINR: 600,
    reviewCount: 6800,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '2.5 hours',
    description: 'Explore the Sheesh Mahal and rugged hill ramparts before tourist crowds arrive.',
    interests: ['culture', 'nature']
  },
  {
    name: 'Bagru Mud-Resist Block Printing Masterclass with Artisans',
    destination: 'Jaipur',
    slot: 'morning',
    costINR: 1500,
    reviewCount: 160,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '3 hours',
    description: 'Hands-on Dabu vegetable dye block printing directly in the Chippa community hamlet.',
    interests: ['culture']
  },
  {
    name: 'Royal Thali & Ghewar Degustation at Laxmi Mishthan Bhandar',
    destination: 'Jaipur',
    slot: 'afternoon',
    costINR: 850,
    reviewCount: 4600,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '1.5 hours',
    description: 'Legendary Dal Baati Churma, Ker Sangri, and freshly dripping honeycomb Ghewar.',
    interests: ['food', 'culture']
  },
  {
    name: 'Stepwell Panna Meena Kund Geometric Walk',
    destination: 'Jaipur',
    slot: 'afternoon',
    costINR: 200,
    reviewCount: 780,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '1.5 hours',
    description: 'Geometrical marvel stepwell engineered in 16th century with quiet walkways.',
    interests: ['culture']
  },
  {
    name: 'Romantic Candlelit Courtyard Dinner at Royal Heritage Haveli',
    destination: 'Jaipur',
    slot: 'evening',
    costINR: 2800,
    reviewCount: 310,
    isOffbeat: true,
    isKidFriendly: false,
    isRomanticDinner: true,
    duration: '2.5 hours',
    description: 'Candlelit dining by marble fountains with traditional live sitar maestro melodies.',
    interests: ['food', 'culture', 'relaxation']
  },
  {
    name: 'Nahargarh Sunset Point with Churning Tea',
    destination: 'Jaipur',
    slot: 'evening',
    costINR: 350,
    reviewCount: 3100,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '2 hours',
    description: 'Panoramic dusk views looking straight over the twinkling grid of the Pink City.',
    interests: ['relaxation', 'nature']
  },

  // Kerala
  {
    name: 'Narrow Canal Country Canoe Rowing & Toddy Experience',
    destination: 'Kerala',
    slot: 'morning',
    costINR: 1100,
    reviewCount: 180,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '2.5 hours',
    description: 'Glide under low wooden bridges where big houseboats cannot enter with fresh sweet toddy harvesting.',
    interests: ['culture', 'nature']
  },
  {
    name: 'Alleppey Shikkara Boat Cruise with Fish Curry Lunch',
    destination: 'Kerala',
    slot: 'afternoon',
    costINR: 1500,
    reviewCount: 4100,
    isOffbeat: false,
    isKidFriendly: true,
    duration: '3 hours',
    description: 'Breeze through Punnamada backwaters savoring spicy Karimeen in banana leaf wrap.',
    interests: ['relaxation', 'food']
  },
  {
    name: 'Romantic Waterfront Gazebo Dinner on Vembanad Lake',
    destination: 'Kerala',
    slot: 'evening',
    costINR: 2600,
    reviewCount: 140,
    isOffbeat: true,
    isKidFriendly: false,
    isRomanticDinner: true,
    duration: '2 hours',
    description: 'Secluded waterfront candlelit seafood tasting under coconut palms as houseboats drift past.',
    interests: ['food', 'relaxation']
  },
  {
    name: 'Village Temple Theyyam Invocation Vigil',
    destination: 'Kerala',
    slot: 'evening',
    costINR: 400,
    reviewCount: 95,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '2.5 hours',
    description: 'Sacred ritualistic performance in north Malabar sacred grove with fire dancers.',
    interests: ['culture']
  },

  // Himachal
  {
    name: 'Jalori Pass & Serolsar Lake Sacred Oak Forest Trek',
    destination: 'Himachal',
    slot: 'morning',
    costINR: 1200,
    reviewCount: 240,
    isOffbeat: true,
    isKidFriendly: false,
    duration: '4 hours',
    description: 'Walk through golden oak woods to mystical temple lake of Buddhi Nagin.',
    interests: ['adventure', 'nature']
  },
  {
    name: 'Authentic Himachali Dham Feast in Brass Vessels',
    destination: 'Himachal',
    slot: 'afternoon',
    costINR: 650,
    reviewCount: 420,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '1.5 hours',
    description: 'Festive community feast prepared by traditional Botis in pure brass utensils.',
    interests: ['food', 'culture']
  },
  {
    name: 'Romantic Riverside Bonfire & Candlelight Trout Dinner',
    destination: 'Himachal',
    slot: 'evening',
    costINR: 2200,
    reviewCount: 150,
    isOffbeat: true,
    isKidFriendly: false,
    isRomanticDinner: true,
    duration: '2 hours',
    description: 'Cozy private pine needle bonfire and wood-smoked Himalayan river trout dinner by the water.',
    interests: ['food', 'relaxation']
  },
  {
    name: 'Stargazing & Milky Way Photography at Chehni Kothi',
    destination: 'Himachal',
    slot: 'evening',
    costINR: 500,
    reviewCount: 95,
    isOffbeat: true,
    isKidFriendly: true,
    duration: '2 hours',
    description: 'Clear pollution-free night skies next to the tallest indigenous timber tower temple.',
    interests: ['nature', 'culture']
  }
];

export const ALL_VERIFIED_HOTEL_NAMES = VERIFIED_CATALOG_HOTELS.map(h => h.name);
export const ALL_VERIFIED_ACTIVITY_NAMES = VERIFIED_CATALOG_ACTIVITIES.map(a => a.name);
