import { useEffect, useState } from 'react';

import Web3 from 'web3';
import getWeb3 from '../utils/getWeb3';

type state = {
  isLoading: boolean;
  isWeb3: boolean;
  web3: Web3 | null;
  accounts: string[];
};

const Hooks = (): state => {
  const [state, setState] = useState<state>({
    isLoading: true,
    isWeb3: false,
    web3: null,
    accounts: [],
  });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const web3: Web3 = (await getWeb3()) as Web3;
        const accounts = await web3.eth.getAccounts();
        console.log(web3, accounts);
        setState({
          ...state,
          isLoading: false,
          isWeb3: true,
          web3,
          accounts,
        });
      } catch {
        setState({
          ...state,
          isLoading: false,
        });
      }
    })();
  }, [state]);

  const { isLoading, isWeb3, web3, accounts } = state;
  console.log('state', state);
  return { isLoading, isWeb3, web3, accounts };
};

export default Hooks;
