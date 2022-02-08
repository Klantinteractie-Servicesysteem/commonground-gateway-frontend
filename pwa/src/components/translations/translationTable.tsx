import * as React from "react";
import {Table, Card, Spinner} from "@conductionnl/nl-design-system/lib";
import {isLoggedIn} from "../../services/auth";
import {Link} from "gatsby";
import {AlertContext} from "../../context/alertContext";

export default function TranslationTable({id}) {
  const [translations, setTranslations] = React.useState<Array<any>>(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [_, setAlert] = React.useContext(AlertContext)

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
    fetch(`${context.adminUrl}/translations?translationTable=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setTranslations(data["hydra:member"])
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert({type: 'danger', message: error.message});
      });
  };

  return (
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
              <i className="fas fa-question mr-1"/>
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getTranslations}>
              <i className="fas fa-sync-alt mr-1"/>
              <span className="mr-2">Refresh</span>
            </a>
            <Link className="utrecht-link" to={"/translations"}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2"/>Back
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
                <Spinner/>
              ) : translations ? (
                <Table
                  columns={[
                    {
                      headerName: "Translation Table",
                      field: "translationTable",
                    },
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
                    }
                  ]}
                  rows={translations}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Translation Table",
                      field: "translationTable",
                    },
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
                    }
                  ]}
                  rows={[{name: 'No results found'}]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  )
}
