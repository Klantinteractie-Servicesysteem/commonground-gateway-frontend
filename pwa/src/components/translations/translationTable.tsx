import * as React from "react";
import {
  Table,
  Card,
  Spinner,
  Alert,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import FlashMessage from "react-flash-message";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export default function TranslationTable({ tableName }) {
  const [translations, setTranslations] = React.useState<Array<any>>(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState(null);
  const [documentation, setDocumentation] = React.useState<string>(null)
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetDocumentation() // we added this
  }, [API, id])

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error("GET Documentation error: " + err);
      });
  };

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getTranslations(context);
    }
  }, [context]);

  const getTranslations = (context) => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/translations?translationTable=${tableName}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setTranslations(data["hydra:member"]);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  return (<>
    {
      alert !== null &&
      <FlashMessage duration={5000}>
        <Alert alertClass={alert.type} body={function () {
          return (<>{alert.message}</>)
        }} />
      </FlashMessage>
    }
    <Card
      title={"Translations"}
      cardHeader={function () {
        return (
          <div>
            <button
              className="utrecht-link button-no-style"
              data-toggle="modal"
              data-target="helpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getTranslations}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link className="utrecht-link" to={"/translation-tables"}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />Back
              </button>
            </Link>
              <Link to={`/translation-tables/${tableName}/translations/new`}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                  <i className="fas fa-plus mr-2"/>
                  Create new
                </button>
              </Link>
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
                      renderCell: (item: { id: string, translationTable: string }) => {
                        return (
                          <Link className="utrecht-link d-flex justify-content-end" to={`/translation-tables/${item.translationTable}/translations/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-primary">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    }
                  ]}
                  rows={translations}
                />
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
