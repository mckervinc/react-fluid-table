import _ from "lodash";
import faker from "faker";

export const testData = _.range(3000).map(i => ({
  id: i + 1,
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  country: faker.address.countryCode().toLowerCase(),
  words: faker.lorem.words(),
  sentence: faker.lorem.sentences()
}));
