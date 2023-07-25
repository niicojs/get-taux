import { writeFile } from 'fs/promises';
import dotenv from 'dotenv';
import { ofetch } from 'ofetch';

dotenv.config();

const client = ofetch.create({
  baseURL: 'https://api.webstat.banque-france.fr/webstat-fr/v1/data',
  headers: {
    Accept: 'application/json',
    'X-IBM-Client-Id': process.env.API_KEY,
  },
});

const response = await client('EXR/EXR.M.*.EUR.SP00.A', {
  query: {
    format: 'json',
    startPeriod: '2023-06',
    endPeriod: '2023-06',
  },
});

await writeFile('rates.json', JSON.stringify(response, null, 2), 'utf-8');

const currencies = [
  'USD',
  'GBP',
  'CHF',
  'CAD',
  'HKD',
  'AUD',
  'SGD',
  'INR',
  'PLN',
  'AED',
  'TND',
  'MAD',
];

const results = {};
for (const currency of currencies) {
  const obs = response.seriesObs.find((o) =>
    o.ObservationsSerie.seriesKey.includes(`EXR.M.${currency}.EUR`)
  );
  if (obs) {
    results[currency] =
      obs.ObservationsSerie.observations[0].ObservationPeriod.value;
  } else {
    console.log('Currency not found: ' + currency);
  }
}

console.log(results);
