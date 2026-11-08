export const starterRestaurants = [
  {
    id: "r1", name: "Spice Route", cuisine: "South Indian", rating: 4.7,
    time: "20–30 min", fee: 25, category: "Indian", emoji: "🍛",
    color: "peach", offer: "20% OFF up to ₹100",
    description: "Comforting South Indian favourites, made fresh.",
    menu: [
      { id: "m11", name: "Masala Dosa", description: "Crispy dosa with potato masala and chutneys", price: 120, emoji: "🥞", popular: true },
      { id: "m12", name: "Idli Sambar", description: "Soft idlis served with hot sambar", price: 75, emoji: "🥣" },
      { id: "m13", name: "Paneer Biryani", description: "Aromatic basmati rice with paneer and spices", price: 190, emoji: "🍚", popular: true },
      { id: "m14", name: "Filter Coffee", description: "Traditional strong South Indian coffee", price: 45, emoji: "☕" }
    ]
  },
  {
    id: "r2", name: "Burger Barn", cuisine: "Burgers & Fast Food", rating: 4.5,
    time: "25–35 min", fee: 30, category: "Fast Food", emoji: "🍔",
    color: "yellow", offer: "Free fries on orders over ₹299",
    description: "Juicy burgers, loaded fries and cool drinks.",
    menu: [
      { id: "m21", name: "Classic Veg Burger", description: "Crispy patty, lettuce and house sauce", price: 149, emoji: "🍔", popular: true },
      { id: "m22", name: "Paneer Tikka Burger", description: "Spiced paneer, onions and mint mayo", price: 189, emoji: "🍔" },
      { id: "m23", name: "Peri Peri Fries", description: "Golden fries tossed in peri peri seasoning", price: 99, emoji: "🍟" },
      { id: "m24", name: "Cold Coffee", description: "Chilled coffee with a creamy finish", price: 89, emoji: "🥤" }
    ]
  },
  {
    id: "r3", name: "Wok This Way", cuisine: "Asian & Chinese", rating: 4.6,
    time: "30–40 min", fee: 20, category: "Asian", emoji: "🍜",
    color: "lavender", offer: "Flat ₹75 OFF above ₹399",
    description: "Noodles, rice bowls and wok-tossed classics.",
    menu: [
      { id: "m31", name: "Veg Hakka Noodles", description: "Wok-tossed noodles with crunchy vegetables", price: 160, emoji: "🍜", popular: true },
      { id: "m32", name: "Chilli Paneer", description: "Paneer cubes in a spicy Indo-Chinese sauce", price: 210, emoji: "🥘" },
      { id: "m33", name: "Schezwan Fried Rice", description: "Spicy rice with vegetables and spring onion", price: 175, emoji: "🍚" },
      { id: "m34", name: "Momos (6 pcs)", description: "Steamed vegetable momos with red chutney", price: 130, emoji: "🥟" }
    ]
  },
  {
    id: "r4", name: "The Sweet Spot", cuisine: "Desserts & Beverages", rating: 4.8,
    time: "15–25 min", fee: 15, category: "Desserts", emoji: "🍰",
    color: "pink", offer: "Buy 1 Get 1 on select desserts",
    description: "A little something sweet for every occasion.",
    menu: [
      { id: "m41", name: "Chocolate Brownie", description: "Warm fudgy brownie with chocolate chips", price: 110, emoji: "🍫", popular: true },
      { id: "m42", name: "Red Velvet Cake", description: "A soft slice with cream cheese frosting", price: 145, emoji: "🍰" },
      { id: "m43", name: "Mango Milkshake", description: "Thick seasonal mango milkshake", price: 120, emoji: "🥭" },
      { id: "m44", name: "Gulab Jamun (2 pcs)", description: "Soft khoya dumplings in sugar syrup", price: 65, emoji: "🍡" }
    ]
  },
  {
    id: "r5", name: "Green Bowl", cuisine: "Healthy & Salads", rating: 4.4,
    time: "20–30 min", fee: 25, category: "Healthy", emoji: "🥗",
    color: "mint", offer: "15% OFF healthy bowls",
    description: "Fresh bowls, wholesome wraps and nourishing salads.",
    menu: [
      { id: "m51", name: "Paneer Protein Bowl", description: "Paneer, quinoa, greens and lemon dressing", price: 220, emoji: "🥗", popular: true },
      { id: "m52", name: "Mediterranean Wrap", description: "Hummus, veggies and paneer in a soft wrap", price: 175, emoji: "🌯" },
      { id: "m53", name: "Sprout Salad", description: "Fresh sprouts, cucumber, tomato and lime", price: 115, emoji: "🥬" },
      { id: "m54", name: "Fresh Lime Soda", description: "Refreshing sweet and salty lime soda", price: 60, emoji: "🍋" }
    ]
  },
  {
    id: "r6", name: "Pizza District", cuisine: "Pizza & Italian", rating: 4.3,
    time: "25–35 min", fee: 35, category: "Fast Food", emoji: "🍕",
    color: "blue", offer: "Free garlic bread above ₹499",
    description: "Stone-baked pizzas with generous toppings.",
    menu: [
      { id: "m61", name: "Margherita Pizza", description: "Classic tomato, mozzarella and basil", price: 249, emoji: "🍕", popular: true },
      { id: "m62", name: "Farmhouse Pizza", description: "Onion, capsicum, mushroom and corn", price: 329, emoji: "🍕" },
      { id: "m63", name: "Garlic Bread", description: "Toasted bread with garlic butter", price: 109, emoji: "🥖" },
      { id: "m64", name: "Pasta Alfredo", description: "Creamy white sauce pasta with herbs", price: 199, emoji: "🍝" }
    ]
  }
];

export const categories = ["All", "Indian", "Fast Food", "Asian", "Desserts", "Healthy"];
