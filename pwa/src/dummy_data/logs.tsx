export interface LogObject {
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

const Logs: LogObject[] = [
  {
    id: "12-34",
    type: "in",
    callId: "dc7ce044-e674-46b0-b8e2-089c66ab1b68",
    routeName: "/api/weer",
    requestMethod: "POST",
    responseStatus: "HTTP_CREATED",
    responseStatusCode: 403,
    responseTime: 8687,
    requestPathInfo: "/api/weer",
    requestLanguages: "content type?",
    requestHeaders: [{
      accept: "application/json"
    }],
    responseHeaders: [{
      accept: "application/json"
    }],
    requestQuery: [{
      query: "entity.id=test"
    }],
    responseContent: "{'test': 'abc'}",
    requestContent: "{'test': 'abc'}",
    endpoint: {
      id: "123",
      name: "Fake endpoint"
    },
    session: "session values",
    sessionValues: [{
      endpoint: {
        id: "123",
        name: "Fake endpoint"
      }
    }]
  },
  {
    id: "6458fcb1-9bf0-4c23-b880-c60eef3e7b72",
    type: "in",
    callId: "dc7ce044-e674-46b0-b8e2-089c66ab1b68",
    routeName: "/api/weer",
    requestMethod: "POST",
    responseStatus: "HTTP_CREATED",
    responseStatusCode: 201,
    responseTime: 8246,
    requestPathInfo: "/api/weer",
    requestLanguages: "content type?",
    requestHeaders: [{
      accept: "application/json"
    }],
    responseHeaders: [{
      accept: "application/json"
    }],
    requestQuery: [{
      query: "entity.id=test"
    }],
    responseContent: "{'test': 'abc'}",
    requestContent: "{'test': 'abc'}",
    endpoint: {
      id: "123",
      name: "Fake endpoint"
    },
    session: "session values",
    sessionValues: [{
      endpoint: {
        id: "123",
        name: "Fake endpoint"
      }
    }]
  },
  {
    id: "8cf16f60-a6cb-44cd-a94a-43fd56d9a14b",
    type: "in",
    callId: "dc7ce044-e674-46b0-b8e2-089c66ab1b68",
    routeName: "/api/weer",
    requestMethod: "POST",
    responseStatus: "HTTP_CREATED",
    responseStatusCode: 200,
    responseTime: 8135,
    requestPathInfo: "/api/weer",
    requestLanguages: "content type?",
    requestHeaders: [{
      accept: "application/json"
    }],
    responseHeaders: [{
      accept: "application/json"
    }],
    requestQuery: [{
      query: "entity.id=test"
    }],
    responseContent: "{'test': 'abc'}",
    requestContent: "{'test': 'abc'}",
    endpoint: {
      id: "123",
      name: "Fake endpoint"
    },
    session: "session values",
    sessionValues: [{
      endpoint: {
        id: "123",
        name: "Fake endpoint"
      }
    }]
  },
  {
    id: "faec5430-88bd-41e0-924d-7a09a16730cf",
    type: "in",
    callId: "dc7ce044-e674-46b0-b8e2-089c66ab1b68",
    routeName: "/api/weer",
    requestMethod: "POST",
    responseStatus: "HTTP_CREATED",
    responseStatusCode: 203,
    responseTime: 8976,
    requestPathInfo: "/api/weer",
    requestLanguages: "content type?",
    requestHeaders: [{
      accept: "application/json"
    }],
    responseHeaders: [{
      accept: "application/json"
    }],
    requestQuery: [{
      query: "entity.id=test"
    }],
    responseContent: "{'test': 'abc'}",
    requestContent: "{'test': 'abc'}",
    endpoint: {
      id: "123",
      name: "Fake endpoint"
    },
    session: "session values",
    sessionValues: [{
      endpoint: {
        id: "123",
        name: "Fake endpoint"
      }
    }]
  },
  {
    id: "2afb95b3-f89a-489b-bd10-8da293eee32c",
    type: "in",
    callId: "dc7ce044-e674-46b0-b8e2-089c66ab1b68",
    routeName: "/api/weer",
    requestMethod: "POST",
    responseStatus: "HTTP_CREATED",
    responseStatusCode: 404,
    responseTime: 8658,
    requestPathInfo: "/api/weer",
    requestLanguages: "content type?",
    requestHeaders: [{
      accept: "application/json"
    }],
    responseHeaders: [{
      accept: "application/json"
    }],
    requestQuery: [{
      query: "entity.id=test"
    }],
    responseContent: "{'test': 'abc'}",
    requestContent: "{'test': 'abc'}",
    endpoint: {
      id: "123",
      name: "Fake endpoint"
    },
    session: "session values",
    sessionValues: [{
      endpoint: {
        id: "123",
        name: "Fake endpoint"
      }
    }]
  },
  {
    id: "36aef369-bb02-4419-8627-1f677301a511",
    type: "in",
    callId: "dc7ce044-e674-46b0-b8e2-089c66ab1b68",
    routeName: "/api/weer",
    requestMethod: "POST",
    responseStatus: "HTTP_CREATED",
    responseStatusCode: 201,
    responseTime: 8245,
    requestPathInfo: "/api/weer",
    requestLanguages: "content type?",
    requestHeaders: [{
      accept: "application/json"
    }],
    responseHeaders: [{
      accept: "application/json"
    }],
    requestQuery: [{
      query: "entity.id=test"
    }],
    responseContent: "{'test': 'abc'}",
    requestContent: "{'test': 'abc'}",
    endpoint: {
      id: "123",
      name: "Fake endpoint"
    },
    session: "session values",
    sessionValues: [{
      endpoint: {
        id: "123",
        name: "Fake endpoint"
      }
    }]
  }
];

export default Logs;
