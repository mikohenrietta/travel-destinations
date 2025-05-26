import express from "express";
import { PrismaClient } from './generated/prisma/client.js';
import cors from "cors";
import { body, param, validationResult } from "express-validator";
import path from 'path';
import {main} from './seed.js';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
/*
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
  */

app.get('/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.send('Database seeded!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Seeding failed');
  }
});
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

  app.get("/continents", async (req, res) => {
    try {
      const continents = await prisma.continent.findMany({
        include: {
          countries: true
        }
      });
      res.json(continents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

app.get("/destinations", async (req, res) => {
  try {
    const { continent, country, sortBy } = req.query;

    const destinations = await prisma.destination.findMany({
      include: {
        country: {
          include: {
            continent: true
          }
        }
      },
      where: {
        ...(continent && {
          country: {
            continent: {
              name: continent
            }
          }
        }),
        ...(country && {
          country: {
            countryName: country
          }
        })
      },
      orderBy: sortBy ? { [sortBy]: 'asc' } : undefined
    });

    const transformed = destinations.map(d => ({
      id: d.id,
      name: d.name,
      country: d.country.countryName,
      continent: d.country.continent.name,
      description: d.description,
      address: d.address,
      picture: d.picture,
      rating: d.rating
    }));

    res.json(transformed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/top-rated-countries", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        c."id",
        c."countryName",
        AVG(d."rating") as "averageRating"
      FROM "Country" c
      JOIN "Destination" d ON d."countryId" = c."id"
      GROUP BY c."id"
      ORDER BY "averageRating" DESC
      LIMIT 10;
    `;
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// POST new destination
app.post("/destinations", async (req, res) => {
  try {
    const {
      name,
      location,
      country: countryName,
      continent: continentName,
      description,
      rating,
      picture,
    } = req.body;

    let continent = await prisma.continent.findFirst({
      where: { name: continentName },
    });

    if (!continent) {
      continent = await prisma.continent.create({
        data: { name: continentName },
      });
    }

    let country = await prisma.country.findFirst({
      where: {
        countryName,
        continentId: continent.id,
      },
    });

    if (!country) {
      country = await prisma.country.create({
        data: {
          countryName,
          continent: {
            connect: { id: continent.id },
          },
        },
      });
    }

    const address = `${location}, ${countryName}, ${continentName}`;
    const newDestination = await prisma.destination.create({
      data: {
        name,
        countryId: country.id,
        picture,
        rating: parseInt(rating),
        description,
        address,
      },
    });

    res.status(201).json(newDestination);
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ error: "Failed to create destination" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
// PATCH update destination
app.patch("/destinations/:id", [
  body("name").isString().notEmpty(),
  body("countryId").isInt(),
  body("description").isString().notEmpty(),
  body("address").isString().notEmpty(),
  body("picture").isString().notEmpty(),
  body("rating").isNumeric().custom((value) => value >= 0 && value <= 10),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, countryId, description, address, picture, rating } = req.body;
    
    const updatedDestination = await prisma.destination.update({
      where: { id: Number(id) },
      data: {
        name,
        countryId: Number(countryId),
        description,
        address,
        picture,
        rating: Number(rating)
      },
      include: {
        country: {
          include: {
            continent: true
          }
        }
      }
    });

    const transformed = {
      id: updatedDestination.id,
      name: updatedDestination.name,
      country: updatedDestination.country.countryName,
      continent: updatedDestination.country.continent.name,
      description: updatedDestination.description,
      address: updatedDestination.address,
      picture: updatedDestination.picture,
      rating: updatedDestination.rating
    };

    res.json(transformed);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE destination
app.delete("/destinations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.destination.delete({
      where: { id: Number(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Destination not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));