const UvoClient = require('../')
const nock = require('nock')
const { expect } = require('chai')
const { matches } = require('lodash')

const respondToAuthentication = () => {
  const expectedHeaders = {
    'content-type': 'application/x-www-form-urlencoded'
  }

  const expectedParams = {
    action: 'authenticateUser',
    userId: 'foo',
    password: 'bar'
  }

  const reply = {
    status: {
      statusCode: 0,
      errorType: 0,
      errorCode: 0,
      errorMessage: 'Success with response body'
    },
    payload: {
      vehicleSummary: [
        {
          vehicleKey: 123
        }
      ]
    }
  }

  const replyHeaders = {
    'Set-Cookie': 'JSESSIONID=123'
  }

  nock('https://owners.kia.com', { reqheaders: expectedHeaders })
    .post('/apps/services/owners/apiGateway', matches(expectedParams))
    .reply(200, reply, replyHeaders)
}

const respondToRefreshVehicleStatus = () => {
  const expectedHeaders = {
    vinkey: 123,
    cookie: 'JSESSIONID=123'
  }

  const expectedParams = {
    requestJson: '{"action":"ACTION_GET_LAST_REFRESHED_STATUS_FULL_LOOP"}'
  }

  const reply = {
    status: {
      statusCode: 0,
      errorType: 0,
      errorCode: 0,
      errorMessage: 'Success with response body'
    }
  }

  nock('https://owners.kia.com', { reqheaders: expectedHeaders })
    .get('/apps/services/owners/overviewvehicledata')
    .query(expectedParams)
    .reply(200, reply)
}

const respondToVehicleStatus = () => {
  const expectedHeaders = {
    vinkey: 123,
    cookie: 'JSESSIONID=123'
  }

  const reply = {
    status: {
      statusCode: 0,
      errorType: 0,
      errorCode: 0,
      errorMessage: 'Success with response body'
    },
    payload: {
      vehicleInfoList: [
        {
          vinKey: 123
        }
      ]
    }
  }

  nock('https://owners.kia.com', { reqheaders: expectedHeaders })
    .get('/apps/services/owners/getvehicleinfo.html/vehicleFeature/1/vehicleStatus/1/enrollment/1/maintenance/1/dtc/1')
    .reply(200, reply)
}

describe('UvoClient', () => {
  beforeEach(respondToAuthentication)
  beforeEach(respondToRefreshVehicleStatus)
  beforeEach(respondToVehicleStatus)

  it('should authenticate and save cookies', async () => {
    const client = new UvoClient()
    const data = await client.authenticate({userId: 'foo', password: 'bar'})

    expect(data.vehicleSummary[0].vehicleKey).to.equal(123)

    const cookie = await client.cookieJar.getCookieString('https://owners.kia.com/', {allPaths: true})
    expect(cookie).to.equal('JSESSIONID=123')
  })

  it('should refresh vehicle status', async () => {
    const client = new UvoClient()
    await client.authenticate({userId: 'foo', password: 'bar'})
    const data = await client.refreshVehicleStatus({vehicleKey: '123'})

    expect(data).to.deep.equal({vehicleKey: '123'})
  })

  it('should get vehicle status', async() => {
    const client = new UvoClient()
    await client.authenticate({userId: 'foo', password: 'bar'})
    const data = await client.getVehicleStatus({vehicleKey: '123'})

    expect(data).to.deep.equal({
      vehicleInfoList: [
        {
          vinKey: 123
        }
      ]
    })
  })
})
