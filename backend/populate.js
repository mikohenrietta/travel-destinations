import { faker } from '@faker-js/faker';
import { PrismaClient } from './generated/prisma/client.js';

const prisma = new PrismaClient();
const BATCH_SIZE = 1000;
const TOTAL_RECORDS = 100000;

async function seedContinents() {
  const continents = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];
  for (const name of continents) {
    const existing = await prisma.continent.findFirst({ where: { name } });
    if (!existing) {
      await prisma.continent.create({ data: { name } });
    }
  }
}

async function createCountries() {
  const continents = await prisma.continent.findMany();
  const countries = [];

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    countries.push({
      countryName: faker.location.country(),
      continentId: faker.helpers.arrayElement(continents).id,
    });

    if (countries.length === BATCH_SIZE) {
      await prisma.country.createMany({ data: countries });
      countries.length = 0;
      console.log(`Created ${i + 1} countries`);
    }
  }

  if (countries.length > 0) {
    await prisma.country.createMany({ data: countries });
    console.log(`Created remaining countries`);
  }
}

async function createDestinations() {
  const countries = await prisma.country.findMany();
  const destinations = [];

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    const country = faker.helpers.arrayElement(countries);
    destinations.push({
      name: `The ${faker.word.adjective()} ${faker.word.noun()}`,
      description: faker.lorem.paragraphs(3),
      rating: faker.number.int({ min: 1, max: 5 }),
      picture: 'default.png',
      countryId: country.id,
      address: `${faker.location.city()}, ${country.countryName}`,
    });

    if (destinations.length === BATCH_SIZE) {
      await prisma.destination.createMany({ data: destinations });
      destinations.length = 0;
      console.log(`Created ${i + 1} destinations`);
    }
  }

  if (destinations.length > 0) {
    await prisma.destination.createMany({ data: destinations });
    console.log(`Created remaining destinations`);
  }
}

async function main() {
  await seedContinents();
  await createCountries();
  await createDestinations();
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
