export type ChainID = string | number;
export const TOTAL_AVAILABLE_HOURS = 12;

export const supportedChainIds = [
  1, // Mainet
  3, // Ropsten
  4, // Rinkeby
  5, // Goerli
  42, // Kovan
  1337, // Ganache
];

export enum TransactionReceipt {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum Roles {
  ADMIN = 'ADMIN',
  BOOKER = 'BOOKER',
}

export const roomArray = [
  'C01',
  'C02',
  'C03',
  'C04',
  'C05',
  'C06',
  'C07',
  'C08',
  'C09',
  'C10',
  'P01',
  'P02',
  'P03',
  'P04',
  'P05',
  'P06',
  'P07',
  'P08',
  'P09',
  'P10',
];

export enum Timeslots {
  '0800 HRS',
  '0900 HRS',
  '1000 HRS',
  '1100 HRS',
  '1200 HRS',
  '1300 HRS',
  '1400 HRS',
  '1500 HRS',
  '1600 HRS',
  '1700 HRS',
  '1800 HRS',
  '1900 HRS',
}
