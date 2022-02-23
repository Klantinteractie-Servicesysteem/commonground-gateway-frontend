import * as React from "react";
import {
  Table,
  Card,
  Spinner,
  Modal
} from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";

export default function TableNamesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({ title: "Table names", subText: "An overview of your table names" });
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL
      });
    } else if (isLoggedIn()) {
      getTranslations(context);
    }
  }, [context]);

  const getTranslations = (context) => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/table_names`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt")
      }
    })
      .then((response) => response.json())
      .then((data) => {
        // convert array to array objects
        const convertedArray = data["results"].map((value) => ({
          name: value
        }));
        setShowSpinner(false);
        setTableNames(convertedArray);
      })
      .catch((error) => {
        setShowSpinner(false);
        setAlert({ type: "danger", message: error.message });
        throw new Error("GET Table names error: " + error);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <Card
      title={"Translations"}
      cardHeader={function() {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#helpModal"
            >
              <Modal
                title="Translations Documentation"
                id="helpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getTranslations}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/translations/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function() {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : tableNames ? (
                <Table
                  columns={[
                    {
                      headerName: "Tables",
                      field: "name"
                    },
                    {
                      field: "name",
                      headerName: " ",
                      renderCell: (tables: { name: string }) => {
                        return (
                          <Link
                            className="utrecht-link d-flex justify-content-end"
                            to={`/translations/${tables.name}`}
                          >
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      }
                    }
                  ]}
                  rows={tableNames}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Tables",
                      field: "name"
                    }
                  ]}
                  rows={[{ name: "No results found" }]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
