import * as React from "react";
import {
  GenericInputComponent,
  Card,
  Alert
}
  from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import Spinner from "../common/spinner";
import FlashMessage from 'react-flash-message';

export default function TranslationForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  const [translation, setTranslation] = React.useState(null);
  const [sources, setSources] = React.useState(null);
  const [soaps, setSoaps] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      if (id !== 'new') {
        getTranslation();
      }
      getSources();
      getSoaps();
    }
  }, [context]);

  const getTranslation = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/translations/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data.id !== undefined) {
          setTranslation(data);
        } else if (data['hydra:description'] !== undefined) {
          setAlert(null);
          setAlert({ type: 'danger', message: data['hydra:description'] });
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const getSources = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/gateways`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setSources(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const getSoaps = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/soaps`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setSoaps(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  }

  const saveTranslation = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let body = {
      translationTable: event.target.translationTable ? event.target.translationTable.value : null,
      language: event.target.language ? event.target.language.value : null,
      translateFrom: event.target.translateFrom ? event.target.translateFrom.value : null,
      translateTo: event.target.translateTo ? event.target.translateTo.value : null,
    };

    let url = context.adminUrl + "/translations";
    let method = null;
    if (id === "new") {
      method = "POST";
    } else {
      url = `${url}/${id}`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data.id !== undefined) {
          setTranslation(data);
          navigate(`/translations`);
        } else if (data['hydra:description'] !== undefined) {
          setAlert(null);
          setAlert({ type: 'danger', message: data['hydra:description'] });
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  }

  return (<>
    {
      alert !== null &&
      <FlashMessage duration={5000}>
        <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
      </FlashMessage>
    }
    <form id="dataForm" onSubmit={saveTranslation}>
      <Card title="Values"
        cardHeader={function () {
          return (<>
            <Link className="utrecht-link" to={"/translations"}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />Back
              </button>
            </Link>
            <button
              className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
              type="submit"
            >
              <i className="fas fa-save mr-2" />Save
            </button>
          </>)
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner === true ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"translationTable"}
                            id={"translationTableInput"}
                            data={translation && translation.translationTable && translation.translationTable}
                            nameOverride={"Table"}
                            required={true} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"language"}
                            id={"languageInput"}
                            data={translation && translation.language && translation.language}
                            nameOverride={"Language"} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"translateFrom"}
                            id={"translateFromInput"}
                            data={translation && translation.translateFrom && translation.translateFrom}
                            nameOverride={"From"}
                            required={true} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"translateTo"}
                            id={"translateToInput"}
                            data={translation && translation.translateTo && translation.translateTo}
                            nameOverride={"To"}
                            required={true} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        }} />
    </form></>
  );
}
