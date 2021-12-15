import * as React from "react";
import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import {isLoggedIn} from "../../services/auth";
import Modal from "@conductionnl/nl-design-system/lib/Modal/src/modal";

export default function ResponseTable() {
  const [context, setContext] = React.useState(null);
  const [responses, setResponse] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getResponses();
    }
  }, [context]);

  const getResponses = () => {
    fetch(`${context.adminUrl}/response_logs`, {
      credentials: 'include',
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then(response => response.json())
      .then((data) => {
        setResponse(data["hydra:member"]);
      });
  }

  return (
    <>
      {responses !== null &&
      responses > 0 ? (
        <Table columns={[{
          headerName: "Status",
          field: "status"
        }, {
          headerName: "Status Code",
          field: "statusCode"
        }, {
          headerName: "Method",
          field: "method"
        }, {
          field: "id",
          headerName: " ",
          renderCell: (item) => {
            return (
              <div className="float-right mr-4">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#responseLogs${item.id.replaceAll('-', '')}`}>
                  Response logs
                </button>
              </div>
            );
          },
        }]} rows={responses}/>
      ) : (
        <Table columns={[{
          headerName: "Status",
          field: "status"
        }, {
          headerName: "Status Code",
          field: "statusCode"
        }, {
          headerName: "Method",
          field: "method"
        }]} rows={[]}/>
      )}

      { responses !== null &&
      responses.map((response) => (
        <Modal title={"Response Logs"}
               id={`responseLogs${response.id}`}
               body={function () {
                 return (
                   <div>
                     {
                       response.responseBody.path !== null && (
                         <>
                           <p><b>Path: </b>{response.responseBody.path}</p>
                         </>
                       )
                     }
                     {
                       response.responseBody.type !== null && (
                         <>
                           <p><b>Type: </b>{response.responseBody.type}</p>
                         </>
                       )
                     }
                     {
                       response.responseBody.message !== null && (
                         <>
                           <b>Message</b>
                           <p>{response.responseBody.message}</p>
                         </>
                       )
                     }
                   </div>
                 )
               }}/>
      ))}
    </>
  );
}
