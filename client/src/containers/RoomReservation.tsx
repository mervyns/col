import { Button, Grid, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import {
  Roles,
  Timeslots,
  TransactionReceipt,
  roomArray,
} from '../utils/types';

import AccessError from '../components/AccessError';
import LoadingSkeleton from '../components/LoadingSkeleton';
import RoomBooking from '../contracts/RoomBooking.json';
import ToastAlert from '../components/ToastAlert';
import { UserContext } from '../utils/UserContextProvider';
import { Web3Window } from '../utils/Web3ContextProvider';
import { getReservedHours } from '../utils/helperMethods';
import useGetContract from '../hooks/useGetRoomBookingContract';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

const RoomReservation: React.VFC = () => {
  const [loading, setLoading] = useState(true);
  const [reservedTimes, setReservedTimes] = useState<number[]>([]);
  const [alertType, setAlertType] = useState<TransactionReceipt>();
  const [toastMessage, setToastMessage] = useState('');

  const { account, active, library } = useWeb3React();
  let params = useParams();
  const { roomId } = params;
  const address = process.env.REACT_APP_CONTRACT_ADDRESS;
  const userContext = useContext(UserContext);

  const roomBookingContract = useGetContract(
    address,
    RoomBooking.abi,
    library,
    account,
  );

  useEffect(() => {
    (async (): Promise<void> => {
      if (roomBookingContract) {
        setLoading(true);
        try {
          const availability = await roomBookingContract.getRoomReservation(
            roomId,
          );
          const reservedTimesArray = getReservedHours(availability);
          setReservedTimes(reservedTimesArray);
        } catch {
          console.error('Could not get room availabilities');
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [roomBookingContract, alertType, roomId]);

  const reserveTimeslot = async (roomId: string, timeSlot: number) => {
    if (roomBookingContract) {
      try {
        const transaction = await roomBookingContract.createReservation(
          roomId,
          timeSlot,
        );
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
          setToastMessage('Your booking failed');
          setAlertType(TransactionReceipt.FAILURE);
          return;
        } else {
          setToastMessage('Congratulations! Your booking is successful!');
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

  const closeAlert = () => {
    setAlertType(undefined);
    setToastMessage('');
    return;
  };

  const hasAdminRights = userContext.roles.includes(Roles.ADMIN);
  const hasBookerRights = userContext.roles.includes(Roles.BOOKER);

  return (
    <Grid container justifyContent="center" sx={{ minHeight: '80vH' }}>
      {loading ? (
        <LoadingSkeleton />
      ) : active && account && roomId ? (
        <>
          {hasBookerRights || hasAdminRights ? (
            <Grid container>
              {!!alertType && (
                <ToastAlert
                  alertType={alertType}
                  closeAlert={closeAlert}
                  toastMessage={toastMessage}
                />
              )}
              <Grid item xs={12}>
                <Typography variant="h3" sx={{ m: 1, pt: 2 }}>
                  Available timeslots for Room {roomArray[parseInt(roomId)]}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={3}
                  justifyContent="center"
                  sx={{ my: 'auto' }}
                >
                  {(
                    Object.keys(Timeslots).filter((v) =>
                      isNaN(Number(v)),
                    ) as (keyof typeof Timeslots)[]
                  ).map((slot, idx) => {
                    return (
                      <Button
                        key={idx}
                        variant="contained"
                        size="large"
                        color={reservedTimes.includes(idx) ? 'error' : 'info'}
                        disabled={reservedTimes.includes(idx)}
                        sx={{
                          p: 2,
                        }}
                        onClick={() => reserveTimeslot(roomId, idx)}
                      >
                        {Timeslots[idx]}
                      </Button>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <AccessError />
          )}
        </>
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

export default RoomReservation;
