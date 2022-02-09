interface LogObject {
  id: string,
  type: string,
  callId: string,
  routeName: string,
  requestMethod: string,
  responseStatus: string,
  responseStatusCode: number,
  responseTime: number,
  requestPathInfo: string,
  requestLanguages: string,
  requestHeaders: any,
  requestQuery: any,
  responseContent: any,
  requestContent: any,
  responseHeaders: any,
  endpoint: any,
  session: string,
  sessionValues: any 
}

const Log: LogObject = {
  id: '12-34',
  type: 'in',
  callId: 'dc7ce044-e674-46b0-b8e2-089c66ab1b68',
  routeName: '/api/weer',
  requestMethod: 'POST',
  responseStatus: 'HTTP_CREATED',
  responseStatusCode: 201,
  responseTime: 8567,
  requestPathInfo: '/api/weer',
  requestLanguages: "content type?",
  requestHeaders: [{
    accept: 'application/json'
  }],
  responseHeaders: [{
    accept: 'application/json'
  }],
  requestQuery: [{
    query: 'entity.id=test'
  }],
  responseContent: "{'test': 'abc'}",
  requestContent: "{'test': 'abc'}",
  endpoint: {
      id: '123',
      name: 'Fake endpoint'
  },
  session: 'session values',
  sessionValues: [{
    endpoint: {
      id: '123',
      name: 'Fake endpoint'
    }
  }]
}

export default Log;
