import * as React from "react";
import { Card, Modal, Spinner } from "@conductionnl/nl-design-system/lib";
import { Link, navigate } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { Control, FieldErrors, FieldValues, useForm, UseFormRegister } from "react-hook-form";
import { InputText, SelectSingle } from "../formFields";
import { ISelectValue } from "../formFields/types";

interface TranslationFormProps {
  id?: string;
  tableName?: string;
}

export const TranslationForm: React.FC<TranslationFormProps> = ({ id, tableName }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const title: string = id ? "Edit Translation" : "Create Translation";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_tableName, setTableName] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data): void => {
    setLoadingOverlay({ isLoading: true });

    data.translationTable = _tableName;
    data.language = data.language && data.language.value;

    API.Translation.createOrUpdate(data, id)
      .then(() => {
        setAlert({ message: `${id ? "Updated" : "Created"} translation`, type: "success" });
      })
      .catch((err) => {
        setAlert({ message: `Error creating translation: ${err}`, type: "danger" });
        throw new Error("CREATE or UPDATE translation error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
        setLoadingOverlay({ isLoading: false });
        navigate(`/translation-tables/${tableName}/translations`);
      });
  };

  const handleSetFormValues = (translation): void => {
    const basicFields: string[] = ["translateFrom", "translateTo"];
    basicFields.forEach((field) => setValue(field, translation[field]));

    setValue(
      "language",
      languageSelectOptions.find((option) => translation.language === option.value),
    );
  };

  React.useEffect(() => {
    id && getTranslation(id);
    getTableName();
  }, [API]);

  const getTableName = () => {
    setShowSpinner(true);
    API.Translation.getOne(tableName)
      .then((res) => {
        setTableName(res.data.translationTable);
      })
      .catch((err) => {
        throw new Error("GET translation error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const getTranslation = (id: string) => {
    setShowSpinner(true);
    API.Translation.getOne(id)
      .then((res) => {
        handleSetFormValues(res.data);
      })
      .catch((err) => {
        throw new Error("GET translation error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
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
              <div>
                <button
                  className="utrecht-link button-no-style"
                  data-bs-toggle="modal"
                  data-bs-target="#translationHelpModal"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-question mr-1" />
                  <span className="mr-2">Help</span>
                </button>
                <Modal
                  title="Translation Documentation"
                  id="translationHelpModal"
                  body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
                />
                <Link className="utrecht-link" to={`/translation-tables/${tableName}/translations`}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2" />
                    Back
                  </button>
                </Link>
                <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
                  <i className="fas fa-save mr-2" />
                  Save
                </button>
              </div>
            );
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? <Spinner /> : <TranslationFormFields {...{ control, errors, register }} />}
                </div>
              </div>
            );
          }}
        />
      </form>
    </>
  );
};
export default TranslationForm;

interface TranslationFormFields {
  control: Control<FieldValues, any>;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

export const TranslationFormFields: React.FC<TranslationFormFields> = ({ register, errors, control }) => {
  return (
    <div className="row form-row">
      <div className="col-4">
        <div className="form-group">
          <InputText
            name="translateFrom"
            label="From"
            {...{ register, errors }}
            validation={{ maxLength: 255, required: true }}
          />
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <InputText
            name="translateTo"
            label="To"
            {...{ register, errors }}
            validation={{ maxLength: 255, required: true }}
          />
        </div>
      </div>
      <div className="col-4">
        <div className="form-group">
          <SelectSingle
            name="language"
            label="Langauge"
            options={languageSelectOptions}
            {...{ control, errors }}
            validation={{ required: true }}
          />
        </div>
      </div>
    </div>
  );
};

export const languageSelectOptions: ISelectValue[] = [
  { label: "Nederlands (NL)", value: "nl_NL" },
  { label: "English (EN)", value: "en_EN" },
];
