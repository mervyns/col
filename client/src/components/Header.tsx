import { Box, Button, Grid, Menu, MenuItem, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { Roles } from '../utils/types';
import { UserContext } from '../utils/UserContextProvider';
import { Web3Provider } from '@ethersproject/providers';
import { Web3Window } from '../utils/Web3ContextProvider';
import { getInjectedConnector } from '../utils/getInjectedConnector';
import mainLogo from '../assets/cokepepsi.png';
import { shortenAddress } from '../utils/helperMethods';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

const Header: React.VFC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { account, activate, active } = useWeb3React<Web3Provider>();
  const userContext = useContext(UserContext);

  let navigate = useNavigate();
  const open = Boolean(anchorEl);
  const hasAdminRights = userContext.roles.includes(Roles.ADMIN);
  const hasBookerRights = userContext.roles.includes(Roles.BOOKER);

  const connectWallet = () => {
    activate(getInjectedConnector);
  };

  // useEffect to connect wallet if Ethereum window enabled and connection is not active
  useEffect(() => {
    if (window.ethereum && !active) {
      connectWallet();
    }
  }, [active]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const redirectHome = () => {
    navigate('/');
  };
  const redirectToUserBookings = () => {
    navigate('/user-bookings');
  };
  const redirectToManageUsers = () => {
    navigate('/manage-users');
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ background: '#e0deff' }}
    >
      {active && account ? (
        <Grid container sx={{ p: 2 }}>
          <Grid item xs={2} md={2}>
            <Box
              component="img"
              onClick={redirectHome}
              sx={{
                maxHeight: { xs: 40, md: 61 },
                maxWidth: { md: 80 },
                py: 1,
              }}
              src={mainLogo}
            ></Box>
          </Grid>
          <Grid item xs={7} md={4}>
            <Typography variant="h6">
              Connected as: {shortenAddress(account)}
            </Typography>
          </Grid>
          {hasBookerRights && (
            <>
              <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="h6" onClick={redirectToUserBookings}>
                  View my Bookings
                </Typography>
              </Grid>
            </>
          )}
          {hasAdminRights && (
            <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h6" onClick={redirectToManageUsers}>
                Manage Users
              </Typography>
            </Grid>
          )}
          <Grid item md={3} sx={{ display: { xs: 'block', md: 'none' } }}>
            <Button
              id="menu-button"
              aria-controls={open ? 'menu-button' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MenuIcon fontSize="large" />
            </Button>
            <Menu
              id="nav-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'nav-menu',
              }}
            >
              {hasAdminRights && (
                <MenuItem onClick={redirectToManageUsers}>
                  Manage Users
                </MenuItem>
              )}
              {hasBookerRights && (
                <MenuItem onClick={redirectToUserBookings}>
                  View my Bookings
                </MenuItem>
              )}
            </Menu>
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
