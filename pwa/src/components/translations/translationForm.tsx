import * as React from "react";
import {
  GenericInputComponent,
  Card,
  Modal,
  SelectInputComponent,
  Spinner
}
  from "@conductionnl/nl-design-system/lib";
import { Link, navigate } from "gatsby";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { checkValues, removeEmptyObjectValues } from "../utility/inputHandler";

interface TranslationFormProps {
  id?: string,
  tableName?: string
}

export const TranslationForm: React.FC<TranslationFormProps> = ({ id, tableName }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [translation, setTranslation] = React.useState<any>(null);
  const title: string = tableName ? "Edit Translation" : "Create Translation";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    id && getTranslation(id)
  }, [API]);

  const getTranslation = (id: string) => {
    setShowSpinner(true);
    API.Translation.getOne(id)
      .then((res) => {
        setTranslation(res.data)
      })
      .catch((err) => { throw new Error('GET translation error: ' + err) })
      .finally(() => { setShowSpinner(false) });
  };

  const saveTranslation = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body = {
      translationTable: tableName,
      language: event.target.language ? event.target.language.value : null,
      translateFrom: event.target.translateFrom ? event.target.translateFrom.value : null,
      translateTo: event.target.translateTo ? event.target.translateTo.value : null
    };

    if (!id) {
      API.Translation.create(body)
        .then((res) => { setTranslation(res.data); })
        .catch((err) => { throw new Error('GET translation error: ' + err) })
        .finally(() => {
          setShowSpinner(false);
          setLoadingOverlay(false);
          navigate(`/translation-tables/${tableName}/translations`);
        });
    }

    if (id) {
      API.Translation.update(body, id)
        .then((res) => { setTranslation(res.data); })
        .catch((err) => { throw new Error('GET translation error: ' + err) })
        .finally(() => {
          setShowSpinner(false);
          setLoadingOverlay(false);
        });
    }
  }
  React.useEffect(() => {
    handleSetDocumentation();
  }, []);

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err });
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <>
      <form id="dataForm" onSubmit={saveTranslation}>
        <Card
          title={title}
          cardHeader={function () {
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
                <Link className="utrecht-link" to={`/translation-tables/${tableName}/translations`}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2" />Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrecht-button-sm btn-sm btn-success"
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
};
export default TranslationForm;

interface TransFormProps {
  translation: any
}

export const TransForm: React.FC<TransFormProps> = ({ translation }) => {
  return (
    <div className="row">
      <div className="col-4">
        <div className="form-group">
          <GenericInputComponent
            type={"text"}
            name={"translateFrom"}
            id={"translateFromInput"}
            data={translation?.translateFrom && translation.translateFrom}
            nameOverride={"From"}
            required />
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <GenericInputComponent
            type={"text"}
            name={"translateTo"}
            id={"translateToInput"}
            data={translation?.translateTo && translation.translateTo}
            nameOverride={"To"}
            required />
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <SelectInputComponent
            options={[
              { name: "Nederlands (NL)", value: 'nl_NL' },
              { name: "English (EN)", value: "en_EN" },
            ]}
            name={"language"}
            id={"languageInput"}
            nameOverride={"Language"}
            data={translation?.language} />
        </div>
      </div>
    </div>
  )
}
