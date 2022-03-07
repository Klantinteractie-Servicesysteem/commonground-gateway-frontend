import * as React from "react";
import { Link } from "gatsby";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { navigate } from "gatsby";
import { useAsync } from "../../hooks/useAsync";

export default function TableNamesTable() {
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    !tableNames && setShowSpinner(true);

    tableNames && setShowSpinner(false);
  }, [tableNames]);

  useAsync({
    asyncFunction: API.Translation.getTableNames,
    onSuccess: (res) => {
      const names = res.data.results.map((name) => {
        return { name: name };
      });
      setTableNames(names);
    },
    onError: (err) => {
      throw new Error(`GET table names error: ${err}`);
    },
  });

  useAsync({
    asyncFunction: () => API.Documentation.get("translations"),
    onSuccess: (res) => {
      setDocumentation(res.data.content);
    },
    onError: (err) => {
      throw new Error(`GET Translations documentation: ${err}`);
    },
  });

  const linkToTableWithTranslation = (tableName: string) => {
    setShowSpinner(true);
    API.Translation.getAllFrom(tableName)
      .then((res) => {
        navigate(`/translation-tables/${res?.data[0]?.id}/translations`);
      })
      .catch((err) => {
        throw new Error("GET translation error: " + err);
      });
  };

  return (
    <>
      <Card
        title={"Translation tables"}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#translationHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Translation Documentation"
                id="translationHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <a className="utrecht-link">
                <i className="fas fa-sync-alt mr-1" />
                <span className="mr-2">Refresh</span>
              </a>
              <Link to="/translation-tables/new">
                <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                  <i className="fas fa-plus mr-2" />
                  Create
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
                            <a
                              className="utrecht-link d-flex justify-content-end"
                              onClick={() => linkToTableWithTranslation(tables.name)}
                            >
                              <button className="utrecht-button btn-sm btn-primary">
                                <i className="fas fa-eye pr-1" />
                                View
                              </button>
                            </a>
                          );
                        },
                      },
                    ]}
                    rows={tableNames}
                  />
                ) : (
                  <Table
                    columns={[
                      {
                        headerName: "Tables",
                        field: "name",
                      },
                    ]}
                    rows={[{ name: "No results found" }]}
                  />
                )}
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
