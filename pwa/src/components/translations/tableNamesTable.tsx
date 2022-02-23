import * as React from "react";
import {
  Table,
  Card,
  Spinner,
  Modal
} from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";

export default function TableNamesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    handleSetTableNames();
    setHeader({ title: "Table names", subText: "An overview of your all table names objects" });
  }, [API]);

  const handleSetTableNames = () => {
    setShowSpinner(true);
    API.Translation.getAllTableNames()
      .then((res) => {
        const convertedArray = res.data["results"].map((value) => ({
          name: value
        }));
        setTableNames(convertedArray);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET table names error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  React.useEffect(() => {
    handleSetDocumentation();
  });

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
            <a className="utrecht-link" onClick={handleSetTableNames}>
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
