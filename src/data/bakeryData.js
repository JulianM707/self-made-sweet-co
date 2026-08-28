export const CATEGORIES = [
  { id: 'all', name: 'All Signature Bakes', icon: 'Sparkles' },
  { id: 'cheesecake', name: 'Cheesecakes', icon: 'PieChart' },
  { id: 'tiramisu', name: 'Tiramisu', icon: 'Coffee' },
  { id: 'cakes', name: 'Cakes', icon: 'Cake' },
  { id: 'muffins', name: 'Muffins', icon: 'Coffee' },
  { id: 'cookies', name: 'Cookies', icon: 'Cookie' }
];

export const PRODUCTS = [
  {
    id: 'classic-cheesecake',
    name: 'Classic Artisan Cheesecake',
    category: 'cheesecake',
    priceSlice: 7.50,
    priceWhole: 42.00,
    rating: 5.0,
    reviewsCount: 0,
    image: '/images/basque_cheesecake_1786065253639.jpg',
    isOutOfStock: true,
    description: 'My signature velvety cream cheese, sour cream & fresh lemon zest filling baked low and slow in a buttery Graham cracker crust. Top with house-made jammy strawberry sauce or wild blueberry compote!',
    dietary: ['Gluten-Free Available', 'Custom Crust Option'],
    prepTime: 'Same Day Pickup',
    ingredients: [
      'Real Block Cream Cheese', 
      'Fresh Sour Cream & Lemon Zest', 
      'Pure Vanilla Extract', 
      'Butter Graham Cracker Crust',
      'Optional Toasted Macadamia Nuts',
      'Fresh Simmered Strawberry Compote'
    ],
    badge: 'Signature House Bake',
    hasCustomizations: true,
    toppingOptions: [
      { id: 'plain', name: 'Classic Plain (No Fruit Topping)', price: 0 },
      { id: 'strawberry', name: 'Jammy Strawberry Sauce (Fresh Strawberries & Lemon Juice)', price: 2.00, image: '/images/strawberry_cheesecake_1786065683977.jpg' },
      { id: 'blueberry', name: 'Wild Blueberry Compote', price: 2.00 }
    ],
    crustOptions: [
      { id: 'classic-crust', name: 'Classic Graham Cracker Crust', price: 0 },
      { id: 'macadamia-crust', name: 'Macadamia Nut Graham Cracker Crust', price: 2.50 }
    ]
  },
  {
    id: 'regular-tiramisu',
    name: 'Classic Venetian Tiramisu',
    category: 'tiramisu',
    priceSlice: 8.50,
    priceWhole: 48.00,
    rating: 5.0,
    reviewsCount: 0,
    image: '/images/espresso_tiramisu_1786065261884.jpg',
    description: 'Light, fluffy whipped mascarpone cream layered with espresso-soaked Savoiardi Italian ladyfingers and finished with cocoa powder.',
    dietary: ['Eggless Recipe', 'Nut-Free'],
    prepTime: 'Same Day Pickup',
    ingredients: [
      'Italian Mascarpone Cheese', 
      'Fresh Heavy Whipping Cream', 
      'Savoiardi Italian Ladyfingers', 
      'Cold Brewed Espresso', 
      'Optional Kahlua / Dark Rum Accent',
      'Valrhona Cocoa Powder'
    ],
    badge: 'Handcrafted Classic'
  },
  {
    id: 'blueberry-muffin',
    name: 'Wild Blueberry Streusel Muffin',
    category: 'muffins',
    priceSlice: 4.50,
    priceWhole: 24.00,
    rating: 5.0,
    reviewsCount: 0,
    image: '/images/berry_muffins_1786065279996.jpg',
    description: 'Overflowing with fresh juicy blueberries (a full pint per batch!) and topped with a cold-butter cinnamon brown sugar streusel crumble.',
    dietary: ['Nut-Free'],
    prepTime: 'Baked Fresh 8AM Daily',
    ingredients: [
      'Fresh Wild Blueberries (Full Pint)', 
      'Brown Sugar Cinnamon Streusel', 
      'Unsalted Butter & Farm Eggs', 
      'Vanilla Extract', 
      'Organic Flour'
    ],
    badge: 'Fresh Morning Bake'
  },
  {
    id: 'cinnamon-coffee-cake',
    name: 'Cinnamon Streusel Coffee Cake',
    category: 'cakes',
    priceSlice: 6.50,
    priceWhole: 36.00,
    rating: 5.0,
    reviewsCount: 0,
    image: '/images/coffee_cake_1786065744321.jpg',
    description: 'Features a tender vanilla cake layered with a brown sugar cinnamon swirl, topped with extra cinnamon crumble and drizzled with melted butter.',
    dietary: ['Nut-Free'],
    prepTime: 'Same Day Pickup',
    ingredients: [
      'Light Brown Sugar Cinnamon Swirl', 
      'Pure Vanilla Extract', 
      'Melted Butter Drizzle', 
      'Unbleached All-Purpose Flour', 
      'Farm Eggs & Whole Milk'
    ],
    badge: 'Baker Specialty'
  },
  {
    id: 'chocolate-chip-cookie',
    name: 'Gourmet Chocolate Chip Cookie',
    category: 'cookies',
    priceSlice: 3.50,
    priceWhole: 18.00,
    rating: 5.0,
    reviewsCount: 0,
    image: '/images/chocolate_chip_cookies.jpg',
    description: 'Golden-brown crisp edges with soft, warm gooey melted chocolate centers. Baked fresh daily with real creamy butter, dark brown sugar, and pure vanilla extract.',
    dietary: ['Nut-Free', 'Fresh Baked Daily'],
    prepTime: 'Baked Fresh Daily',
    ingredients: [
      'Real Creamy Butter', 
      'Dark Brown & Granulated Sugar', 
      'Pure Vanilla Extract', 
      'Farm Eggs & All-Purpose Flour', 
      'Melted Chocolate Chunks', 
      'Baking Soda & Sea Salt'
    ],
    badge: 'Customer Favorite'
  }
];

export const CUSTOMIZER_OPTIONS = {
  bases: [
    { id: 'classic-cheesecake', name: 'Classic Artisan Cheesecake Base', price: 0, desc: 'Sour cream & lemon zest cream cheese base' },
    { id: 'vanilla-sponge', name: 'Tender Vanilla Bean Sponge Cake Base', price: 0, desc: 'Fluffy organic vanilla sponge cake' }
  ],
  sizes: [
    { id: '8inch', name: '8" Whole Cake / Pie (Serves 8-10)', price: 42.00 },
    { id: '10inch', name: '10" Large Party Size (Serves 14-16)', price: 58.00 }
  ],
  fillings: [
    { id: 'none', name: 'No Filling (Classic Base Only)', price: 0 },
    { id: 'strawberry-sauce', name: 'House Jammy Strawberry Compote', price: 3.00 },
    { id: 'espresso-mascarpone', name: 'Whipped Italian Mascarpone Cream', price: 4.00 }
  ],
  toppings: [
    { id: 'cinnamon-crumble', name: 'Cinnamon Streusel Crumble', price: 2.00 },
    { id: 'macadamia', name: 'Toasted Macadamia Nut Crumble', price: 3.00 },
    { id: 'chocolate-drizzle', name: 'Gourmet Dark Chocolate Drizzle', price: 2.50 }
  ]
};

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "Step 1 of 3: Occasion & Vibe",
    subtitle: "When or how do you plan to enjoy your sweet treat?",
    question: "What's the occasion?",
    options: [
      { label: "🌅 Morning coffee or breakfast treat", category: "muffins" },
      { label: "☕ Afternoon coffee break or mid-day pick-me-up", category: "cakes" },
      { label: "🍷 Evening dinner party or special celebration", category: "cheesecake" },
      { label: "🇮🇹 Sophisticated dessert after a delicious meal", category: "tiramisu" },
      { label: "🍪 Late-night snack or quick comfort treat", category: "cookies" }
    ]
  },
  {
    id: 2,
    title: "Step 2 of 3: Flavor Notes",
    subtitle: "Which taste profile sounds most irresistible to you right now?",
    question: "Which flavor note speaks to your soul?",
    options: [
      { label: "🍋 Creamy lemon zest & sweet strawberry jam", category: "cheesecake" },
      { label: "☕ Dark roasted espresso & cocoa powder", category: "tiramisu" },
      { label: "🫐 Fresh wild berries & cinnamon streusel", category: "muffins" },
      { label: "🥮 Warm brown sugar cinnamon swirl", category: "cakes" },
      { label: "🍫 Rich melted dark chocolate chunks", category: "cookies" }
    ]
  },
  {
    id: 3,
    title: "Step 3 of 3: Texture Preference",
    subtitle: "How do you like your baked goods to feel when you take a bite?",
    question: "What is your favorite dessert texture?",
    options: [
      { label: "🍰 Smooth, velvety & rich cream cheese density", category: "cheesecake" },
      { label: "☁️ Silky, airy & light whipped cream layers", category: "tiramisu" },
      { label: "🧁 Soft moist sponge with a buttery streusel crunch", category: "muffins" },
      { label: "🍰 Tender crumb cake with gooey cinnamon swirl", category: "cakes" },
      { label: "🍪 Crisp golden edges with a warm, soft center", category: "cookies" }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-9021',
    customerName: 'Marcus Vance',
    email: 'marcus.vance@gmail.com',
    phone: '(916) 555-0142',
    fulfillment: 'Store Pickup',
    dateSlot: 'Today @ 2:30 PM',
    paymentMethod: 'Venmo (@SelfMadeSweetCo)',
    items: [
      { name: 'Classic Artisan Cheesecake (Slice)', qty: 2, price: 15.00 },
      { name: 'Wild Blueberry Streusel Muffin', qty: 1, price: 4.50 }
    ],
    total: 19.50,
    status: 'In Oven',
    note: 'Extra strawberry sauce on the side please!'
  },
  {
    id: 'ORD-8944',
    customerName: 'Elena Rostova',
    email: 'elena.r@yahoo.com',
    phone: '(707) 555-0199',
    fulfillment: 'Sacramento Local Delivery',
    dateSlot: 'Tomorrow @ 11:00 AM',
    paymentMethod: 'Cash App ($SelfMadeSweetCo)',
    items: [
      { name: 'Classic Venetian Tiramisu (Whole Tray)', qty: 1, price: 48.00 }
    ],
    total: 48.00,
    status: 'Pending Prep',
    note: 'Delivery to front lobby receptionist'
  }
];

// INITIAL REVIEWS IS NOW EMPTY BY DEFAULT - ONLY REAL REVIEWS FROM REAL CUSTOMERS
export const INITIAL_REVIEWS = [];
