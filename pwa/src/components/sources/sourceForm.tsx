import * as React from "react";
import { Link } from "gatsby";
import { Accordion, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import { navigate } from "gatsby-link";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { useForm } from "react-hook-form";
import { ISelectValue } from "../formFields/types";
import { CreateArray, CreateKeyValue, InputText, SelectSingle, InputUrl } from "../formFields";

interface SourceFormProps {
  sourceId: string;
}

export const SourceForm: React.FC<SourceFormProps> = ({ sourceId }) => {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = sourceId ? "Edit Source" : "Create Source";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const typeSelectOptions: ISelectValue[] = [
    { label: "JSON", value: "json" },
    { label: "SML", value: "xml" },
    { label: "SOAP", value: "soap" },
    { label: "FTP", value: "ftp" },
    { label: "SFTP", value: "sftp" },
  ];

  const authSelectOptions: ISelectValue[] = [
    { label: "API Key", value: "apikey" },
    { label: "JWT", value: "jwt" },
    { label: "Username and Password", value: "username-password" },
  ];

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    setHeader("Source");

    handleSetDocumentation();
    sourceId && handleSetSource();
  }, [sourceId, API, setHeader]);

  const onSubmit = (data): void => {
    setLoadingOverlay({ isLoading: true });

    data.type = data.type && data.type.value;
    data.auth = data.auth && data.auth.value;

    API.Source.createOrUpdate(data, sourceId)
      .then(() => {
        setAlert({ type: "success", message: `${sourceId ? "Updated" : "Created"} source` });
        navigate("/sources");
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error("Create or update source error: " + err);
      })
      .finally(() => {
        setLoadingOverlay({ isLoading: false });
      });
  };

  const handleSetFormValues = (source): void => {
    const basicFields: string[] = [
      "name",
      "location",
      "accept",
      "locale",
      "jwt",
      "jwtId",
      "secret",
      "apikey",
      "documentation",
      "authorizationHeader",
      "username",
      "password",
      "headers",
      "oas",
      "paths",
    ];
    basicFields.forEach((field) => setValue(field, source[field]));

    setValue(
      "type",
      typeSelectOptions.find((option) => source.type === option.value),
    );
    setValue(
      "auth",
      authSelectOptions.find((option) => source.auth === option.value),
    );
  };

  const handleSetSource = () => {
    setShowSpinner(true);

    API.Source.getOne(sourceId)
      .then((res) => {
        const source = res.data;

        setHeader(
          <>
            Source <i>{source && source.name}</i>
          </>,
        );

        handleSetFormValues(source);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET gateway error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };
  const handleSetDocumentation = (): void => {
    API.Documentation.get("sources")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#sourceHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Source Documentation"
                id="sourceHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <Link className="utrecht-link" to={"/sources"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button className="utrecht-button utrecht`ht-button-sm btn-sm btn-success" type="submit">
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
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="name" label="Name" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputUrl
                          name="location"
                          label="Location (URL)"
                          {...{ register, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectSingle
                          name="type"
                          label="Type"
                          options={typeSelectOptions}
                          {...{ control, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          name="auth"
                          label="Auth"
                          options={authSelectOptions}
                          {...{ control, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText
                          name="accept"
                          label="Accept (accept header used for this source)"
                          {...{ register, errors }}
                        />
                      </div>
                      <div className="col-6">
                        <InputText name="locale" label="Locale" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="jwt" label="JWT" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputText name="jwtId" label="JWT ID" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="secret" label="Secret" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputText name="apikey" label="API Key" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputUrl name="documentation" label="Documentation (URL)" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputText name="authorizationHeader" label="Authorization Header" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="username" label="Username" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputText name="password" label="Password" {...{ register, errors }} />
                      </div>
                    </div>
                    <Accordion
                      id="sourceAccordion"
                      items={[
                        {
                          title: "Headers",
                          id: "headersAccordion",
                          render: () => (
                            <CreateKeyValue
                              name="headers"
                              label="Headers"
                              data={getValues("headers")}
                              {...{ register, control, errors }}
                            />
                          ),
                        },
                        {
                          title: "OAS",
                          id: "oasAccordion",
                          render: () => (
                            <CreateArray
                              name="oas"
                              label="OAS"
                              data={getValues("oas")}
                              {...{ register, control, errors }}
                            />
                          ),
                        },
                        {
                          title: "Paths",
                          id: "pathsAccordion",
                          render: () => (
                            <CreateArray
                              name="paths"
                              label="Paths"
                              data={getValues("paths")}
                              {...{ register, control, errors }}
                            />
                          ),
                        },
                      ]}
                    />
                  </>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
};

export default SourceForm;
