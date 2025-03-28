export const TOKENS = [
  {
    name: 'Stellar Lumens',
    contract: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    code: 'XLM',
    icon: 'https://assets.coingecko.com/coins/images/100/standard/Stellar_symbol_black_RGB.png',
    decimals: 7,
  },
  {
    name: 'Dogstar',
    contract: 'CACOCATSZBZCQAHFGYMRCCMS3O6QAZ5NRZAFKSDTECXUH6UYPX24PJGY',
    code: 'XTAR',
    icon: 'https://www.dogstarcoin.com/assets/img/dogstarcoin-logo.png',
    decimals: 7,
  },
  {
    name: 'USDCoin',
    contract: 'CA2D2WZ4OFT2XJLAY2IFSQFJJSNMIV4I4FQZOJ6DD6VQNIGOP7N24VZW',
    code: 'USDC',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    decimals: 7,
  },
  {
    name: 'Ripple',
    contract: 'CCUJMOECOAIKBZMKRZNHHYTJ3MY5UOZS5LBI6PAX2YE5GJOE2254TH2T',
    code: 'XRP',
    icon: 'https://static.ultrastellar.com/media/assets/img/4ab58d77-b70f-4a6c-9944-6f273d549cd5.png',
    decimals: 7,
  },
  {
    name: 'ArgentinePeso',
    contract: 'CD3USKFSEWF5XD4JUOHJ7DEQYUN36JRBSVOL6LJPHITGRZN4ZS5EQF2B',
    code: 'ARST',
    icon: 'https://static.ultrastellar.com/media/assets/img/648754b5-f91d-46c4-97f9-557642976a75.png',
    decimals: 7,
  },
  {
    name: 'Aquarius',
    contract: 'CDQL2NRRSQWABIKBA4TZEZA7RJ2LAKBE6A3K7FLXGNQIE4ASNVAHVV5Y',
    code: 'AQUA',
    icon: 'https://static.ultrastellar.com/media/assets/img/1878ee2d-2fd1-4e31-89a7-5a430f1596f8.png',
    decimals: 7,
  },
  {
    name: 'EURoCoin',
    contract: 'CCJQJWXFPR5KA5Z5HYNR2W7IHIJ4IVV4LHRMEHEWY5PLWLXLRFPEXVOB',
    code: 'EURC',
    icon: 'https://static.ultrastellar.com/media/assets/img/f8b00dbf-64b3-488f-bcd2-354f29e2cdc8.png',
    decimals: 7,
  },
  {
    name: 'Bitcoin',
    contract: 'CC2R37V27UHXQGLWWXBUHC5RH7APTXOC6S6QUBQG636XJOSWQOI53BIJ',
    code: 'BTC',
    icon: 'https://static.ultrastellar.com/media/assets/img/c3380651-52e5-4054-9121-a438c60a1ec4.png',
    decimals: 7,
  },
  {
    name: 'BrazilianReal',
    contract: 'CCNTPGY5HGKDHK564BCOOOIDZRDSYSW6O3JY7BNDBDSNNKN35W65AAK6',
    code: 'BRL',
    icon: 'https://static.ultrastellar.com/media/assets/img/03e2b3a2-f310-4426-8ff1-ec960b033195.png',
    decimals: 7,
  },
  {
    name: 'kibvoe',
    contract: 'CATJR7SZZHWHJC7P5GHGAVMYB4R7CDJVI2HFCRU276YAPNHF5U2XDYAS',
    code: 'KIBV',
    issuer: 'GCPJFNZAARY3Z2AM7RVXDZDLPOEBT4QHTQXFOFKMZHLV7PPDKE2M67Q6',
    icon: '',
    decimals: 7,
  },
  {
    name: 'kradex',
    contract: 'CAVQXUEXKDSDDKKVEGHDNVJUT7KHUNCVV5NJRYFYY7PT2TKOTW3HLGZW',
    code: 'KRAD',
    issuer: 'GCPJFNZAARY3Z2AM7RVXDZDLPOEBT4QHTQXFOFKMZHLV7PPDKE2M67Q6',
    icon: '',
    decimals: 7,
  },
  {
    name: 'krarya',
    contract: 'CAL677ZGFRDCGDJPMRAGJQ3AVCV3H57I6LLRYBN2KJLTPM33CMWUHUXB',
    code: 'KRAR',
    issuer: 'GCPJFNZAARY3Z2AM7RVXDZDLPOEBT4QHTQXFOFKMZHLV7PPDKE2M67Q6',
    icon: '',
    decimals: 7,
  },
  {
    name: 'nefdex',
    contract: 'CDTWDYGHUOVQP34KBHGLVUP35HWMZSR5EIHPJ7S77FWMQ5DE5PA3DQHR',
    code: 'NEFD',
    issuer: 'GCPJFNZAARY3Z2AM7RVXDZDLPOEBT4QHTQXFOFKMZHLV7PPDKE2M67Q6',
    icon: '',
    decimals: 7,
  },
];

export const getTokenDetails = (token: string): TokenDetails | undefined => {
  return TOKENS.find(
    t =>
      t.code.toUpperCase() === token.toUpperCase() || t.name.toUpperCase() === token.toUpperCase()
  );
};

export interface TokenDetails {
  name: string;
  contract: string;
  code: string;
  icon: string;
  decimals: number;
}
