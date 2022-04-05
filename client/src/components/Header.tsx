import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { Web3Window } from '../utils/Web3ContextProvider';
import { getInjectedConnector } from '../utils/getInjectedConnector';
import mainLogo from '../assets/cokepepsi.png';
import { shortenAddress } from '../utils/helperMethods';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

const Header: React.VFC = () => {
  const { account, activate, active } = useWeb3React<Web3Provider>();
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

  const redirectHome = () => {
    navigate('/');
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {active && account ? (
        <Grid container sx={{ p: 2 }}>
          <Grid item md={2}>
            <Box
              component="img"
              onClick={redirectHome}
              sx={{
                maxHeight: { xs: 40, md: 61 },
                maxWidth: { md: 80 },
              }}
              src={mainLogo}
            ></Box>
          </Grid>
          <Grid item md={4}>
            <Typography variant="h6">
              Connected as: {shortenAddress(account)}
            </Typography>
          </Grid>
          <Grid item md={4}>
            <Typography variant="h6" onClick={() => navigate('/user-bookings')}>
              View my Bookings
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
