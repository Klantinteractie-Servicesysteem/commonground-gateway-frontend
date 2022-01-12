import * as React from "react";
import { Table, Card, Spinner, Alert } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import FlashMessage from 'react-flash-message';

export default function TranslationsTable() {
  const [translations, setTranslations] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

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
    fetch(`${context.adminUrl}/translations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setTranslations(data["hydra:member"]);
        }
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
        <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
      </FlashMessage>
    }
    <Card
      title={"Translations"}
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
            <a className="utrecht-link" onClick={getTranslations}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/translations/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Add
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
                    ) : translations ? (
                      <Table
                        columns={[
                          {
                            headerName: "Table",
                            field: "translationTable",
                          },
                          {
                            headerName: "From",
                            field: "translateFrom",
                          },
                          {
                            headerName: "To",
                            field: "translateTo",
                          },
                          {
                            headerName: "Language",
                            field: "language",
                          },
                          {
                            field: "id",
                            headerName: "Edit ",
                            renderCell: (item) => {
                              return (
                                <Link to={`/translations/${item.id}`}>
                                  <button className="utrecht-button btn-sm btn-success">
                                    <i className="fas fa-edit pr-1" />
                                    Edit
                                  </button>
                                </Link>
                              );
                            },
                          },
                        ]}
                        rows={translations}
                      />
                    ) : (
                      <Table
                        columns={[
                          {
                            headerName: "Name",
                            field: "name",
                          },
                          {
                            headerName: "Table",
                            field: "translationTable",
                          },
                          {
                            headerName: "From",
                            field: "translateFrom",
                          },
                          {
                            headerName: "To",
                            field: "translateTo",
                          },
                          {
                            headerName: "Language",
                            field: "language",
                          }
                        ]}
                        rows={[{name: 'No results found'}]}
                      />
                    )}
                  </div>
                </div>
              );}}
      />
  </>
  )
}
