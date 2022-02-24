import * as React from "react";
import {
  GenericInputComponent,
  Card,
  Spinner
}
  from "@conductionnl/nl-design-system/lib";
import { Link, navigate } from "gatsby";
import LoadingOverlay from "../../loadingOverlay/loadingOverlay";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";
import { TransForm } from "../translationForm";
import "./translationTableForm.css";

interface TranslationTableFormProps {
  tableName?: string
}

export const TranslationTableForm: React.FC<TranslationTableFormProps> = ({ tableName }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [translation, setTranslation] = React.useState<any>(null);
  const title: string = 'Create table';
  const API: APIService = React.useContext(APIContext);

  const saveTranslation = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body = {
      translationTable: event.target.translationTable ? event.target.translationTable.value : null,
      language: event.target.language ? event.target.language.value : null,
      translateFrom: event.target.translateFrom ? event.target.translateFrom.value : null,
      translateTo: event.target.translateTo ? event.target.translateTo.value : null,
    };

    API.Translation.create(body)
      .then((res) => { setTranslation(res.data); })
      .catch((err) => { throw new Error('Save translation table error: ' + err) })
      .finally(() => {
        setShowSpinner(false);
        setLoadingOverlay(false);
        navigate('/translation-tables');
      });
  }

  return (
    <>
      <form id="dataForm" onSubmit={saveTranslation}>
        <Card
          title={title}
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
                <Link className="utrecht-link" to={`/translation-tables`}>
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
                      {loadingOverlay && <LoadingOverlay />}
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <GenericInputComponent
                              type={"text"}
                              name={"translationTable"}
                              id={"translationTableInput"}
                              data={translation && translation.translationTable && translation.translationTable}
                              nameOverride={"Name"}
                              required />
                          </div>
                        </div>
                      </div>

                      <hr />
                      <h5 className="utrecht-heading-5 utrecht-heading-5--distanced TranslationTableForm-h5 mb-3">You need to create at least one translation when creating a new table</h5>

                      <TransForm translation={translation} />
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
export default TranslationTableForm;
