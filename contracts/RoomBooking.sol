// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./utils/Ownable.sol";

contract RoomBooking is Ownable {
  
  struct Room {
    address bookerAddress;
    uint8 reservationTime;
  }

  struct Reservation {
    mapping(uint8 => Room) reservedSlots;
  }

  mapping(uint8 => Reservation) private reservations;

  // USER MANAGEMENT


  // ROOM BOOKING
  function createReservation(uint8 reservationTime, uint8 roomId) public {
    require(reservations[roomId].reservedSlots[reservationTime].reservationTime == 0, "Room is not available at that time");
    reservations[roomId].reservedSlots[reservationTime] = Room({
      bookerAddress: msg.sender,
      reservationTime: reservationTime
    });
  }


  function removeReservation(uint8 time, uint8 roomId) public {
    require(reservations[roomId].reservedSlots[time].reservationTime != 0, "No reservation at this time");
    require(reservations[roomId].reservedSlots[time].bookerAddress == msg.sender, "You can only cancel your own reservation");

    delete reservations[roomId].reservedSlots[time];
  }

  function getRoomReservation(uint8 roomId) external view returns (uint8[] memory) {
    uint8[] memory reservedSlot = new uint8[](12);
    for (uint8 i = 1; i < 12; i++) {
      if (reservations[roomId].reservedSlots[i].reservationTime != 0) {
        reservedSlot[i] = reservations[roomId].reservedSlots[i].reservationTime;
      }
    }
    return reservedSlot;
  }

  // function getAllReservations() external view returns (string[] memory) {
  //     string[] memory allReservations = new string[](20);
  //     for (uint8 i = 0; i < 20; i++) {
  //     uint8[] memory bookedRooms = new uint8[](12);
  //     for (uint8 k = 1; k < 12; k++) {
  //       if (reservations[i].reservedSlots[k].reservationTime != 0) {
  //         bookedRooms[k] = reservations[i].reservedSlots[k].reservationTime;
  //       }
  //     }
  //     allReservations[i] = string(bookedRooms);
  //   }
  //   return allReservations;
  // }
}