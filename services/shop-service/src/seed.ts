import { AppDataSource } from './config/data-source';
import { Address } from './customers/entities/address.entity';
import { City } from './customers/entities/city.entity';
import { Country } from './customers/entities/country.entity';
import { Customer } from './customers/entities/customer.entity';
import { State } from './customers/entities/state.entity';
import { UserRole } from './customers/enums/role.enum';

export async function seed() {
  console.log('Starting seeding process...');

  const country = new Country();
  country.name = 'United States of America';
  await AppDataSource.manager.save(country);

  const stateNames = [
    'California',
    'Texas',
    'Florida',
    'New York',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia',
    'North Carolina',
    'Michigan',
    'New Jersey',
    'Virginia',
    'Washington',
    'Arizona',
    'Massachusetts',
    'Tennessee',
    'Indiana',
    'Missouri',
    'Maryland',
    'Wisconsin',
    'Colorado',
    'Minnesota',
    'South Carolina',
    'Alabama',
    'Kentucky',
    'Oregon',
    'Oklahoma',
    'Connecticut',
    'Iowa',
    'Nevada',
  ];

  const states: State[] = [];
  for (const name of stateNames) {
    const state = new State();
    state.name = name;
    state.country = country;
    states.push(await AppDataSource.manager.save(state));
  }

  const cityData = [
    { name: 'Los Angeles', state: 'California' },
    { name: 'San Francisco', state: 'California' },
    { name: 'San Diego', state: 'California' },
    { name: 'Houston', state: 'Texas' },
    { name: 'Dallas', state: 'Texas' },
    { name: 'Austin', state: 'Texas' },
    { name: 'Miami', state: 'Florida' },
    { name: 'Orlando', state: 'Florida' },
    { name: 'Tampa', state: 'Florida' },
    { name: 'New York City', state: 'New York' },
    { name: 'Buffalo', state: 'New York' },
    { name: 'Rochester', state: 'New York' },
    { name: 'Chicago', state: 'Illinois' },
    { name: 'Springfield', state: 'Illinois' },
    { name: 'Philadelphia', state: 'Pennsylvania' },
    { name: 'Pittsburgh', state: 'Pennsylvania' },
    { name: 'Columbus', state: 'Ohio' },
    { name: 'Cleveland', state: 'Ohio' },
    { name: 'Atlanta', state: 'Georgia' },
    { name: 'Savannah', state: 'Georgia' },
    { name: 'Charlotte', state: 'North Carolina' },
    { name: 'Raleigh', state: 'North Carolina' },
    { name: 'Detroit', state: 'Michigan' },
    { name: 'Grand Rapids', state: 'Michigan' },
    { name: 'Newark', state: 'New Jersey' },
    { name: 'Jersey City', state: 'New Jersey' },
    { name: 'Virginia Beach', state: 'Virginia' },
    { name: 'Richmond', state: 'Virginia' },
    { name: 'Seattle', state: 'Washington' },
    { name: 'Spokane', state: 'Washington' },
    { name: 'Phoenix', state: 'Arizona' },
    { name: 'Tucson', state: 'Arizona' },
    { name: 'Boston', state: 'Massachusetts' },
    { name: 'Cambridge', state: 'Massachusetts' },
    { name: 'Nashville', state: 'Tennessee' },
    { name: 'Memphis', state: 'Tennessee' },
    { name: 'Indianapolis', state: 'Indiana' },
    { name: 'Fort Wayne', state: 'Indiana' },
    { name: 'St. Louis', state: 'Missouri' },
    { name: 'Kansas City', state: 'Missouri' },
    { name: 'Baltimore', state: 'Maryland' },
    { name: 'Milwaukee', state: 'Wisconsin' },
    { name: 'Denver', state: 'Colorado' },
    { name: 'Boulder', state: 'Colorado' },
    { name: 'Minneapolis', state: 'Minnesota' },
    { name: 'Charleston', state: 'South Carolina' },
    { name: 'Birmingham', state: 'Alabama' },
    { name: 'Louisville', state: 'Kentucky' },
    { name: 'Portland', state: 'Oregon' },
  ];

  const cities: City[] = [];
  for (const { name, state: stateName } of cityData) {
    const state = states.find((s) => s.name === stateName);
    if (state) {
      const city = new City();
      city.name = name;
      city.state = state;
      city.country = country;
      cities.push(await AppDataSource.manager.save(city));
    }
  }

  const firstNames = [
    'John',
    'Jane',
    'Michael',
    'Emily',
    'Robert',
    'Linda',
    'David',
    'Sarah',
    'James',
    'Jessica',
    'William',
    'Elizabeth',
    'Christopher',
    'Amanda',
    'Matthew',
    'Ashley',
    'Daniel',
    'Megan',
    'Joseph',
    'Hannah',
    'Andrew',
    'Olivia',
    'Joshua',
    'Sophia',
    'Ryan',
    'Emma',
    'Brandon',
    'Ava',
    'Alexander',
    'Isabella',
  ];

  const lastNames = [
    'Smith',
    'Johnson',
    'Brown',
    'Taylor',
    'Anderson',
    'Thomas',
    'Jackson',
    'White',
    'Harris',
    'Martin',
    'Thompson',
    'Garcia',
    'Martinez',
    'Robinson',
    'Clark',
    'Rodriguez',
    'Lewis',
    'Lee',
    'Walker',
    'Hall',
    'Allen',
    'Young',
    'King',
    'Wright',
    'Scott',
    'Green',
    'Adams',
    'Baker',
    'Gonzalez',
    'Nelson',
  ];

  for (let i = 1; i <= 1000; i++) {
    const address = new Address();
    address.street = `${Math.floor(Math.random() * 1000) + 1} Main St`;
    address.postalCode = `1000${i % 100}`;
    address.city = cities[Math.floor(Math.random() * cities.length)];
    address.state = address.city.state;
    address.country = address.city.country;
    await AppDataSource.manager.save(address);

    const customer = new Customer();
    customer.userId = String(i);
    customer.email = `customer${i}@example.com`;
    customer.role = i % 2 === 0 ? UserRole.Member : UserRole.Member;
    customer.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    customer.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    customer.phoneNumber = `+1-800-${Math.floor(1000000 + Math.random() * 9000000)}`;
    customer.address = address;
    await AppDataSource.manager.save(customer);
  }

  console.log('Seeding process completed successfully!');
}
