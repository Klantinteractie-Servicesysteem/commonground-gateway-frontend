import * as React from "react";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link, navigate } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

export default function TranslationTable({ tableName }) {
  const [translations, setTranslations] = React.useState<Array<any>>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    getTranslations();
  }, [API]);

  const handleSetDocumentation = (): void => {
    API.Documentation.get("translations")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });

        throw new Error("GET Documentation error: " + err);
      });
  };

  const getTranslations = () => {
    setShowSpinner(true);
    API.Translation.getAllFrom(tableName)
      .then((res) => {
        setTranslations(res.data);
      })
      .catch((err) => {
        throw new Error("GET translations error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleDeleteTranslation = (id): void => {
    if (translations.length === 1 ? confirm(`Do you want to delete this translation? With id ${id}. If you delete this translation you wil also delete the Translation Table.`) 
    :  confirm(`Do you want to delete this translation? With id ${id}`)) {
      setLoadingOverlay(true);
      API.Translation.delete(id)
        .then(() => {
          setAlert({ message: `Deleted translation with id: ${id}`, type: "success" });
          translations.length === 1 && navigate("/translation-tables")// removed the last translation table
          getTranslations();
        })
        .catch((err) => {
          setAlert({ message: err, type: "danger" });
          throw new Error("DELETE translation error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        })
    }
  };

  return (
    <Card
      title={"Translations"}
      cardHeader={function () {
        return (
          <div>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#translationHelpModal"
              onClick={(e) => e.preventDefault()}
            >
              <Modal
                title="Translation Documentation"
                id="translationHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getTranslations}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link className="utrecht-link" to={"/translation-tables"}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />
                Back
              </button>
            </Link>
            {translations && (
              <Link to={`/translation-tables/${translations[0].id}/translations/new`}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                  <i className="fas fa-plus mr-2" />
                  Create
                </button>
              </Link>
            )}
          </div>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : translations ? (
                <>
                {loadingOverlay && <LoadingOverlay />}
                <Table
                  columns={[
                    {
                      headerName: "Translate From",
                      field: "translateFrom",
                    },
                    {
                      headerName: "Translate To",
                      field: "translateTo",
                    },
                    {
                      headerName: "Language",
                      field: "language",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string; translationTable: string }) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            <button
                              onClick={() => handleDeleteTranslation(item.id)}
                              className="utrecht-button btn-sm btn-danger mr-2"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/translation-tables/${item.id}/translations/${item.id}`}
                            >
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={translations}
                />
                </>
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Translate from",
                      field: "translateFrom",
                    },
                    {
                      headerName: "Translate to",
                      field: "translateTo",
                    },
                    {
                      headerName: "Language",
                      field: "language",
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
  );
}
