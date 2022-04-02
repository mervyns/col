import { Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { Contract } from 'web3-eth-contract';
import RoomBookingContract from '../contracts/RoomBooking.json';
import Web3 from 'web3';
import { Web3Window } from '../utils/getWeb3';
import { useNavigate } from 'react-router-dom';
import useWeb3 from '../hooks/web3';

declare const window: Web3Window;

const Header: React.VFC = () => {
  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  const [instance, setInstance] = useState<Contract>();
  const abi: any = RoomBookingContract.abi;
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (web3 !== null) {
        const networkId = await web3.eth.net.getId();
        console.log('RoomBookingContract.networks', networkId);
        console.log(
          'RoomBookingContract.networks',
          RoomBookingContract.networks,
        );
        const deployedNetwork = RoomBookingContract.networks['1648652696383'];
        const instance = new web3.eth.Contract(
          abi,
          deployedNetwork && deployedNetwork.address,
        );
        setInstance(instance);
      }
    })();
  }, [isLoading, isWeb3]);

  const connectWallet = () => {
    new Promise(async (resolve, reject) => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          resolve(web3);
          console.log('done');
          navigate('/');
        } catch (error) {
          reject(error);
        }
      } // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log('Injected web3 detected.');
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:8545',
        );
        const web3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
        resolve(web3);
      }
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {isLoading ? (
        <div>Loading Web3, accounts, and contract...</div>
      ) : isWeb3 ? (
        <Grid container sx={{ p: 2 }}>
          <Grid item>
            <Typography variant="h6">Connected as: {accounts}</Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid item>
          <Button onClick={connectWallet}>Connect Metamask</Button>
        </Grid>
      )}
    </Grid>
  );
};

export default Header;
