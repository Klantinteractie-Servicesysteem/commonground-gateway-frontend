import * as React from "react";
import "./translationTableForm.css";
import { Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link, navigate } from "gatsby";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";
import { AlertContext } from "../../../context/alertContext";
import { LoadingOverlayContext } from "../../../context/loadingOverlayContext";
import { TranslationFormFields } from "../translationForm";

import { useForm } from "react-hook-form";
import { InputText } from "../../formFields";

interface TranslationTableFormProps {
  tableName?: string;
}

export const TranslationTableForm: React.FC<TranslationTableFormProps> = ({ tableName }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const title: string = "Create table";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data): void => {
    setLoadingOverlay({ isLoading: true });

    data.language = data.language && data.language.value;

    API.Translation.createOrUpdate(data)
      .then(() => {
        setAlert({ message: "Created translation table", type: "success" });
      })
      .catch((err) => {
        setAlert({ message: `Error creating translation table: ${err}`, type: "danger" });
        throw new Error("Save translation table error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
        setLoadingOverlay({ isLoading: false });
        navigate("/translation-tables");
      });
  };

  React.useEffect(() => {
    handleSetDocumentation();
  });

  const handleSetDocumentation = (): void => {
    API.Documentation.get("translations")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card
          title={title}
          cardHeader={function () {
            return (
              <>
                <button
                  className="utrecht-link button-no-style"
                  data-bs-toggle="modal"
                  data-bs-target="#translationHelpModal"
                  type="button"
                >
                  <i className="fas fa-question mr-1" />
                  <span className="mr-2">Help</span>
                </button>
                <Modal
                  title="Translation Documentation"
                  id="translationHelpModal"
                  body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
                />
                <Link className="utrecht-link" to={`/translation-tables`}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2" />
                    Back
                  </button>
                </Link>
                <button className="utrecht-button utrec`ht-button-sm btn-sm btn-success" type="submit">
                  <i className="fas fa-save mr-2" />
                  Save
                </button>
              </>
            );
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
                        <div className="col-12">
                          <div className="form-group">
                            <InputText
                              name="translationTable"
                              label="Table name"
                              {...{ errors, register }}
                              validation={{ maxLength: 255, required: true }}
                            />
                          </div>
                        </div>
                      </div>

                      <span className="TranslationTableForm-dividerHeading">
                        Add your first translation to this table
                        <span className="subtitle">
                          You need to create at least one translation when creating a new table
                        </span>
                      </span>

                      <TranslationFormFields {...{ errors, register, control }} />
                    </>
                  )}
                </div>
              </div>
            );
          }}
        />
      </form>
    </>
  );
};
export default TranslationTableForm;
