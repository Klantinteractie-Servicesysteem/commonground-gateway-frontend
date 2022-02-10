import * as React from "react";
import { Table, Card, Spinner, Alert } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import FlashMessage from 'react-flash-message';
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export default function TableNamesTable() {
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);



  React.useEffect(() => {
    getTableNames()
  }, [API]);

  const getTableNames = () => {
    setShowSpinner(true);
    API.Translation.getTableNames()
      .then((res) => { setTableNames(res.data); })
      .catch((err) => { throw new Error('GET translation error: ' + err) })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  return (<>
    <Card
      title={"Translation tables"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-toggle="modal"
              data-target="helpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getTableNames}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/translation-tables/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create new
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function () {
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
                      field: "name",
                    },
                    {
                      field: "name",
                      headerName: " ",
                      renderCell: (tables: { name: string }) => {
                        return (
                          <Link className="utrecht-link d-flex justify-content-end" to={`/translation-tables/${tables.name}`}>
                            <button className="utrecht-button btn-sm btn-primary">
                              <i className="fas fa-eye pr-1" />
                              View
                            </button>
                          </Link>
                        );
                      },
                    }
                  ]}
                  rows={tableNames}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Tables",
                      field: "name",
                    }
                  ]}
                  rows={[{ name: 'No results found' }]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  </>
  )
}
