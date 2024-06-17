import {
  randCatchPhrase,
  randCity,
  randCountryCode,
  randEmail,
  randFirstName,
  randImg,
  randLastName,
  randParagraph,
  randSentence,
  randStateAbbr,
  randStreetAddress,
  randZipCode
} from "@ngneat/falso";
import _ from "lodash";

export interface TestData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  country: string;
  words: string;
  sentence: string;
  lorem: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const testData: TestData[] = _.range(3000).map(i => ({
  id: i + 1,
  firstName: randFirstName(),
  lastName: randLastName(),
  email: randEmail(),
  avatar: randImg({ width: 134, height: 134 }),
  country: randCountryCode().toLowerCase(),
  words: randCatchPhrase(),
  sentence: randSentence(),
  lorem: randParagraph(),
  address: randStreetAddress(),
  city: randCity(),
  state: randStateAbbr(),
  zipCode: randZipCode()
}));
