# ATLAS+ X

Cross-Platform (Android/iOS Tablet/Phone) ATLAS application

## Core Technologies

- [RxDB](https://github.com/pubkey/rxdb)
- [Expo](https://expo.io/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

## Environment Variables

- `API_HOST` - path to the API host. e.g. https://api.ashored.ca
- `MAPBOX_TOKEN` - user token for access to mapbox
- `API_BASIC_USERNAME` - use basic auth username when accessing the API (for development/staging)
- `API_BASIC_PASSWORD` - use basic auth username when accessing the API (for development/staging)

## Setup

`yarn install` followed by `npx pod-install`. Proceed to scripts

## Scripts

`yarn run (android|ios)`

Further: see [react native guides](https://reactnative.dev/docs/running-on-device)

## Overview

Core functionality consists of marking buoy locations by "deploying" gear and subsequently recovering it. Timestamps and coordinates are recorded during deployment/recovering. Users can also mark deployed gear as lost (timestamp when it was marked lost will be recoreded)

## Database

The RxDB Database currently consists of 4 collections (schemas available in `lib/rxdb`)

- gear_events - logging deploying/recovering/lost gear
- trips - trips are simply a start and end location with references to set/recovered gear events
- user - the logged in user
- waypoints - user entered waypoints for purposes of marking points-of-interest (POI) on the interface .(not currently used)

The implementation of RxDB is decoupled from the application code by using the react hooks in `lib/Providers/RxDB/hooks`. You are encouraged to NOT interact with RxDB directly from the components, but instead create a hook that provides the desired functionality/query.
