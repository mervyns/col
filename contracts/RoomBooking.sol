// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "./node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "./node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract RoomBooking is AccessControl, Ownable {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant BOOKER_ROLE = keccak256("BOOKER_ROLE");

  struct Room {
    address bookerAddress;
    uint8 reservationTime;
  }

  struct Reservation {
    mapping(uint8 => Room) reservedSlots;
  }

  mapping(uint8 => Reservation) private reservations;

  constructor ()
  {
    // Give Owner Admin Role
    _setupRole(ADMIN_ROLE, msg.sender);
    _setRoleAdmin(BOOKER_ROLE, ADMIN_ROLE);
  }

  // USER MANAGEMENT
  function addAdmin(address userAddress)
    public onlyOwner
  {
    _grantRole(ADMIN_ROLE, userAddress);
  }

  function removeAdmin(address userAddress) 
    public onlyOwner
  {
    _grantRole(ADMIN_ROLE, userAddress);
  }

  function addBooker(address userAddress)
    public 
  {
    require(hasRole(ADMIN_ROLE, msg.sender), "You need to be an admin");
    _grantRole(BOOKER_ROLE, userAddress);
  }

  function removeBooker(address userAddress)
    public
  {
    require(hasRole(ADMIN_ROLE, msg.sender), "You need to be an admin");
    _revokeRole(BOOKER_ROLE, userAddress);
  }

  function isAdmin(address account)
    public virtual view returns (bool)
  {
    return hasRole(ADMIN_ROLE, account);
  }

  function isBooker(address account)
    public virtual view returns (bool)
  {
    return hasRole(BOOKER_ROLE, account);
  }

  // ROOM BOOKING
  function createReservation(uint8 roomId, uint8 reservationTime) 
    public
  {
    require(hasRole(BOOKER_ROLE, msg.sender), "You need to have a booker role");
    require(reservations[roomId].reservedSlots[reservationTime].reservationTime == 0, "Room is not available at that time");
    reservations[roomId].reservedSlots[reservationTime] = Room({
      bookerAddress: msg.sender,
      reservationTime: reservationTime
    });
  }

  function removeReservation(uint8 roomId, uint8 reservationTime)
    public
  {
    require(reservations[roomId].reservedSlots[reservationTime].reservationTime != 0, "No reservation at this time");
    require(reservations[roomId].reservedSlots[reservationTime].bookerAddress == msg.sender, "You can only cancel your own reservation");

    delete reservations[roomId].reservedSlots[reservationTime];
  }

  function getRoomReservation(uint8 roomId)
    external view returns (uint8[] memory)
  {
    uint8[] memory reservedSlot = new uint8[](12);
    for (uint8 i = 1; i < 12; i++) {
      if (reservations[roomId].reservedSlots[i].reservationTime != 0) {
        reservedSlot[i] = reservations[roomId].reservedSlots[i].reservationTime;
      }
    }
    return reservedSlot;
  }

  function getReservationDetails(uint8 roomId, uint8 reservationTime)
    external view returns (Room memory)
  {
    require(hasRole(ADMIN_ROLE, msg.sender), "You need to be an admin");
    return reservations[roomId].reservedSlots[reservationTime];
  }
}