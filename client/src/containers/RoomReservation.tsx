import { Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Timeslots, roomArray } from '../utils/types';

import LoadingSkeleton from '../components/LoadingSkeleton';
import RoomBooking from '../contracts/RoomBooking.json';
import { Web3Window } from '../utils/Web3ContextProvider';
import { getReservedHours } from '../utils/helperMethods';
import useGetContract from '../hooks/useGetRoomBookingContract';
import { useParams } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

const RoomReservation: React.VFC = () => {
  const [loading, setLoading] = useState(true);
  const [reservedTimes, setReservedTimes] = useState<number[]>([]);
  const {
    account,
    activate,
    active,
    chainId,
    connector,
    deactivate,
    error,
    library,
    setError,
  } = useWeb3React();
  let params = useParams();
  const { roomId } = params;
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
        setLoading(true);
        try {
          const availability = await roomBookingContract.getRoomReservation(
            roomId,
          );
          const reservedTimesArray = getReservedHours(availability);
          setReservedTimes(reservedTimesArray);
        } catch {
          console.error('could not fetch room availability');
        }
        setLoading(false);
      }
    })();
  }, [roomBookingContract]);

  const reserveTimeslot = (roomId: string, timeSlot: number) => {
    console.log('room', roomId, timeSlot);
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {loading ? (
        <LoadingSkeleton />
      ) : active && account && roomId ? (
        <Grid container>
          <Typography variant="h3">
            Available timeslots for Room {roomArray[parseInt(roomId)]}
          </Typography>
          <Grid container sx={{ py: 2 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              justifyContent="center"
            >
              {(
                Object.keys(Timeslots).filter((v) =>
                  isNaN(Number(v)),
                ) as (keyof typeof Timeslots)[]
              ).map((slot, idx) => {
                return (
                  <Button
                    key={idx}
                    variant="outlined"
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
