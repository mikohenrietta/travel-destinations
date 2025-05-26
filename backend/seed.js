// seed.ts
import { PrismaClient } from './generated/prisma/client.js';

const prisma = new PrismaClient();

export async function main() {
  // Clear existing data
  await prisma.destination.deleteMany();
  await prisma.country.deleteMany();
  await prisma.continent.deleteMany();

  // Seed Continents
  const continents = await prisma.continent.createMany({
    data: [
      { name: 'Africa' },
      { name: 'Asia' },
      { name: 'Europe' },
      { name: 'North America' },
      { name: 'South America' },
      { name: 'Oceania' },
      { name: 'Antarctica' },
    ],
  });

  // Get created continents
  const africa = await prisma.continent.findFirst({ where: { name: 'Africa' } });
  const asia = await prisma.continent.findFirst({ where: { name: 'Asia' } });
  const europe = await prisma.continent.findFirst({ where: { name: 'Europe' } });
  const northAmerica = await prisma.continent.findFirst({ where: { name: 'North America' } });
  const southAmerica = await prisma.continent.findFirst({ where: { name: 'South America' } });
  const oceania = await prisma.continent.findFirst({ where: { name: 'Oceania' } });

  // Seed Countries
  const countries = await prisma.country.createMany({
    data: [
      // Africa
      { countryName: 'Egypt', continentId: africa.id },
      { countryName: 'South Africa', continentId: africa.id },
      { countryName: 'Kenya', continentId: africa.id },
      
      // Asia
      { countryName: 'Japan', continentId: asia.id },
      { countryName: 'Thailand', continentId: asia.id },
      { countryName: 'India', continentId: asia.id },
      
      // Europe
      { countryName: 'France', continentId: europe.id },
      { countryName: 'Italy', continentId: europe.id },
      { countryName: 'Spain', continentId: europe.id },
      
      // North America
      { countryName: 'United States', continentId: northAmerica.id },
      { countryName: 'Canada', continentId: northAmerica.id },
      { countryName: 'Mexico', continentId: northAmerica.id },
      
      // South America
      { countryName: 'Brazil', continentId: southAmerica.id },
      { countryName: 'Argentina', continentId: southAmerica.id },
      { countryName: 'Peru', continentId: southAmerica.id },
      
      // Oceania
      { countryName: 'Australia', continentId: oceania.id },
      { countryName: 'New Zealand', continentId: oceania.id },
    ],
  });

  // Get some countries for destinations
  const egypt = await prisma.country.findFirst({ where: { countryName: 'Egypt' } });
  const japan = await prisma.country.findFirst({ where: { countryName: 'Japan' } });
  const france = await prisma.country.findFirst({ where: { countryName: 'France' } });
  const usa = await prisma.country.findFirst({ where: { countryName: 'United States' } });
  const brazil = await prisma.country.findFirst({ where: { countryName: 'Brazil' } });
  const australia = await prisma.country.findFirst({ where: { countryName: 'Australia' } });
  const england = await prisma.country.findFirst({ where: { countryName: 'England' } });

  // Seed Destinations
  await prisma.destination.createMany({
    data: [
      {
        name: 'Pyramids of Giza',
        countryId: egypt.id,
        picture: 'default.png',
        rating: 8,
        description: 'The last remaining wonder of the ancient world, these massive pyramids were built as tombs for pharaohs.',
        address: 'Al Haram, Nazlet El-Semman, Al Giza Desert, Giza Governorate'
      },
      {
        name: 'Mount Fuji',
        countryId: japan.id,
        picture: 'fuji.jpg',
        rating: 10,
        description: 'Japan\'s tallest mountain and an active volcano that is considered one of the country\'s sacred symbols.',
        address: 'Kitayama, Fujinomiya, Shizuoka 418-0112'
      },
      {
        name: 'Eiffel Tower',
        countryId: france.id,
        picture: 'eiffel.jpg',
        rating: 7,
        description: 'The iconic iron tower on the Champ de Mars in Paris, named after engineer Gustave Eiffel.',
        address: 'Champ de Mars, 5 Avenue Anatole France'
      },
      {
        name: 'Grand Canyon',
        countryId: usa.id,
        picture: 'default.png',
        rating: 6,
        description: 'A massive gorge carved by the Colorado River in Arizona, known for its overwhelming size and colorful landscape.',
        address: 'Arizona'
      },
      {
        name: 'Christ the Redeemer',
        countryId: brazil.id,
        picture: 'redeemer.jpg',
        rating: 7,
        description: 'An enormous Art Deco statue of Jesus Christ in Rio de Janeiro, standing atop Corcovado mountain.',
        address: 'Parque Nacional da Tijuca - Alto da Boa Vista'
      },
      {
        name: 'Sydney Opera House',
        countryId: australia.id,
        picture: 'default.png',
        rating: 6,
        description: 'A multi-venue performing arts center with a distinctive sail-like design, located on Sydney Harbour.',
        address: 'Bennelong Point, Sydney NSW 2000, Australia'
      }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });