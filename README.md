# kia-uvo-client

![npm (scoped)](https://img.shields.io/npm/v/@qrry43/kia-uvo-client)
![Travis (.com) branch](https://img.shields.io/travis/com/querry43/kia-uvo-client/main)
![NPM](https://img.shields.io/npm/l/@qrry43/kia-uvo-client)

This library interacts with Kia Uvo, Kia's infotainment and telematics service.
It allows one to fetch vehicle status, including lock, engine, and battery
state and many other details.

## Synopsis

Login, refresh vehicle data, then fetch and print the current battery charge level.

```javascript
const UvoClient = require('@qrry43/kia-uvo-client')

const client = new UvoClient()

client.authenticate({
  userId: 'your-user-id',
  password: 'your-password'
}).then(({vehicleSummary}) =>
  client.refreshVehicleStatus({vehicleKey: vehicleSummary[0].vehicleKey})
).then(({vehicleKey}) =>
  client.getVehicleStatus({vehicleKey})
).then(data => {
  const chargePct = data.vehicleInfoList[0].lastVehicleInfo.vehicleStatusRpt.vehicleStatus.batteryStatus.stateOfCharge
  console.log(`Battery charge: ${chargePct}%`)
})
```

## Installing

```bash
npm install @qrry43/kia-uvo-client
```

## Constructor

Create a new client object.  There are no parameters.

```javascript
const client = new UvoClient()
```

## Methods

### client.authenticate

Connect to the service and authenticate with a username and password.  Returns a
promise which resolves to an object with a list of vehicles.  Authentication
will time out and needs to be repeated periodically.

Parameters:

* __userId__ the user id, may be an email address
* __password__ the user password

Returns a promise which resolves to an object like the following:

```json
{
  "vehicleSummary": [
    {
      "vin": "some-vin",
      "vehicleIdentifier": "some-id",
      "modelName": "NIRO PHEV",
      "modelYear": "2019",
      "nickName": "My NIRO PHEV",
      "generation": 2,
      "extColorCode": "CR5",
      "trim": "EX PRE",
      "imagePath": { },
      "enrollmentStatus": 1,
      "fatcAvailable": 0,
      "telematicsUnit": 1,
      "fuelType": 7,
      "colorName": "RUNWAY RED",
      "activationType": 1,
      "mileage": "12345.6",
      "dealerCode": "OR011",
      "mobileStore": [],
      "supportedApp": { },
      "supportAdditionalDriver": 0,
      "customerType": 0,
      "projectCode": "SOMECODE",
      "headUnitDesc": "AVN5.0",
      "provStatus": "4",
      "enrollmentSuppressionType": 0,
      "vehicleKey": "some-vehicle-key"
    }
  ]
}
```

The most important value is the __vehicleKey__ which is a unique key for the
vehicle.  This key changes periodically (probably to prevent replay attacks)
and is required for all other actions.

### client.refreshVehicleStatus

Uvo will serve stale data.  This method tells Uvo to fetch fresh data.  This
may take some time to complete and it is likely that there are consequences to
calling this too frequently.

Parameters:

* __vehicleKey__ the key from client.authenticate

Returns a promise which resolves to the parameters passed to it.

### client.getVehicleStatus

This method returns the most recent cached vehicle status.  If you need the
current status, be sure to call __client.refreshVehicleStatus__.

Parameters:

* __vehicleKey__ the key from client.authenticate

Returns a promise which resolves to a very large data structure, similar to the
following:

```json
{
  "vehicleInfoList": [
    {
      "vinKey": "some-key",
      "vehicleConfig": {
      },
      "lastVehicleInfo": {
        "vehicleNickName": "My Car",
        "vehicleStatusRpt": {
          "reportDate": {
            "utc": "20210722052311",
            "offset": -7
          },
          "vehicleStatus": {
            "engine": false,
            "doorLock": true,
            "lowFuelLight": false,
          }
        }
      }
    }
  ]
}
```

## Copyright

Copyright (c) 2021 Matt Harrington
