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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function TranslationTable({ tableName }) {
  const [translations, setTranslations] = React.useState<Array<any>>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({ title: "Translations", subText: "An overview of your translation objects" });
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation(); // we added this
  });

  React.useEffect(() => {
    handleSetTranslation()
  }, [API]);

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });

        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleSetTranslation = () => {
    setShowSpinner(true);
    API.Translation.getAllWithTableName(tableName)
      .then((res) => {
        setTranslations(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET translations from entity error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleDeleteTranslation = (id): void => {
    if (confirm(`Do you want to delete this translation? With id ${id}`)) {
      API.Endpoint.delete(id)
        .then(() => {
          setAlert({ message: `Deleted translation with id: ${id}`, type: "success" });
          handleSetTranslation();
        })
        .catch((err) => {
          setAlert({ message: err, type: "danger" });
          throw new Error("DELETE translation error: " + err);
        });
    }
  };

  return (
    <Card
      title={"Translations"}
      cardHeader={function() {
        return (
          <div>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#helpModal"
            >
              <Modal
                title="Translation Documentation"
                id="helpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetTranslation}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link className="utrecht-link" to={"/translations"}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />
                Back
              </button>
            </Link>
          </div>
        );
      }}
      cardBody={function() {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : translations ? (
                <Table
                  columns={[
                    {
                      headerName: "Translation Table",
                      field: "translationTable"
                    },
                    {
                      headerName: "Translate From",
                      field: "translateFrom"
                    },
                    {
                      headerName: "Translate To",
                      field: "translateTo"
                    },
                    {
                      headerName: "Language",
                      field: "language"
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            <button onClick={() => handleDeleteTranslation(item.id)}
                                    className="utrecht-button btn-sm btn-danger mr-2">
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                          </div>
                        );
                      }
                    }
                  ]}
                  rows={translations}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Translation Table",
                      field: "translationTable"
                    },
                    {
                      headerName: "Translate From",
                      field: "translateFrom"
                    },
                    {
                      headerName: "Translate To",
                      field: "translateTo"
                    },
                    {
                      headerName: "Language",
                      field: "language"
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
