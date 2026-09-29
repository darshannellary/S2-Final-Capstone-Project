export interface HotelCatalogItem {
  id: string;
  name: string;
  destination: string;
  category: 'budget' | 'mid-range' | 'luxury' | 'boutique-heritage' | 'eco-stay';
  pricePerNightINR: number;
  reviewCount: number; // For anti-bias capping
  isOffbeat: boolean;
  rating: number;
  locationArea: string;
  amenities: string[];
  tagline: string;
}

export interface ActivityCatalogItem {
  id: string;
  name: string;
  destination: string;
  slot: 'morning' | 'afternoon' | 'evening';
  costINR: number;
  reviewCount: number; // For anti-bias capping
  isOffbeat: boolean;
  interests: ('adventure' | 'relaxation' | 'culture' | 'food' | 'nature')[];
  duration: string;
  description: string;
  suitability: {
    kids: boolean;
    seniors: boolean;
  };
}

export interface DestinationCatalog {
  name: string;
  state: string;
  tagline: string;
  heroImage: string;
  hotels: HotelCatalogItem[];
  activities: ActivityCatalogItem[];
}

export const CURATED_DESTINATIONS: Record<string, DestinationCatalog> = {
  Goa: {
    name: 'Goa',
    state: 'Goa',
    tagline: 'Sun, susegad, spice plantations & Portuguese quarters',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    hotels: [
      {
        id: 'goa-h-1',
        name: 'The Postcard Moira (Ancestral Haven)',
        destination: 'Goa',
        category: 'boutique-heritage',
        pricePerNightINR: 9500,
        reviewCount: 140, // Low review count (Offbeat / Curated)
        isOffbeat: true,
        rating: 4.8,
        locationArea: 'Moira, North Goa',
        amenities: ['Artisanal Breakfast', 'Ayurvedic Spa', 'Banana Plantation Walk'],
        tagline: 'Restored 350-year-old Portuguese mansion amidst Moira banana groves.'
      },
      {
        id: 'goa-h-2',
        name: 'Olaulim Backyards Eco Sanctuary',
        destination: 'Goa',
        category: 'eco-stay',
        pricePerNightINR: 5800,
        reviewCount: 310, // Moderate review count
        isOffbeat: true,
        rating: 4.7,
        locationArea: 'Olaulim, Pomburpa',
        amenities: ['Kayaking', 'Goan Home-Cooked Meals', 'Pet Friendly', 'Birdwatching'],
        tagline: 'Rustic cottages on tranquil backwaters, completely free of tourist noise.'
      },
      {
        id: 'goa-h-3',
        name: 'Panjim Heritage Inn - Fontainhas',
        destination: 'Goa',
        category: 'mid-range',
        pricePerNightINR: 3800,
        reviewCount: 820, // Moderate-high
        isOffbeat: false,
        rating: 4.4,
        locationArea: 'Fontainhas, Panjim',
        amenities: ['Free WiFi', 'Heritage Balcony', 'Walking distance to Latin Cafes'],
        tagline: 'Charming pastel townhouse in the heart of Latin quarter.'
      },
      {
        id: 'goa-h-4',
        name: 'Taj Fort Aguada Resort',
        destination: 'Goa',
        category: 'luxury',
        pricePerNightINR: 22000,
        reviewCount: 4200, // Heavy reviewed (capped)
        isOffbeat: false,
        rating: 4.6,
        locationArea: 'Sinquerim Beach',
        amenities: ['Private Beach', 'Infinity Pool', 'Multiple Fine Dining'],
        tagline: 'Iconic cliffside coastal landmark.'
      },
      {
        id: 'goa-h-5',
        name: 'Santi Sol Eco Bamboo Retreat',
        destination: 'Goa',
        category: 'budget',
        pricePerNightINR: 2200,
        reviewCount: 95, // Rare gem
        isOffbeat: true,
        rating: 4.6,
        locationArea: 'Agonda Backcountry',
        amenities: ['Yoga Deck', 'Organic Cafe', 'Solar Powered'],
        tagline: 'Off-grid organic sanctuary nestled between coconut groves.'
      },
      {
        id: 'goa-h-6',
        name: 'Zostel Goa Morjim Village',
        destination: 'Goa',
        category: 'budget',
        pricePerNightINR: 1800,
        reviewCount: 1650, // Popular backpacker
        isOffbeat: false,
        rating: 4.3,
        locationArea: 'Morjim',
        amenities: ['Co-working', 'Rooftop Lounge', 'Cafe'],
        tagline: 'Vibrant community hub close to Olive Ridley turtle nesting beach.'
      }
    ],
    activities: [
      {
        id: 'goa-a-1',
        name: 'Backwater Kayaking & Otter Spotting in Chorao Island',
        destination: 'Goa',
        slot: 'morning',
        costINR: 1400,
        reviewCount: 120, // Offbeat
        isOffbeat: true,
        interests: ['adventure', 'nature'],
        duration: '2.5 hours',
        description: 'Paddle silently through dense mangrove canals of Mandovi with local naturalist guide.',
        suitability: { kids: true, seniors: false }
      },
      {
        id: 'goa-a-2',
        name: 'Fontainhas Secret Architectural & Bakery Trail',
        destination: 'Goa',
        slot: 'morning',
        costINR: 950,
        reviewCount: 350,
        isOffbeat: true,
        interests: ['culture', 'food'],
        duration: '2 hours',
        description: 'Taste authentic warm Bebinca and cashew biscuits in an 80-year-old family wood-fired bakery.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'goa-a-3',
        name: 'Sahakari Organic Spice Plantation Tour & Traditional Thali',
        destination: 'Goa',
        slot: 'afternoon',
        costINR: 850,
        reviewCount: 2900, // Famous listing
        isOffbeat: false,
        interests: ['nature', 'food', 'culture'],
        duration: '3 hours',
        description: 'Aromatic walk amidst vanilla, cardamom, and betelnut trees followed by clay-pot lunch buffet.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'goa-a-4',
        name: 'Savoi Secret Cashew Feni Distillation Tasting',
        destination: 'Goa',
        slot: 'afternoon',
        costINR: 1200,
        reviewCount: 80, // Very offbeat
        isOffbeat: true,
        interests: ['culture', 'food'],
        duration: '2 hours',
        description: 'Behind-the-scenes family distillery visit with artisanal pairing bites.',
        suitability: { kids: false, seniors: true }
      },
      {
        id: 'goa-a-5',
        name: 'Sunset Dolphin Cruise at Aguada Bay',
        destination: 'Goa',
        slot: 'evening',
        costINR: 600,
        reviewCount: 4500, // Heavy reviewed
        isOffbeat: false,
        interests: ['relaxation', 'nature'],
        duration: '1.5 hours',
        description: 'Classic boat tour along Arabian sea bay watching schools of humpback dolphins.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'goa-a-6',
        name: 'Cabo de Rama Cliff Sunset & Acoustic Music',
        destination: 'Goa',
        slot: 'evening',
        costINR: 300,
        reviewCount: 210, // Offbeat
        isOffbeat: true,
        interests: ['relaxation', 'nature'],
        duration: '2 hours',
        description: 'Breathtaking high-cliff view overlooking pristine blue sea away from crowded beaches.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'goa-a-7',
        name: 'Boutique Goan Saraswat Feast at Kokni Kanteen',
        destination: 'Goa',
        slot: 'evening',
        costINR: 1100,
        reviewCount: 880,
        isOffbeat: false,
        interests: ['food', 'culture'],
        duration: '2 hours',
        description: 'Authentic Sol Kadi, Kingfish rava fry, and Tisryo (clams) sukke cooked in home style.',
        suitability: { kids: true, seniors: true }
      }
    ]
  },
  Jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    tagline: 'Palaces, pink sandstone bazars, block-printing & royal flavors',
    heroImage: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1000&q=80',
    hotels: [
      {
        id: 'jai-h-1',
        name: 'Royal Heritage Haveli Khatipura',
        destination: 'Jaipur',
        category: 'boutique-heritage',
        pricePerNightINR: 7500,
        reviewCount: 420, // Moderate
        isOffbeat: true,
        rating: 4.7,
        locationArea: 'Khatipura',
        amenities: ['Marble Courtyard Pool', 'Frescoed Dining', 'Herbal Massages'],
        tagline: 'Serene 18th-century hunting lodge converted into intimate royal retreat.'
      },
      {
        id: 'jai-h-2',
        name: 'Dera Mandawa Heritage Homestay',
        destination: 'Jaipur',
        category: 'mid-range',
        pricePerNightINR: 4200,
        reviewCount: 190, // Low review / genuine local
        isOffbeat: true,
        rating: 4.8,
        locationArea: 'Old City / Sansar Chandra Rd',
        amenities: ['Cooking Classes with Family', 'Organic Garden', 'Spacious Courtyard'],
        tagline: 'Authentic aristocratic family haveli promoting Rajasthani slow living.'
      },
      {
        id: 'jai-h-3',
        name: 'Rambagh Palace Jaipur',
        destination: 'Jaipur',
        category: 'luxury',
        pricePerNightINR: 38000,
        reviewCount: 5200, // Heavy reviewed
        isOffbeat: false,
        rating: 4.9,
        locationArea: 'Bhawani Singh Road',
        amenities: ['Peacock Gardens', 'Palatial Suites', 'Butler Service'],
        tagline: 'The former residence of the Maharaja of Jaipur.'
      },
      {
        id: 'jai-h-4',
        name: 'Umaid Bhawan Heritage House Hotel',
        destination: 'Jaipur',
        category: 'budget',
        pricePerNightINR: 2800,
        reviewCount: 2200, // Popular
        isOffbeat: false,
        rating: 4.3,
        locationArea: 'Bani Park',
        amenities: ['Rooftop Swimming Pool', 'Folk Dance Evenings', 'Restaurant'],
        tagline: 'Classic carved balconies and vibrant frescoes at reasonable tariffs.'
      },
      {
        id: 'jai-h-5',
        name: 'Anopura Agrarian Farm Stay',
        destination: 'Jaipur',
        category: 'boutique-heritage',
        pricePerNightINR: 9000,
        reviewCount: 75, // Hidden gem
        isOffbeat: true,
        rating: 4.9,
        locationArea: 'Aravalli Foothills Outskirts',
        amenities: ['Plunge Pool', 'Farm to Fork Cuisine', 'Horse Riding'],
        tagline: 'An ultra-peaceful rural oasis surrounded by the majestic Aravalli hills.'
      }
    ],
    activities: [
      {
        id: 'jai-a-1',
        name: 'Amer Fort Early Morning Elephant-Free Rampart Walk',
        destination: 'Jaipur',
        slot: 'morning',
        costINR: 600,
        reviewCount: 6800, // Famous
        isOffbeat: false,
        interests: ['culture', 'nature'],
        duration: '2.5 hours',
        description: 'Explore the Sheesh Mahal and rugged hill ramparts before tourist crowds arrive.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'jai-a-2',
        name: 'Bagru Mud-Resist Block Printing Masterclass with Artisans',
        destination: 'Jaipur',
        slot: 'morning',
        costINR: 1500,
        reviewCount: 160, // Offbeat
        isOffbeat: true,
        interests: ['culture', 'adventure'],
        duration: '3 hours',
        description: 'Hands-on Dabu vegetable dye block printing directly in the Chippa community hamlet.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'jai-a-3',
        name: 'Jhalana Leopard Safari in Natural Scrub Forest',
        destination: 'Jaipur',
        slot: 'morning',
        costINR: 2200,
        reviewCount: 890,
        isOffbeat: true,
        interests: ['adventure', 'nature'],
        duration: '3.5 hours',
        description: 'Open-top gypsy safari inside urban wilderness with highest leopard density in world.',
        suitability: { kids: true, seniors: false }
      },
      {
        id: 'jai-a-4',
        name: 'Royal Thali & Ghewar Degustation at Laxmi Mishthan Bhandar',
        destination: 'Jaipur',
        slot: 'afternoon',
        costINR: 850,
        reviewCount: 4600, // Famous
        isOffbeat: false,
        interests: ['food', 'culture'],
        duration: '1.5 hours',
        description: 'Legendary Dal Baati Churma, Ker Sangri, and freshly dripping honeycomb Ghewar.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'jai-a-5',
        name: 'Stepwell Panna Meena Kund & Hidden Step-Corridors',
        destination: 'Jaipur',
        slot: 'afternoon',
        costINR: 200,
        reviewCount: 780,
        isOffbeat: true,
        interests: ['culture', 'nature'],
        duration: '1.5 hours',
        description: 'Geometrical marvel stepwell engineered in 16th century with zero crowd.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'jai-a-6',
        name: 'Nahargarh Sunset Point with Churning Tea',
        destination: 'Jaipur',
        slot: 'evening',
        costINR: 350,
        reviewCount: 3100, // Popular
        isOffbeat: false,
        interests: ['relaxation', 'nature'],
        duration: '2 hours',
        description: 'Panoramic dusk views looking straight over the twinkling grid of the Pink City.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'jai-a-7',
        name: 'Private Sufi & Sitar Twilight Session in Old Haveli',
        destination: 'Jaipur',
        slot: 'evening',
        costINR: 1600,
        reviewCount: 110, // Offbeat
        isOffbeat: true,
        interests: ['culture', 'relaxation'],
        duration: '2 hours',
        description: 'Intimate musical gathering with local Rajasthani folk maestros by candlelit arches.',
        suitability: { kids: true, seniors: true }
      }
    ]
  },
  Kerala: {
    name: 'Kerala',
    state: 'Kerala',
    tagline: 'Verdant tea estates, tranquil backwaters & ayurvedic serenity',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    hotels: [
      {
        id: 'ker-h-1',
        name: 'Vanilla County Heritage Plantation Homestay',
        destination: 'Kerala',
        category: 'eco-stay',
        pricePerNightINR: 5200,
        reviewCount: 115, // Hidden gem
        isOffbeat: true,
        rating: 4.8,
        locationArea: 'Vagamon / Meenachil River',
        amenities: ['Natural Rock Pool', 'Spices & Rubber Trail', 'Organic Syro-Malabar Dinners'],
        tagline: 'A 75-year-old Dutch-style estate bungalow beside babbling natural springs.'
      },
      {
        id: 'ker-h-2',
        name: 'Philipkutty’s Farm Private Island Cottage',
        destination: 'Kerala',
        category: 'boutique-heritage',
        pricePerNightINR: 11000,
        reviewCount: 240, // Low reviews / Exclusive
        isOffbeat: true,
        rating: 4.9,
        locationArea: 'Vembanad Lake, Kumarakom',
        amenities: ['Private Waterfront Porch', 'Canoe Crossings', 'Toddy Shop Tasting'],
        tagline: 'Sustainable farm island reachable only by traditional wooden skiff.'
      },
      {
        id: 'ker-h-3',
        name: 'Brunton Boatyard - CGH Earth',
        destination: 'Kerala',
        category: 'luxury',
        pricePerNightINR: 18500,
        reviewCount: 1450, // Moderate-High
        isOffbeat: false,
        rating: 4.7,
        locationArea: 'Fort Kochi Harbour',
        amenities: ['Harbour Sunset Cruise', 'Historic Shipyard Architecture', 'Seafood Grill'],
        tagline: 'Recreated Victorian shipyard overlooking bustling spice harbour routes.'
      },
      {
        id: 'ker-h-4',
        name: 'Emerald Isle Heritage Villa',
        destination: 'Kerala',
        category: 'mid-range',
        pricePerNightINR: 4100,
        reviewCount: 320,
        isOffbeat: true,
        rating: 4.6,
        locationArea: 'Champakulam, Alleppey',
        amenities: ['Canal-side hammocks', 'Claypot Karimeen Pollichathu', 'Bicycle rides'],
        tagline: '150-year-old wooden ancestral retreat amidst paddy fields.'
      },
      {
        id: 'ker-h-5',
        name: 'Kumarakom Lake Resort',
        destination: 'Kerala',
        category: 'luxury',
        pricePerNightINR: 26000,
        reviewCount: 3900, // Heavy reviewed
        isOffbeat: false,
        rating: 4.6,
        locationArea: 'Kumarakom',
        amenities: ['Meandering Pool', 'Ayurveda Centre', 'Sunset Cruise'],
        tagline: 'Sprawling lakeside resort known for heritage luxury villas.'
      },
      {
        id: 'ker-h-6',
        name: 'Greenwoods Nature Resort Thekkady',
        destination: 'Kerala',
        category: 'budget',
        pricePerNightINR: 3200,
        reviewCount: 1850,
        isOffbeat: false,
        rating: 4.4,
        locationArea: 'Kumily / Periyar',
        amenities: ['Treehouse Coffee Shop', 'Cardamom Walk', 'Pool'],
        tagline: 'Eco-resort nestled within dense spice foliage close to Periyar Tiger Reserve.'
      }
    ],
    activities: [
      {
        id: 'ker-a-1',
        name: 'Narrow Canal Country Canoe Rowing with Toddy Tapper Experience',
        destination: 'Kerala',
        slot: 'morning',
        costINR: 1100,
        reviewCount: 180, // Offbeat
        isOffbeat: true,
        interests: ['culture', 'nature'],
        duration: '2.5 hours',
        description: 'Glide under low wooden bridges where big houseboats cannot enter; watch fresh sweet toddy harvesting.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'ker-a-2',
        name: 'Periyar Tiger Trail Bamboo Rafting & Trek',
        destination: 'Kerala',
        slot: 'morning',
        costINR: 2400,
        reviewCount: 2200, // Popular
        isOffbeat: false,
        interests: ['adventure', 'nature'],
        duration: '4 hours',
        description: 'Guarded by indigenous Mannan tribal guides through evergreen deciduous forest.',
        suitability: { kids: false, seniors: false }
      },
      {
        id: 'ker-a-3',
        name: 'Munnar Kolukkumalai Sunrise 4x4 Jeep Safari (World Highest Tea Estate)',
        destination: 'Kerala',
        slot: 'morning',
        costINR: 1800,
        reviewCount: 820,
        isOffbeat: true,
        interests: ['adventure', 'nature'],
        duration: '3 hours',
        description: 'Watch cloud inversions at 7,900 feet altitude followed by orthodox tea factory tasting.',
        suitability: { kids: true, seniors: false }
      },
      {
        id: 'ker-a-4',
        name: 'Alleppey Shikkara Boat Cruise with Tapioca & Fish Curry Lunch',
        destination: 'Kerala',
        slot: 'afternoon',
        costINR: 1500,
        reviewCount: 4100, // Famous
        isOffbeat: false,
        interests: ['relaxation', 'food'],
        duration: '3 hours',
        description: 'Breeze through Punnamada backwaters savoring spicy Karimeen in banana leaf wrap.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'ker-a-5',
        name: 'Kathakali & Kalaripayattu Ancient Martial Arts Demonstration',
        destination: 'Kerala',
        slot: 'evening',
        costINR: 700,
        reviewCount: 3500, // Famous
        isOffbeat: false,
        interests: ['culture'],
        duration: '2 hours',
        description: 'Witness expressive eye movements, facial makeup application, and flying sword maneuvers.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'ker-a-6',
        name: 'Village Temple Theyyam Invocation Vigil',
        destination: 'Kerala',
        slot: 'evening',
        costINR: 400,
        reviewCount: 95, // Rare/Offbeat
        isOffbeat: true,
        interests: ['culture'],
        duration: '2.5 hours',
        description: 'Sacred ritualistic performance in north Malabar sacred grove with fire dancers and headdresses.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'ker-a-7',
        name: 'Sunset Sunset Herbal Foot Spa & Beach Stroll at Marari',
        destination: 'Kerala',
        slot: 'evening',
        costINR: 1200,
        reviewCount: 240, // Offbeat
        isOffbeat: true,
        interests: ['relaxation', 'nature'],
        duration: '2 hours',
        description: 'Soothing Ayurvedic warm oil foot marma massage directly on white sand fishing village beach.',
        suitability: { kids: true, seniors: true }
      }
    ]
  },
  Himachal: {
    name: 'Himachal',
    state: 'Himachal Pradesh',
    tagline: 'Snow-clad deodars, apple orchards, mountain monasteries & high passes',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',
    hotels: [
      {
        id: 'him-h-1',
        name: 'The Naggar Castle Heritage Lodge',
        destination: 'Himachal',
        category: 'boutique-heritage',
        pricePerNightINR: 4800,
        reviewCount: 620,
        isOffbeat: true,
        rating: 4.6,
        locationArea: 'Naggar, Kullu Valley',
        amenities: ['Wood & Stone Kathkuni Architecture', 'Valley Balcony View', 'Fireplace'],
        tagline: 'Authentic 15th-century castle overlooking Beas river with art gallery.'
      },
      {
        id: 'him-h-2',
        name: 'Shoja Apple Grove Wooden Chalet',
        destination: 'Himachal',
        category: 'eco-stay',
        pricePerNightINR: 3900,
        reviewCount: 88, // Very offbeat
        isOffbeat: true,
        rating: 4.9,
        locationArea: 'Seraj Valley / Shoja',
        amenities: ['Pine needle bonfire', 'Apple orchard walks', 'Himalayan trout dinner'],
        tagline: 'Off-grid cedarwood hideaway next to Jalori Pass with no tourist congestion.'
      },
      {
        id: 'him-h-3',
        name: 'Wildflower Hall, An Oberoi Resort',
        destination: 'Himachal',
        category: 'luxury',
        pricePerNightINR: 34000,
        reviewCount: 3800, // Heavy reviewed
        isOffbeat: false,
        rating: 4.9,
        locationArea: 'Mashobra, Shimla',
        amenities: ['Open-air heated whirlpool', 'Cedar forest trekking', 'Fine dining'],
        tagline: 'Lord Kitchener’s grand colonial mansion set high in pine forests.'
      },
      {
        id: 'him-h-4',
        name: 'Tirthan Riverside Himalayan Homestay',
        destination: 'Himachal',
        category: 'budget',
        pricePerNightINR: 2400,
        reviewCount: 290,
        isOffbeat: true,
        rating: 4.7,
        locationArea: 'Gushaini, Tirthan Valley',
        amenities: ['Riverbank sound', 'Home cooked siddu', 'Angling permit assistance'],
        tagline: 'Pristine wooden homestay right next to crystal clean Tirthan river.'
      },
      {
        id: 'him-h-5',
        name: 'The Himalayan Manali - Castle Resort',
        destination: 'Himachal',
        category: 'mid-range',
        pricePerNightINR: 7800,
        reviewCount: 1600, // Popular
        isOffbeat: false,
        rating: 4.5,
        locationArea: 'Hadimba Temple Rd, Manali',
        amenities: ['Gothic fireplaces', 'Heated pool', 'Mountain views'],
        tagline: 'Victorian-Gothic revival castle built with local stone.'
      }
    ],
    activities: [
      {
        id: 'him-a-1',
        name: 'Jalori Pass & Serolsar Lake Sacred Oak Forest Trek',
        destination: 'Himachal',
        slot: 'morning',
        costINR: 1200,
        reviewCount: 240, // Offbeat
        isOffbeat: true,
        interests: ['adventure', 'nature'],
        duration: '4 hours',
        description: 'Gentle walk through golden oak woods to the mystical temple lake of Buddhi Nagin.',
        suitability: { kids: true, seniors: false }
      },
      {
        id: 'him-a-2',
        name: 'Solang Valley Paragliding & Ropeway Flight',
        destination: 'Himachal',
        slot: 'morning',
        costINR: 3200,
        reviewCount: 5800, // Heavy reviewed
        isOffbeat: false,
        interests: ['adventure'],
        duration: '2 hours',
        description: 'Tandem paragliding glide over pine tops with thrilling aerial mountain panorama.',
        suitability: { kids: false, seniors: false }
      },
      {
        id: 'him-a-3',
        name: 'Dharamkot & Kangra Tea Estate Secret Forest Trail',
        destination: 'Himachal',
        slot: 'morning',
        costINR: 600,
        reviewCount: 310,
        isOffbeat: true,
        interests: ['nature', 'relaxation'],
        duration: '2 hours',
        description: 'Quiet aroma trail through heritage Kangra tea bushes overlooking Dhauladhar peaks.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'him-a-4',
        name: 'Authentic Himachali Dham Feast (Madra, Babru, Bhey) in Traditional Thali',
        destination: 'Himachal',
        slot: 'afternoon',
        costINR: 650,
        reviewCount: 420,
        isOffbeat: true,
        interests: ['food', 'culture'],
        duration: '1.5 hours',
        description: 'Festive community feast prepared by traditional Botis in pure brass utensils.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'him-a-5',
        name: 'Old Manali Apple Cider & Live Indie Acoustic Evening',
        destination: 'Himachal',
        slot: 'evening',
        costINR: 900,
        reviewCount: 2200, // Popular
        isOffbeat: false,
        interests: ['food', 'relaxation'],
        duration: '2.5 hours',
        description: 'Cozy fireplace lounge with artisanal woodfired pizzas and local fresh fermented apple cider.',
        suitability: { kids: false, seniors: true }
      },
      {
        id: 'him-a-6',
        name: 'Stargazing & Milky Way Photography at Chehni Kothi Fort',
        destination: 'Himachal',
        slot: 'evening',
        costINR: 500,
        reviewCount: 95, // Rare / Offbeat
        isOffbeat: true,
        interests: ['nature', 'culture'],
        duration: '2.5 hours',
        description: 'Clear pollution-free night skies next to the tallest indigenous timber tower temple in Western Himalayas.',
        suitability: { kids: true, seniors: true }
      }
    ]
  },
  Varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    tagline: 'Eternal river ghats, morning chants, silk weaving & devotional aura',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',
    hotels: [
      {
        id: 'var-h-1',
        name: 'BrijRama Palace Heritage Hotel',
        destination: 'Varanasi',
        category: 'luxury',
        pricePerNightINR: 24000,
        reviewCount: 2800, // Moderate-High
        isOffbeat: false,
        rating: 4.8,
        locationArea: 'Darbhanga Ghat',
        amenities: ['Ghat Elevator', 'Classical Indian Music Recitals', 'Vegetarian Gourmet'],
        tagline: 'Palatial 18th-century Maratha fort directly perched on the holy Ganges ghats.'
      },
      {
        id: 'var-h-2',
        name: 'Amritara Suryauday Haveli',
        destination: 'Varanasi',
        category: 'boutique-heritage',
        pricePerNightINR: 7800,
        reviewCount: 680,
        isOffbeat: true,
        rating: 4.6,
        locationArea: 'Shivala Ghat',
        amenities: ['Private Sunrise Terrace', 'Yoga Sessions', 'Boat Jetty'],
        tagline: 'Charming Rajput mansion built by the Royal Family of Nepal.'
      },
      {
        id: 'var-h-3',
        name: 'Ganga Monastery Riverside Guest House',
        destination: 'Varanasi',
        category: 'budget',
        pricePerNightINR: 1900,
        reviewCount: 160, // Low reviews / Offbeat
        isOffbeat: true,
        rating: 4.5,
        locationArea: 'Assi Ghat Lanes',
        amenities: ['Rooftop Ganges View', 'Morning Chai', 'Library'],
        tagline: 'Peaceful spiritual sanctuary situated in serene Assi alleyways.'
      },
      {
        id: 'var-h-4',
        name: 'Taj Ganges Varanasi',
        destination: 'Varanasi',
        category: 'luxury',
        pricePerNightINR: 16000,
        reviewCount: 3900, // Heavy reviewed
        isOffbeat: false,
        rating: 4.6,
        locationArea: 'Cantonment',
        amenities: ['12 Acres Greenery', 'Spa', 'Pool'],
        tagline: 'Oasis of calm in lush cantonment greens.'
      }
    ],
    activities: [
      {
        id: 'var-a-1',
        name: 'Subah-e-Banaras Dawn Rowing Boat & Classical Raga Performance',
        destination: 'Varanasi',
        slot: 'morning',
        costINR: 800,
        reviewCount: 4200, // Popular
        isOffbeat: false,
        interests: ['culture', 'relaxation'],
        duration: '2 hours',
        description: 'Watch the sunrise bathe the ancient terracotta ghats as temple bells chime and morning chants echo.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'var-a-2',
        name: 'Lallapura Zari Silk Weaving Guild & Master Weaver Workshop',
        destination: 'Varanasi',
        slot: 'morning',
        costINR: 650,
        reviewCount: 110, // Offbeat
        isOffbeat: true,
        interests: ['culture'],
        duration: '2.5 hours',
        description: 'Observe traditional wooden jacquard handloom weavers creating pure silver thread Banarasi saris.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'var-a-3',
        name: 'Hidden Galli Food Trail: Malaiyo, Tamatar Chaat & Blue Lassi',
        destination: 'Varanasi',
        slot: 'afternoon',
        costINR: 500,
        reviewCount: 1400,
        isOffbeat: true,
        interests: ['food', 'culture'],
        duration: '2 hours',
        description: 'Taste the frothy winter saffron cloud Malaiyo, sizzling spicy tomato chaat, and creamy claypot curd.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'var-a-4',
        name: 'Grand Dashashwamedh Ghat Maha Aarti with Reserved Boat Deck',
        destination: 'Varanasi',
        slot: 'evening',
        costINR: 1100,
        reviewCount: 7500, // Heavy reviewed
        isOffbeat: false,
        interests: ['culture', 'relaxation'],
        duration: '2 hours',
        description: 'Spectacular synchronization of brass fire lamps, conch shells, and incense smoke from the river.',
        suitability: { kids: true, seniors: true }
      },
      {
        id: 'var-a-5',
        name: 'Boat Ride to Secluded Sand Dunes Across Ganges with Campfire Tea',
        destination: 'Varanasi',
        slot: 'evening',
        costINR: 750,
        reviewCount: 130, // Offbeat
        isOffbeat: true,
        interests: ['relaxation', 'nature'],
        duration: '2 hours',
        description: 'Step onto the uninhabited eastern bank sand dunes gazing back at the illuminated city skyline.',
        suitability: { kids: true, seniors: true }
      }
    ]
  }
};

export const AVAILABLE_DESTINATIONS = Object.keys(CURATED_DESTINATIONS);
