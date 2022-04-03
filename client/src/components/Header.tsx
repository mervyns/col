import { Button, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import RoomBookingContract from '../contracts/RoomBooking.json';
import { Web3Provider } from '@ethersproject/providers';
import { Web3Window } from '../utils/Web3ContextProvider';
import { getInjectedConnector } from '../utils/getInjectedConnector';
import { shortenAddress } from '../utils/helperMethods';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

const Header: React.VFC = () => {
  const { chainId, account, activate, active } = useWeb3React<Web3Provider>();
  const abi: any = RoomBookingContract.abi;
  let navigate = useNavigate();

  const connectWallet = () => {
    activate(getInjectedConnector);
  };

  // useEffect to connect wallet if Ethereum window enabled and connection is not active
  useEffect(() => {
    if (window.ethereum && !active) {
      connectWallet();
    }
  }, [active]);

  return (
    <Grid container justifyContent="center" alignItems="center">
      {active && account ? (
        <Grid container sx={{ p: 2 }}>
          <Grid item>
            <Typography variant="h6">
              Connected as: {shortenAddress(account)}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid item>
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </Grid>
      )}
    </Grid>
  );
};

export default Header;
