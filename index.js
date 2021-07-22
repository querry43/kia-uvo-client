const axios = require('axios')
const axiosCookieJarSupport = require('axios-cookiejar-support').default
const tough = require('tough-cookie')

axiosCookieJarSupport(axios)

 class UvoClient {
  constructor() {
    this.cookieJar = new tough.CookieJar()
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
      },
      jar: this.cookieJar
    }

    return axios.post(
      'https://owners.kia.com/apps/services/owners/apiGateway',
      data,
      config
    ).then(res => res.data.payload)
  }

  refreshVehicleStatus({vehicleKey}) {
    return axios.get(
      'https://owners.kia.com/apps/services/owners/overviewvehicledata',
      {
        params: {
          requestJson: {
            action: 'ACTION_GET_LAST_REFRESHED_STATUS_FULL_LOOP'
          }
        },
        jar: this.cookieJar,
        withCredentials: true,
        headers: {
          vinkey: vehicleKey
        }
      }
    ).then(res => ({vehicleKey}))
  }

  getVehicleStatus({vehicleKey}) {
    return axios.get(
      'https://owners.kia.com/apps/services/owners/getvehicleinfo.html/vehicleFeature/1/vehicleStatus/1/enrollment/1/maintenance/1/dtc/1',
      {
        jar: this.cookieJar,
        withCredentials: true,
        headers: {
          vinkey: vehicleKey
        }
      }
    ).then(res => res.data.payload)
  }
}

module.exports = UvoClient
