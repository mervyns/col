import React, { createContext, useEffect, useState } from 'react';

import { Roles } from './types';
import RoomBooking from '../contracts/RoomBooking.json';
import useGetContract from '../hooks/useGetRoomBookingContract';
import { useWeb3React } from '@web3-react/core';

interface UserContextInterface {
  roles: Roles[];
}
interface props {
  children: JSX.Element | JSX.Element[];
}

export const UserContext = createContext<UserContextInterface>({
  roles: [],
});

// A "provider" is used to encapsulate only the
// components that needs the state in this context
const UserContextProvider = ({ children }: props) => {
  const [userRoles, setUserRoles] = useState<Roles[]>([]);
  const { account, library } = useWeb3React();
  const address = process.env.REACT_APP_CONTRACT_ADDRESS;

  const roomBookingContract = useGetContract(
    address,
    RoomBooking.abi,
    library,
    account,
  );

  useEffect(() => {
    (async (): Promise<void> => {
      if (roomBookingContract) {
        try {
          const accountIsBooker = await roomBookingContract.isBooker(account);
          const accountIsAdmin = await roomBookingContract.isAdmin(account);
          setUserRoles([
            ...(accountIsBooker ? [Roles.BOOKER] : []),
            ...(accountIsAdmin ? [Roles.ADMIN] : []),
          ]);
        } catch {
          console.error('Could not get Roles within Context Provider');
        }
      }
    })();
  }, [roomBookingContract, account]);

  return (
    <UserContext.Provider value={{ roles: userRoles }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
