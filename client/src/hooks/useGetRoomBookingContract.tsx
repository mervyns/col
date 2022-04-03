import { getContract } from '../utils/helperMethods';
import { useMemo } from 'react';

const useGetContract = (
  address?: string,
  abi?: any,
  library?: any,
  account?: any,
) => {
  const returnedContract = useMemo(() => {
    if (!address || !abi || !library || !account) return null;
    try {
      return getContract(address, abi, library, account);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, abi, account]);

  return returnedContract;
};

export default useGetContract;
