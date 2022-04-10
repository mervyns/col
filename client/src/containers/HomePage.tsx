import {
  Box,
  Button,
  Card,
  CardActions,
  Grid,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Roles, TOTAL_AVAILABLE_HOURS, roomArray } from '../utils/types';

import AccessError from '../components/AccessError';
import DrinkCanIcon from '../assets/DrinkCanIcon';
import LoadingSkeleton from '../components/LoadingSkeleton';
import RoomBooking from '../contracts/RoomBooking.json';
import { UserContext } from '../utils/UserContextProvider';
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
        setRoomsAvailability(roomsStatusHolder);
        setLoading(false);
      }
    })();
  }, [roomBookingContract, account]);

  let navigate = useNavigate();

  const hasAdminRights = userContext.roles.includes(Roles.ADMIN);
  const hasBookerRights = userContext.roles.includes(Roles.BOOKER);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '80vH' }}
    >
      {loading ? (
        <LoadingSkeleton />
      ) : active && account ? (
        <Grid item>
          {hasBookerRights || hasAdminRights ? (
            <Grid container>
              <Grid item xs={12}>
                <Box sx={{ m: 2, p: 2 }}>
                  <Typography sx={{ typography: { sm: 'h6', md: 'h4' }, m: 1 }}>
                    Click on Reserve Room to view Room and Available Timeslots
                  </Typography>
                  <Typography sx={{ typography: { sm: 'h6', md: 'h4' }, m: 1 }}>
                    Volume of cola in can indicates how many timeslots have been
                    taken.
                  </Typography>
                </Box>
              </Grid>
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
                      <Typography variant="h4" sx={{ color: '#ffffff' }}>
                        {room}
                      </Typography>
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
          ) : (
            <AccessError />
          )}
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
