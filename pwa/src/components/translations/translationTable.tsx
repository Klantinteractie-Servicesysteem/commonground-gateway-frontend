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

export default function TranslationTable({ id }) {
  const [translations, setTranslations] = React.useState<Array<any>>(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    handleSetDocumentation(); // we added this
    setHeader({ title: "Translations", subText: "An overview of your translation objects" });
  }, [API, id]);

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
    fetch(`${context.adminUrl}/translations?translationTable=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt")
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setTranslations(data["hydra:member"]);
      })
      .catch((error) => {
        setShowSpinner(false);
        setAlert({ type: "danger", message: error.message });
        throw new Error("GET Translations error: " + error);
      });
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
            <a className="utrecht-link" onClick={getTranslations}>
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
