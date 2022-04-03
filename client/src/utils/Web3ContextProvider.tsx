import { Web3ReactProvider as DefaultWeb3ReactProvider } from '@web3-react/core';
import React from 'react';
import { ethers } from 'ethers';

export interface Web3Window {
  ethereum: any;
  addEventListener: any;
}

const getLibrary = (
  provider: any,
  pollingInterval?: number,
): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = pollingInterval || 12000;
  return library;
};

type Web3ReactProviderProps = {
  pollingInterval: number; // 12000 miliseconds by default
};

export const Web3ReactContextProvider: React.FC<Web3ReactProviderProps> = ({
  pollingInterval,
  children,
}) => {
  return (
    <DefaultWeb3ReactProvider
      getLibrary={(provider) => getLibrary(provider, pollingInterval)}
    >
      {children}
    </DefaultWeb3ReactProvider>
  );
};
