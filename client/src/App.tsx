import './App.css';

import { Route, Routes } from 'react-router-dom';

import { Container } from '@mui/material';
import Header from './components/Header';
import HomePage from './containers/HomePage';
import ManageUsers from './containers/ManageUsers';
import React from 'react';
import RoomReservation from './containers/RoomReservation';
import UserBookings from './containers/UserBookings';
import { Web3ReactContextProvider } from './utils/Web3ContextProvider';

const App: React.VFC = () => {
  return (
    <div className="App">
      <Web3ReactContextProvider pollingInterval={12000}>
        <Header />
        <Container maxWidth="lg" sx={{ bgcolor: '#f0e7e6' }}>
          <Routes>
            <Route path="/reserve/:roomId" element={<RoomReservation />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/user-bookings" element={<UserBookings />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Container>
      </Web3ReactContextProvider>
    </div>
  );
};

export default App;
