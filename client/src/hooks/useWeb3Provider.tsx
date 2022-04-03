import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ChainID } from '../utils/types';
import { Web3Provider } from '@ethersproject/providers';
import { getInjectedConnector } from '../utils/getInjectedConnector';

export const useWeb3Provider = (chainIds: ChainID[]) => {
  const ref = useRef(false);
  const { activate, ...restParams } = useWeb3React<Web3Provider>();
  const [loading, setLoading] = useState(false);

  const connector = getInjectedConnector;

  const connect = useCallback(() => {
    setLoading(true);
    activate(connector)
      .then(() => {})
      .catch(() => {})
      .then(() => {
        if (ref.current) {
          setLoading(false);
        }
      });
  }, [activate, connector]);

  const isUnsupportedChainId = useMemo(
    () => restParams.error instanceof UnsupportedChainIdError,
    [restParams.error],
  );

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return {
    ...restParams,
    activate: connect,
    isUnsupportedChainId,
    loading,
  };
};
