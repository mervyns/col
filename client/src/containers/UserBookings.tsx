import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Roles,
  Timeslots,
  TransactionReceipt,
  roomArray,
} from '../utils/types';

import LoadingSkeleton from '../components/LoadingSkeleton';
import RoomBooking from '../contracts/RoomBooking.json';
import ToastAlert from '../components/ToastAlert';
import { Web3Window } from '../utils/Web3ContextProvider';
import useGetContract from '../hooks/useGetRoomBookingContract';
import { useWeb3React } from '@web3-react/core';

declare const window: Web3Window;

interface UserReservations {
  roomId: number;
  reservationTime: number;
}

interface TableColumn {
  id: number;
  columnName: string;
}

const UserBookings: React.VFC = () => {
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<UserReservations[]>([]);
  const [alertType, setAlertType] = useState<TransactionReceipt>();
  const [toastMessage, setToastMessage] = useState('');
  const { account, active, library } = useWeb3React();
  const address = process.env.REACT_APP_CONTRACT_ADDRESS;

  const roomBookingContract = useGetContract(
    address,
    RoomBooking.abi,
    library,
    account,
  );

  const columns: TableColumn[] = [
    { id: 1, columnName: 'ID' },
    { id: 2, columnName: 'Room ID' },
    { id: 3, columnName: 'Reservation Time' },
    { id: 4, columnName: 'Actions' },
  ];

  useEffect(() => {
    (async (): Promise<void> => {
      if (roomBookingContract) {
        setLoading(true);
        try {
          const userReservations =
            await roomBookingContract.getUserReservations(account);
          const reservationMap = userReservations.map(
            (res: UserReservations) => ({
              roomId: res.roomId,
              reservationTime: res.reservationTime,
            }),
          );
          setUserBookings(reservationMap);
        } catch {
          console.error('could not fetch user bookings');
        }
        setLoading(false);
      }
    })();
  }, [roomBookingContract, account, toastMessage]);

  const closeAlert = () => {
    setAlertType(undefined);
    setToastMessage('');
    return;
  };

  const handleCancel = async (roomId: number, reservationTime: number) => {
    if (roomBookingContract) {
      try {
        const transaction = await roomBookingContract.removeReservation(
          roomId,
          reservationTime,
        );
        const transactionReceipt = await transaction.wait();
        if (transactionReceipt.status !== 1) {
          setToastMessage('Your cancellation transaction failed.');
          setAlertType(TransactionReceipt.FAILURE);
          return;
        } else {
          setToastMessage('You have successfully cancelled your booking.');
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

  const dataRows = userBookings.map((booking, idx) => ({
    id: idx,
    roomId: booking.roomId,
    reservationTime: booking.reservationTime,
  }));

  return (
    <Grid container justifyContent="center" sx={{ minHeight: '80vH' }}>
      {loading ? (
        <LoadingSkeleton />
      ) : active && account && userBookings ? (
        <Grid item xs={12}>
          <Typography sx={{ my: 3, py: 2 }} variant="h3">
            View own bookings
          </Typography>
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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {columns.map((col) => {
                      return (
                        <TableCell align="center">{col.columnName}</TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataRows.map((row, idx) => {
                    const { roomId, reservationTime } = row;
                    return (
                      <TableRow key={idx}>
                        <TableCell align="center">{row.id}</TableCell>
                        <TableCell align="center">
                          {roomArray[roomId]}
                        </TableCell>
                        <TableCell align="center">
                          {Timeslots[reservationTime]}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="warning"
                            size="large"
                            variant="contained"
                            onClick={() =>
                              handleCancel(roomId, reservationTime)
                            }
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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

export default UserBookings;
