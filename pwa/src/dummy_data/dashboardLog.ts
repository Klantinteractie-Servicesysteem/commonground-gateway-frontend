interface Log {
  status: number,
  type: "Incoming" | "Outgoing",
  method: "GET" | "POST" | "PUT" | "DELETE",
  responseTime: number,
}

export const DashboardLogs: Log[] = [
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1201,
  },
  {
    status: 201,
    type: "Incoming",
    method: "POST",
    responseTime: 2031,
  },
  {
    status: 403,
    type: "Outgoing",
    method: "PUT",
    responseTime: 842,
  },
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1341,
  },
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1201,
  },
  {
    status: 201,
    type: "Incoming",
    method: "POST",
    responseTime: 2031,
  },
  {
    status: 403,
    type: "Outgoing",
    method: "PUT",
    responseTime: 842,
  },
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1341,
  },
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1201,
  },
  {
    status: 201,
    type: "Incoming",
    method: "POST",
    responseTime: 2031,
  },
  {
    status: 403,
    type: "Outgoing",
    method: "PUT",
    responseTime: 842,
  },
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1341,
  },
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1201,
  },
  {
    status: 201,
    type: "Incoming",
    method: "POST",
    responseTime: 2031,
  },
  {
    status: 403,
    type: "Outgoing",
    method: "PUT",
    responseTime: 842,
  },
  {
    status: 200,
    type: "Incoming",
    method: "GET",
    responseTime: 1341,
  },
]
