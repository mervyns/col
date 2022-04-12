import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Roles, TransactionReceipt } from '../utils/types';

import AccessError from '../components/AccessError';
import RoomBooking from '../contracts/RoomBooking.json';
import ToastAlert from '../components/ToastAlert';
import { UserContext } from '../utils/UserContextProvider';
import { Web3Window } from '../utils/Web3ContextProvider';
import useGetContract from '../hooks/useGetRoomBookingContract';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

const ManageUsers: React.VFC = () => {
  const [userRoles, setUserRoles] = useState<Roles[]>([]);
  const [textfieldValue, setTextfieldValue] = useState('');
  const [alertType, setAlertType] = useState<TransactionReceipt>();
  const [toastMessage, setToastMessage] = useState('');
  const { account, active, library } = useWeb3React();

  const userContext = useContext(UserContext);
  const address = process.env.REACT_APP_CONTRACT_ADDRESS;

  const roomBookingContract = useGetContract(
    address,
    RoomBooking.abi,
    library,
    account,
  );

  useEffect(() => {
    if (userRoles.length > 0) {
      setAlertType(TransactionReceipt.SUCCESS);
      setToastMessage(
        `User ${textfieldValue} has role(s) ${userRoles.map((role) => role)}`,
      );
    }
  }, [userRoles]);

  const closeAlert = () => {
    setAlertType(undefined);
    setToastMessage('');
    return;
  };

  const handleTextfieldChange = (e: any) => {
    setTextfieldValue(e.target.value);
  };

  const checkUserRoles = async () => {
    if (roomBookingContract) {
      const accountIsBooker = await roomBookingContract.isBooker(
        textfieldValue,
      );
      const accountIsAdmin = await roomBookingContract.isAdmin(textfieldValue);
      setUserRoles([
        ...(accountIsBooker ? [Roles.BOOKER] : []),
        ...(accountIsAdmin ? [Roles.ADMIN] : []),
      ]);
    }
  };

  const addUserRole = async (role: Roles) => {
    if (roomBookingContract && role) {
      try {
        const transaction =
          role === Roles.BOOKER
            ? await roomBookingContract.addBooker(textfieldValue)
            : await roomBookingContract.addAdmin(textfieldValue);
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
          setToastMessage('Could not add role');
          setAlertType(TransactionReceipt.FAILURE);
          return;
        } else {
          setToastMessage('Role Added');
          setAlertType(TransactionReceipt.SUCCESS);
        }
      } catch (e) {
        const err = e as any;
        const errorMessage =
          err.message === 'Internal JSON-RPC error.'
            ? err.data.data.reason
            : err.message;
        setToastMessage(errorMessage);
        setAlertType(TransactionReceipt.FAILURE);
      }
    }
  };

  const removerBookerRole = async () => {
    if (roomBookingContract) {
      try {
        const transaction = await roomBookingContract.removeBooker(
          textfieldValue,
        );
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
          setToastMessage('Could not remove user as booker');
          setAlertType(TransactionReceipt.FAILURE);
          return;
        } else {
          setToastMessage('Removed user as Booker');
          setAlertType(TransactionReceipt.SUCCESS);
        }
      } catch (e) {
        const err = e as any;
        const errorMessage =
          err.message === 'Internal JSON-RPC error.'
            ? err.data.data.reason
            : err.message;
        setToastMessage(errorMessage);
        setAlertType(TransactionReceipt.FAILURE);
      }
    }
  };

  const hasAdminRights = userContext.roles.includes(Roles.ADMIN);

  return (
    <Grid container justifyContent="center" sx={{ minHeight: '80vH' }}>
      {active && account ? (
        hasAdminRights ? (
          <Grid item xs={12} sx={{ py: 3 }}>
            <Typography variant="h3">User Management Panel</Typography>
            {!!alertType && (
              <ToastAlert
                alertType={alertType}
                closeAlert={closeAlert}
                toastMessage={toastMessage}
              />
            )}
            <Grid
              container
              rowSpacing={{ xs: 3, md: 0 }}
              alignItems="center"
              sx={{ py: 2 }}
            >
              <Grid item xs={12}>
                <Typography variant="h6">Add Users</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="User Address"
                  variant="outlined"
                  onChange={handleTextfieldChange}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={checkUserRoles}
                >
                  Check User's roles
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => addUserRole(Roles.BOOKER)}
                >
                  Add User as Booker
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => removerBookerRole()}
                >
                  Remove Booker Role
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => addUserRole(Roles.ADMIN)}
                >
                  Add User as Admin
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <AccessError adminOnly />
        )
      ) : (
        <Grid item>
          <Typography variant="h6">
            Click on "Connect Wallet" above before proceeding
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ManageUsers;
