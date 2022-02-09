import * as React from "react";
import {
  GenericInputComponent,
  Card,
  Spinner
}
  from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

interface TranslationFormProps {
  id: string,
}

export const TranslationForm: React.FC<TranslationFormProps> = ({ id }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [translation, setTranslation] = React.useState<any>(null);
  const title: string = (id === "new") ? "Create Translation" : "Edit Translation"
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => { id !== 'new' && getTranslation(id) }, [API]);

  const getTranslation = (id: string) => {
    // Hotfix
    if (id.length !== 36) {
      return;
    }
    setShowSpinner(true);
    API.Translation.getOne(id)
      .then((res) => { setTranslation(res.data) })
      .catch((err) => { throw new Error('GET translation error: ' + err) })
      .finally(() => { setShowSpinner(false) });
  };

  const saveTranslation = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body = {
      translationTable: event.target.translationTable ? event.target.translationTable.value : null,
      language: event.target.language ? event.target.language.value : null,
      translateFrom: event.target.translateFrom ? event.target.translateFrom.value : null,
      translateTo: event.target.translateTo ? event.target.translateTo.value : null,
    };

    if (!id || id === 'new') {
      API.Translation.create(body)
        .then((res) => { setTranslation(res.data); console.log(res) })
        .catch((err) => { throw new Error('GET translation error: ' + err) })
        .finally(() => {
          setShowSpinner(false);
          setLoadingOverlay(false);
        });
    }

    if (id !== 'new') {
      API.Translation.update(body, id)
        .then((res) => { setTranslation(res.data); console.log(res) })
        .catch((err) => { throw new Error('GET translation error: ' + err) })
        .finally(() => {
          setShowSpinner(false);
          setLoadingOverlay(false);
        });
    }
  }

  return (
    <>
      <form id="dataForm" onSubmit={saveTranslation}>
        <Card
          title={title}
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
                      {loadingOverlay && <LoadingOverlay />}
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
      </form>
    </>
  );
}
export default TranslationForm
