export const houses = [
  {
    id: "1",
    title: "Studio moderne",
    city: "Dakar",
    district: "Almadies",
    type: "Studio",

    price: 250000,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    rating: 4.8,
    isNew: true,

    images: [
      require("../assets/images/image2.jpg"),
      require("../assets/images/image1.jpg"),
      require("../assets/images/image4.jpg"),
    ],

    description:
      "Un studio confortable situé dans un quartier calme proche de toutes les commodités.",

    features: ["WiFi", "Climatisation", "Parking", "Cuisine équipée"],
  },

  {
    id: "2",
    title: "Appartement luxueux",
    city: "Dakar",
    district: "Plateau",
    type: "Appartement",

    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    rating: 4.9,
    isNew: false,

    images: [
      require("../assets/images/image1.jpg"),
      require("../assets/images/image5.jpg"),
      require("../assets/images/image2.jpg"),
    ],

    description:
      "Appartement spacieux avec une belle vue et un intérieur moderne.",

    features: ["Balcon", "Sécurité 24h", "Parking", "Ascenseur"],
  },

  {
    id: "3",
    title: "Studio moderne",
    city: "Dakar",
    district: "Ouest Foire",
    type: "Studio",

    price: 250000,
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    rating: 4.7,
    isNew: true,

    images: [
      require("../assets/images/image4.jpg"),
      require("../assets/images/image2.jpg"),
      require("../assets/images/image5.jpg"),
    ],

    description: "Studio lumineux proche des commerces et des transports.",

    features: ["WiFi", "Climatisation", "Parking"],
  },

  {
    id: "4",
    title: "Maison familiale",
    city: "Dakar",
    district: "Dalifort",
    type: "Maison",

    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    rating: 4.6,
    isNew: false,
    images: [
      require("../assets/images/image5.jpg"),
      require("../assets/images/image4.jpg"),
      require("../assets/images/image1.jpg"),
    ],

    description: "Maison idéale pour une famille avec un grand espace de vie.",

    features: ["Jardin", "Garage", "Terrasse", "Cuisine équipée"],
  },

  {
    id: "5",
    title: "Villa",
    city: "Dakar",
    district: "Mariste",
    type: "Villa",
    
    price: 500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    rating: 4.6,
    isNew: true,
    images: [
      require("../assets/images/image4.jpg"),
      require("../assets/images/image5.jpg"),
      require("../assets/images/image1.jpg"),
    ],

    description: "Idéale pour une famille avec un grand espace de vie.",

    features: ["Jardin", "Garage", "Terrasse", "Cuisine équipée", "Climatisation"],
  },
];