import * as React from "react";
import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import {isLoggedIn} from "../../services/auth";
import Modal from "@conductionnl/nl-design-system/lib/Modal/src/modal";

export default function RequestTable() {
  const [context, setContext] = React.useState(null);
  const [request, setRequest] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
        fetch(`${context.apiUrl}/request_logs`, {
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
        })
          .then(response => response.json())
          .then((data) => {
            setRequest(data);
          });
      }
    }
  }, [context]);

  return (
    <>
    <Table columns={[{
      headerName: "ID",
      field: "id"
    }, {
      headerName: "Description",
      field: "description"
    }, {
      headerName: "Start date",
      field: "startDate"
    }, {
      field: "document",
      headerName: " ",
      renderCell: () => {
        return (
          <div className="float-right mr-4">
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#requestLogs">
              Request logs
            </button>
          </div>
        );
      },
    }
    ]} rows={[]}/>

      <Modal title={"Request Logs"}
             id={"requestLogs"}
             body={function () {
               return (
                 "request logs"
               )
             }}/>
  </>
  );
}
