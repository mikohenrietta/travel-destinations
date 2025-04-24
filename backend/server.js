import express from "express";
import cors from "cors";
import { body, param, validationResult } from "express-validator";
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let destinations = [
    {
      id: 1,
      name: "Colosseum",
      picture: "/colosseum.jpg",
      description: "An ancient amphitheater in Rome, the Colosseum is one of the most famous landmarks of the Roman Empire. Built in 72 AD and completed in 80 AD, it hosted gladiator fights, public spectacles, and dramatic performances. Today, it stands as a powerful reminder of Rome's architectural and engineering brilliance.",
      address: "Regio III Isis et Serapis, Rome, Italy",
      country: "Italy",
      continent: "Europe",
      rating: 7.6
    },
    {
      id: 2,
      name: "Machu Picchu",
      picture: "/machupicchu.jpg",
      description: "Hidden in the Andes mountains of Peru, Machu Picchu is an ancient Incan city known for its breathtaking stone structures and panoramic views. Built in the 15th century, it remains a symbol of Incan civilization and a must-visit for history and nature lovers.",
      address: "Urubamba, Cusco, Peru",
      country: "Peru",
      continent: "South America",
      rating: 8.4
    },
    {
      id: 3,
      name: "Eiffel Tower",
      picture: "/eiffel.jpg",
      description: "One of the most iconic structures in the world, the Eiffel Tower was built in 1889 as the entrance arch for the World's Fair in Paris. Standing at 330 meters, it offers stunning views of the French capital.",
      address: "Champ de Mars, Paris, France",
      country: "France",
      continent: "Europe",
      rating: 6.7
    },
    {
      id: 4,
      name: "Big Ben",
      picture: "/bigben.jpg",
      description: "Big Ben is the nickname for the Great Bell inside the Elizabeth Tower at the north end of the Palace of Westminster in London. The clock tower has been an enduring symbol of the United Kingdom since its completion in 1859.",
      address: "Westminster, London, England",
      country: "England",
      continent: "Europe",
      rating: 7.4
    },
    {
      id: 5,
      name: "The Great Wall of China",
      picture: "/wall.jpg",
      description: "A series of fortifications built to protect China from invasions, the Great Wall stretches over 13,000 miles. Originally constructed during the 7th century BC, it remains one of the most impressive architectural achievements in history.",
      address: "China",
      country: "China",
      continent: "Asia",
      rating: 6.0
    },
    {
      id: 6,
      name: "Mount Fuji",
      picture: "/fuji.jpg",
      description: "Japan's highest peak, Mount Fuji is a sacred volcano and a popular hiking destination. Known for its symmetrical cone, the mountain has been an inspiration for artists and poets throughout Japanese history.",
      address: "Honshu, Japan",
      country: "Japan",
      continent: "Asia",
      rating: 8.9
    },
    {
      id: 7,
      name: "Taj Mahal",
      picture: "/tajmahal.jpg",
      description: "A masterpiece of Mughal architecture, the Taj Mahal was built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal. Made of white marble, this UNESCO World Heritage site is one of the most admired monuments in the world.",
      address: "Agra, Uttar Pradesh, India",
      country: "India",
      continent: "Asia",
      rating: 8.2
    },
    {
      id: 8,
      name: "Christ the Redeemer",
      picture: "/redeemer.jpg",
      description: "Standing atop Mount Corcovado in Rio de Janeiro, the Christ the Redeemer statue is an iconic symbol of Christianity. Completed in 1931, the 30-meter-tall statue overlooks the city with open arms, representing peace and unity.",
      address: "Rio de Janeiro, Brazil",
      country: "Brazil",
      continent: "South America",
      rating: 9.1
    },
    {
      id: 9,
      name: "Mount Kilimanjaro",
      picture: "/kilimanjaro.jpg",
      description: "Africa’s tallest mountain and the world’s highest free-standing peak, Kilimanjaro attracts thousands of climbers every year. Its snow-capped summit rises above the plains of Tanzania, offering one of the most rewarding hikes in the world.",
      address: "Kilimanjaro Region, Tanzania",
      country: "Tanzania",
      continent: "Africa",
      rating: 8.6
    },
    {
      id: 10,
      name: "Sydney Opera House",
      country: "Australia",
      continent: "Oceania",
      description: "The Sydney Opera House is one of the most recognizable buildings in the world, known for its unique design resembling sails of a ship. It hosts over 1,500 performances annually and is a UNESCO World Heritage site.",
      address: "Bennelong Point, Sydney, Australia",
      picture: "/default.png",
      rating: 8.5
    },
    {
      id: 11,
      name: "The Louvre Museum",
      country: "France",
      continent: "Europe",
      description: "The Louvre, located in Paris, is one of the largest and most visited art museums in the world. It houses thousands of works of art, including the Mona Lisa and the Venus de Milo. Its impressive architecture and rich history make it a must-see for art lovers.",
      address: "Rue de Rivoli, Paris, France",
      picture: "/default.png",
      rating: 9.0
    },
    {
      id: 12,
      name: "Petra",
      country: "Jordan",
      continent: "Asia",
      description: "Petra, an ancient city carved into red sandstone cliffs, is a UNESCO World Heritage site and one of the New Seven Wonders of the World. The city was once the thriving capital of the Nabataean Kingdom and is famous for its rock-cut architecture.",
      address: "Ma'an Governorate, Jordan",
      picture: "/default.png",
      rating: 8.8
    },
    {
      id: 13,
      name: "Angkor Wat",
      country: "Cambodia",
      continent: "Asia",
      description: "Angkor Wat is the largest religious monument in the world, originally built in the early 12th century as a Hindu temple and later transformed into a Buddhist temple. It remains a symbol of Cambodia and an architectural masterpiece.",
      address: "Siem Reap, Cambodia",
      picture: "/default.png",
      rating: 9.3
    },
    {
      id: 14,
      name: "Banff National Park",
      country: "Canada",
      continent: "North America",
      description: "Banff National Park is Canada's oldest national park, renowned for its stunning natural beauty, with crystal-clear lakes, towering mountains, and diverse wildlife. It offers a wide range of outdoor activities including hiking, skiing, and wildlife watching.",
      address: "Alberta, Canada",
      picture: "/default.png",
      rating: 9.2
    },
    {
      id: 15,
      name: "Great Barrier Reef",
      country: "Australia",
      continent: "Oceania",
      description: "The Great Barrier Reef is the world’s largest coral reef system, stretching over 2,300 kilometers. It is home to thousands of marine species and is a top destination for diving and snorkeling enthusiasts.",
      address: "Queensland, Australia",
      picture: "/default.png",
      rating: 9.5
    },
    {
      id: 16,
      name: "The Acropolis",
      country: "Greece",
      continent: "Europe",
      description: "The Acropolis of Athens is an ancient citadel that includes some of the most famous historical sites in Greece, including the Parthenon. It’s a symbol of classical Greece and a UNESCO World Heritage site.",
      address: "Athens, Greece",
      picture: "/default.png",
      rating: 8.3
    },
    {
      id: 17,
      name: "Niagara Falls",
      country: "United States/Canada",
      continent: "North America",
      description: "Niagara Falls is a group of three waterfalls located on the border between the United States and Canada. Known for its breathtaking beauty, it’s a popular spot for tourists looking to take in the majestic sight of the water crashing over the cliffs.",
      address: "Niagara Falls, Ontario, Canada/New York, USA",
      picture: "/default.png",
      rating: 8.7
    },
    {
      id: 18,
      name: "Sagrada Familia",
      country: "Spain",
      continent: "Europe",
      description: "The Sagrada Familia is a unique basilica in Barcelona, designed by Antoni Gaudí. Construction of the church began in 1882 and continues to this day. It’s renowned for its intricate, organic design and is a UNESCO World Heritage site.",
      address: "Carrer de Mallorca, Barcelona, Spain",
      picture: "/default.png",
      rating: 9.0
    },
    {
      id: 19,
      name: "Alhambra",
      country: "Spain",
      continent: "Europe",
      description: "The Alhambra is a historic palace and fortress complex in Granada, Spain. Built in the mid-13th century, it’s a fine example of Islamic architecture, with beautiful gardens, fountains, and intricate carvings.",
      address: "Alhambra, Granada, Spain",
      picture: "/default.png",
      rating: 8.8
    },
    {
      id: 20,
      name: "Galápagos Islands",
      country: "Ecuador",
      continent: "South America",
      description: "The Galápagos Islands are an archipelago off the coast of Ecuador, famous for their unique wildlife and role in Charles Darwin’s theory of evolution. The islands are home to species found nowhere else on Earth.",
      address: "Galápagos Islands, Ecuador",
      picture: "/default.png",
      rating: 9.4
    }
  ];
  

// Middleware to validate request data
const validateDestination = [
  body("name").isString().notEmpty(),
  body("country").isString().notEmpty(),
  body("continent").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("picture").isString().notEmpty(),
  body("rating").isNumeric().custom((value) => value >= 0 && value <= 10),
];

app.get("/", (req, res) => {
    res.json(destinations);
  });
// GET all destinations with optional filtering & sorting
app.get("/destinations", (req, res) => {
  //const result = destinations.slice(startIndex, endIndex);
  let result = [...destinations];

  // Filtering
  if (req.query.continent) {
    result = result.filter((d) => d.continent === req.query.continent);
  }
  if (req.query.country) {
    result = result.filter((d) => d.country === req.query.country);
  }

  // Sorting
  if (req.query.sortBy) {
    const sortKey = req.query.sortBy;
    result.sort((a, b) => (a[sortKey] > b[sortKey] ? 1 : -1));
  }
  /*const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const startIndex = (page - 1) * limit;
  const paginated = result.slice(startIndex, startIndex+limit);*/
  res.json(result);
});

// POST new destination
app.post("/destinations", validateDestination, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const newDestination = { id: Date.now(), ...req.body };
  destinations.push(newDestination);
  res.status(201).json(newDestination);
});

// PATCH update destination
app.patch("/destinations/:id", validateDestination, (req, res) => {
  const { id } = req.params;
  const index = destinations.findIndex((d) => d.id == id);
  if (index === -1) return res.status(404).json({ error: "Destination not found" });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  destinations[index] = { ...destinations[index], ...req.body };
  res.json(destinations[index]);
});

// DELETE destination
app.delete("/destinations/:id", (req, res) => {
  const { id } = req.params;
  destinations = destinations.filter((d) => d.id != id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));