import React from 'react';
import { Container } from '@mui/material';
import HomePage from './containers/HomePage';
import RoomReservation from './containers/RoomReservation';

import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';

const App: React.VFC = () => {
  return (
    <div className="App">
      <Header />
      <Container>
        <Routes>
          <Route path="/reserve/:roomId" element={<RoomReservation />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
