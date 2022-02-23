import * as React from "react";
import {
  GenericInputComponent,
  Card,
  Modal,
  SelectInputComponent
}
  from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import Spinner from "../common/spinner";
import { navigate } from "gatsby-link";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";

interface TranslationFormProps {
  id: string,
}

export const TranslationForm: React.FC<TranslationFormProps> = ({ id }) => {
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [translation, setTranslation] = React.useState<any>(null);
  const title: string = (id === "new") ? "Create Translation" : "Edit Translation";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({
      title: "Translation",
      subText: "Manage your translation here"
    });
  }, [setHeader])


  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL
      });
    }
  }, [context]);

  const saveTranslation = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let body = {
      translationTable: id,
      language: event.target.language ? event.target.language.value : null,
      translateFrom: event.target.translateFrom ? event.target.translateFrom.value : null,
      translateTo: event.target.translateTo ? event.target.translateTo.value : null
    };

    let url = `${context.adminUrl}/translations`;
    let method = "POST";

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + sessionStorage.getItem("jwt") },
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((data) => {
        setTranslation(data);
        !id && setAlert({ message: 'Saved translations', type: "success" });
        id && setAlert({ message: 'Updated translations', type: "success" });
        !id && navigate("/translations");
      })
      .catch((error) => {
        setAlert({ type: "danger", message: error.message });
        throw new Error("GET Translations error: " + error);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };
  React.useEffect(() => {
    handleSetDocumentation();
  });

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
    <form id="dataForm" onSubmit={saveTranslation}>
      <Card
        title={title}
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
              <Link className="utrecht-link" to={"/translations"}>
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
            </div>);
        }}
        cardBody={function() {
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
                          <SelectInputComponent
                            options={[
                              { name: "Nederlands (NL)", value: "nl_NL" },
                              { name: "English (EN)", value: "en_EN" }
                            ]}
                            name={"language"}
                            id={"languageInput"}
                            nameOverride={"Language"}
                            data={translation?.language} />
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
          );
        }} />
    </form>
  );
};
export default TranslationForm;
