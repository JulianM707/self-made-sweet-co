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
    rating: 4.99,
    reviewsCount: 230,
    image: '/images/basque_cheesecake_1786065253639.jpg',
    description: 'Our signature velvety cream cheese, sour cream & fresh lemon zest filling baked low and slow in a buttery Graham cracker crust. Top with house-made jammy strawberry sauce or wild blueberry compote!',
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
    rating: 4.97,
    reviewsCount: 7118,
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
    rating: 4.97,
    reviewsCount: 2033,
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
    rating: 4.99,
    reviewsCount: 2600,
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
    rating: 4.98,
    reviewsCount: 16986,
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
    { id: 'tiramisu-soaked', name: 'Venetian Tiramisu Base', price: 6, desc: 'Espresso-soaked Savoiardi & mascarpone whip' },
    { id: 'blueberry-muffin-base', name: 'Wild Blueberry Muffin Base', price: 3, desc: 'Fresh blueberry batter & brown sugar streusel' },
    { id: 'cinnamon-coffee', name: 'Cinnamon Swirl Coffee Cake Base', price: 4, desc: 'Brown sugar cinnamon swirl cake' }
  ],
  sizes: [
    { id: 'mini-6', name: 'Mini 6" (Serves 4-6)', multiplier: 1, basePrice: 35 },
    { id: 'standard-8', name: 'Standard 8" (Serves 8-10)', multiplier: 1.5, basePrice: 48 },
    { id: 'party-10', name: 'Party 10" (Serves 14-16)', multiplier: 2.0, basePrice: 68 }
  ],
  fillings: [
    { id: 'mascarpone', name: 'Whipped Heavy Cream Mascarpone', price: 0 },
    { id: 'strawberry-compote', name: 'Jammy Strawberry Sauce', price: 4 },
    { id: 'cinnamon-swirl', name: 'Extra Cinnamon Brown Sugar Layer', price: 3.50 }
  ],
  toppings: [
    { id: 'macadamia-crust-option', name: 'Macadamia Nut Crust Upgrade', price: 2.50 },
    { id: 'strawberry-topping', name: 'Fresh Jammy Strawberry Topping', price: 3 },
    { id: 'butter-cinnamon-drizzle', name: 'Warm Butter & Cinnamon Streusel Drizzle', price: 2 }
  ]
};

export const INITIAL_ORDERS = [
  {
    id: 'ORD-1092',
    customerName: 'Coffee & Cookie Enthusiast',
    email: 'cookie.fan@example.com',
    phone: '(555) 321-9876',
    items: [
      { name: 'Cinnamon Streusel Coffee Cake (Whole)', qty: 1, price: 36.00 },
      { name: 'Gourmet Chocolate Chip Cookie (6-Pack Box)', qty: 1, price: 18.00 }
    ],
    total: 54.00,
    fulfillment: 'Store Pickup',
    dateSlot: 'Today at 4:30 PM',
    status: 'In Oven',
    createdAt: '5 mins ago',
    note: 'Fresh cookies with gooey centers!'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'occasion',
    question: 'What vibe or occasion are you indulging in today?',
    options: [
      { label: '☕ Morning coffee & cozy breakfast indulgence', score: 'muffins' },
      { label: '🍷 Sophisticated evening dessert after dinner', score: 'tiramisu' },
      { label: '🎉 Special celebration or family gathering', score: 'cheesecake' },
      { label: '🍪 Mid-day sweet reward or snack craving', score: 'cookies' },
      { label: '☕ Afternoon coffee break with brown sugar crumble', score: 'cakes' }
    ]
  },
  {
    id: 'flavor',
    question: 'Which key flavor note speaks to your soul right now?',
    options: [
      { label: '🍋 Rich, velvety cream cheese with lemon zest & fruit', score: 'cheesecake' },
      { label: '☕ Cold-brewed espresso & light Italian mascarpone whip', score: 'tiramisu' },
      { label: '🫐 Fresh wild blueberries bursting in every bite', score: 'muffins' },
      { label: '🧈 Warm cinnamon swirl with buttery streusel drizzle', score: 'cakes' },
      { label: '🍫 Creamy butter & warm melted chocolate chunks', score: 'cookies' }
    ]
  },
  {
    id: 'texture',
    question: 'What is your absolute favorite dessert texture?',
    options: [
      { label: '🍮 Smooth & velvety with a crunchy Graham / Macadamia crust', score: 'cheesecake' },
      { label: '☁️ Silky, airy whipped cream layered with soft ladyfingers', score: 'tiramisu' },
      { label: '🧁 Tender bakery-dome cake crowned with streusel crumble', score: 'muffins' },
      { label: '🥮 Moist vanilla sponge split with a brown sugar cinnamon swirl', score: 'cakes' },
      { label: '🍪 Crisp golden-brown edges with a soft, gooey chocolate center', score: 'cookies' }
    ]
  }
];
