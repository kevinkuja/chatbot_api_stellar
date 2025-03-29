export interface NetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
}

export const TESTNET_DETAILS = {
  network: 'TESTNET',
  networkUrl: 'https://horizon-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
};

export const MAINNET_DETAILS = {
  network: 'PUBLIC',
  networkUrl: 'https://horizon.stellar.org',
  networkPassphrase: 'Public Global Stellar Network ; September 2015',
};

export const SOROBAN_TESTNET_DETAILS = {
  network: 'SOROBAN-TESTNET',
  networkUrl: 'https://soroban-testnet.stellar.org:443',
  networkPassphrase: 'Soroban Network ; October 2023',
};

export const SOROBAN_MAINNET_DETAILS = {
  network: 'SOROBAN-MAINNET',
  networkUrl: 'https://mainnet.sorobanrpc.com',
  networkPassphrase: 'Soroban Network ; October 2023',
};
