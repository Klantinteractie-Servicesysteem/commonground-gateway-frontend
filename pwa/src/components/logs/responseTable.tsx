import * as React from "react";
import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";
import { isLoggedIn } from "../../services/auth";
import Modal from "@conductionnl/nl-design-system/lib/Modal/src/modal";

export default function ResponseTable() {
  const [context, setContext] = React.useState(null);
  const [response, setResponse] = React.useState(null);

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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data);
      });
  };

  return (
    <>
      <Table
        columns={[
          {
            headerName: "ID",
            field: "id",
          },
          {
            headerName: "Description",
            field: "description",
          },
          {
            headerName: "Start date",
            field: "startDate",
          },
          {
            field: "document",
            headerName: " ",
            renderCell: () => {
              return (
                <div className="float-right mr-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#responseLogs"
                  >
                    Response logs
                  </button>
                </div>
              );
            },
          },
        ]}
        rows={[]}
      />

      <Modal
        title={"Response Logs"}
        id={"responseLogs"}
        body={function () {
          return "request logs";
        }}
      />
    </>
  );
}
