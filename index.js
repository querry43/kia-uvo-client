const axios = require('axios')
const axiosCookieJarSupport = require('axios-cookiejar-support').wrapper
const { CookieJar } = require('tough-cookie')

class UvoClient {
  constructor() {
    this.cookieJar = new CookieJar()
    this.client = axiosCookieJarSupport(axios.create({ jar: this.cookieJar }))
  }

  authenticate({userId, password}) {
    const data = {
        action: 'authenticateUser',
        userId,
        password
    }

    const config = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }

    return this.client.post(
      'https://owners.kia.com/apps/services/owners/apiGateway',
      data,
      config
    ).then(res => res.data.payload)
  }

  refreshVehicleStatus({vehicleKey}) {
    return this.client.get(
      'https://owners.kia.com/apps/services/owners/overviewvehicledata',
      {
        params: {
          requestJson: {
            action: 'ACTION_GET_LAST_REFRESHED_STATUS_FULL_LOOP'
          }
        },
        headers: {
          vinkey: vehicleKey
        }
      }
    ).then(res => ({vehicleKey}))
  }

  getVehicleStatus({vehicleKey}) {
    return this.client.get(
      'https://owners.kia.com/apps/services/owners/getvehicleinfo.html/vehicleFeature/1/vehicleStatus/1/enrollment/1/maintenance/1/dtc/1',
      {
        headers: {
          vinkey: vehicleKey
        }
      }
    ).then(res => res.data.payload)
  }
}

module.exports = UvoClient
