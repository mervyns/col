# Cola Room Booking App

## Considerations when designing the App

### Business Problem

- Companies don't trust each other
- Users need to book meeting room by the hour
- Users need to see room availability
- Users should be able to cancel room bookings

### Solution

- Need a trustless system (no database, blockchain preferred)
- Need a responsive front-end so that users are able to manage their reservations / bookings

### Assumptions

- All rooms should be bookable by all users
- Rooms should be booked in 1 hour timeslots
- The building operates for 12 hours
- This app is only applicable for COLA Day (1 day only)

### User Stories

- As a user, I want to see room availabilities at once for a given time-slot
- I want to be able to select my room (subject to availability)
- I should be able to click on time-slots with availabilities and book a room
- I should receive a confirmation when room booking is successful
- I should be able to see my active booking(s)
- I should be able to cancel my active booking

## Running the app

### Smart contracts

You will require truffle and ganache-cli to run the app on your local machine

### Set up Ganache

`ganache-cli` to run the local ganache environment

### Migrate contracts

Go to the contracts folder and run `truffle migrate` to start the Migration process and deploy the Solidity contract onto the chain

### Frontend

To run the React frontend, go to the client directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
