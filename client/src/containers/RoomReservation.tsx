import { Button, Grid, Stack, Typography } from '@mui/material';

import React from 'react';
import { Web3Window } from '../utils/getWeb3';
import { useParams } from 'react-router-dom';
import useWeb3 from '../hooks/web3';

declare const window: Web3Window;

const RoomReservation: React.VFC = () => {
  const { isLoading, isWeb3, web3, accounts } = useWeb3();
  let params = useParams();
  const { roomId } = params;
  enum timeSlots {
    '0800 HRS',
    '0900 HRS',
    '1000 HRS',
    '1100 HRS',
    '1200 HRS',
    '1300 HRS',
    '1400 HRS',
    '1500 HRS',
    '1600 HRS',
    '1700 HRS',
    '1800 HRS',
    '1900 HRS',
  }

  const reserveTimeslot = (roomId: string, timeSlot: number) => {
    console.log('room', roomId, timeSlot);
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {isLoading ? (
        <div>Loading Web3, accounts, and contract...</div>
      ) : isWeb3 && roomId ? (
        <Grid container>
          <Typography variant="h3">Available timeslots for {roomId}</Typography>
          <Grid container sx={{ py: 2 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              justifyContent="center"
            >
              {(
                Object.keys(timeSlots).filter((v) =>
                  isNaN(Number(v)),
                ) as (keyof typeof timeSlots)[]
              ).map((slot, idx) => {
                return (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    sx={{
                      p: 1,
                      m: 1,
                    }}
                    onClick={() => reserveTimeslot(roomId, idx)}
                  >
                    {timeSlots[idx]}
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
