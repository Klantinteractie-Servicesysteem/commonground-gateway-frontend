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

interface TranslationFormProps {
  id: string,
}
export const TranslationForm:React.FC<TranslationFormProps> = ({ id }) => {

  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<any>(null);
  const [translation, setTranslation] = React.useState<any>(null);
  const title:string = (id === "new") ? "Create Translation" : "Edit Translation"

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      if (id !== 'new') {
        getTranslation();
      }
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

  const saveTranslation = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let body = {
      translationTable: event.target.translationTable ? event.target.translationTable.value : null,
      language: event.target.language ? event.target.language.value : null,
      translateFrom: event.target.translateFrom ? event.target.translateFrom.value : null,
      translateTo: event.target.translateTo ? event.target.translateTo.value : null,
    };

    let url = `${context.adminUrl}/translations`;
    let method = "POST";
    if (id !== "new") {
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
        setTranslation(data);
        method === 'POST' && navigate(`/translations`)
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error(error);
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
        <Card title={title}
          cardHeader={function () {
            return (
              <div>
              <Link className="utrecht-link" to={"/translations"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />Back
                </button>
              </Link>
              <button
                className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                type="submit"
              >
                <i className="fas fa-save mr-2" />Save
              </button>
            </div>)
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
                              required />
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
                              required />
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
                              required />
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
  export default TranslationForm
