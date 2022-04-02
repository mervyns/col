import { Button, Card, CardActions, Grid, Typography } from '@mui/material';

import DrinkCanIcon from '../assets/DrinkCanIcon';
import React from 'react';
import { Web3Window } from '../utils/getWeb3';
import { useNavigate } from 'react-router-dom';
import useWeb3 from '../hooks/web3';

declare const window: Web3Window;

const HomePage: React.VFC = () => {
  const { isLoading, isWeb3, accounts } = useWeb3();
  const roomArray = [
    'C1',
    'C2',
    'C3',
    'C4',
    'C5',
    'C6',
    'C7',
    'C8',
    'C9',
    'C10',
    'P1',
    'P2',
    'P3',
    'P4',
    'P5',
    'P6',
    'P7',
    'P8',
    'P9',
    'P10',
  ];

  let navigate = useNavigate();

  return (
    <Grid container justifyContent="center" alignItems="center">
      {isLoading ? (
        <div>Loading Web3, accounts, and contract...</div>
      ) : isWeb3 ? (
        <Grid item>
          <div>You are logged in as: {accounts}</div>
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
                    <DrinkCanIcon level={Math.random() * 100} id={idx} />
                    <CardActions>
                      <Button
                        size="medium"
                        color="info"
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
