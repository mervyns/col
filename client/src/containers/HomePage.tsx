import 'dotenv/config';

import { Button, Card, CardActions, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { TOTAL_AVAILABLE_HOURS, roomArray } from '../utils/types';

import DrinkCanIcon from '../assets/DrinkCanIcon';
import LoadingSkeleton from '../components/LoadingSkeleton';
import RoomBooking from '../contracts/RoomBooking.json';
import { Web3Provider } from '@ethersproject/providers';
import { Web3Window } from '../utils/Web3ContextProvider';
import { getReservedHours } from '../utils/helperMethods';
import useGetContract from '../hooks/useGetRoomBookingContract';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

const HomePage: React.VFC = () => {
  const [roomsAvailability, setRoomsAvailability] = useState<
    Record<number, any>
  >({});
  const [loading, setLoading] = useState(true);
  const { account, active, library } = useWeb3React<Web3Provider>();
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
        const roomsStatusHolder: Record<number, any> = {};
        setLoading(true);
        await Promise.all(
          roomArray.map(async (room, idx) => {
            try {
              const availability = await roomBookingContract.getRoomReservation(
                idx,
              );
              roomsStatusHolder[idx] = availability;
            } catch {
              console.error('could not fetch room availability');
            }
          }),
        );
        console.log(roomsStatusHolder);
        setRoomsAvailability(roomsStatusHolder);
        setLoading(false);
      }
    })();
  }, [roomBookingContract]);

  useEffect(() => {
    console.log('roomsav', roomsAvailability);
  }, [loading]);

  let navigate = useNavigate();

  const testContract = async (idx: number) => {
    if (roomBookingContract) {
      const available = await roomBookingContract.getRoomReservation(idx);
      console.log('avaialble', available);
      return available;
    } else {
      console.error('contract not enabled');
      return;
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      {loading ? (
        <LoadingSkeleton />
      ) : active && account ? (
        <Grid item>
          <Grid container>
            {roomArray.map((room, idx) => {
              return (
                <Grid item xs={12} md={2} key={idx}>
                  <Card
                    variant="outlined"
                    sx={{
                      background: idx < 10 ? ' #F40009' : '#004B93',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 1,
                      m: 1,
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'white' }}>
                      {room}
                    </Typography>
                    <Button
                      size="medium"
                      color="info"
                      sx={{ m: 'auto' }}
                      onClick={() => testContract(idx)}
                    >
                      Test Contract
                    </Button>
                    <DrinkCanIcon
                      level={
                        (1 -
                          getReservedHours(roomsAvailability[idx]).length /
                            TOTAL_AVAILABLE_HOURS) *
                        100
                      }
                      id={idx}
                    />
                    <CardActions>
                      <Button
                        variant="contained"
                        size="medium"
                        color="success"
                        sx={{ m: 'auto' }}
                        onClick={() => navigate(`/reserve/${idx}`)}
                      >
                        Reserve Room
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
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

export default HomePage;
