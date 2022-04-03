import { InjectedConnector } from '@web3-react/injected-connector';
import { supportedChainIds } from './types';

export const getInjectedConnector = new InjectedConnector({
  supportedChainIds,
});
