import * as React from "react";
import { Link } from "gatsby";
import { Accordion, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useForm } from "react-hook-form";
import { ISelectValue } from "../formFields/types";
import { CreateArray, CreateKeyValue, InputText, SelectSingle, InputUrl } from "../formFields";
import { useQueryClient } from "react-query";
import { useSource } from "../../hooks/source";

interface SourceFormProps {
  sourceId: string;
}

export const SourceForm: React.FC<SourceFormProps> = ({ sourceId }) => {
  const API: APIService = React.useContext(APIContext);
  const title: string = sourceId ? "Edit Source" : "Create Source";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

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

  const queryClient = useQueryClient();

  const _useSource = useSource(queryClient);
  const getSource = _useSource.getOne(sourceId);
  const createOrEditSource = _useSource.createOrEdit(sourceId);

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    handleSetDocumentation();
  }, [setHeader]);

  const onSubmit = (data): void => {
    data.type = data.type && data.type.value;
    data.auth = data.auth && data.auth.value;

    createOrEditSource.mutate({ payload: data, id: sourceId });
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

  React.useEffect(() => {
    setHeader("Source");

    if (getSource.isSuccess) {
      const source = getSource.data;
      setHeader(
        <>
          Source: <i>{source.name}</i>
        </>,
      );

      handleSetFormValues(source);
    }
  }, [getSource.isSuccess]);

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
                {getSource.isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="name" label="Name" {...{ register, errors }} validation={{ maxLength: 255 }} />
                      </div>
                      <div className="col-6">
                        <InputUrl
                          name="location"
                          label="Location (URL)"
                          {...{ register, errors }}
                          validation={{ maxLength: 255, required: true }}
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
                          validation={{ maxLength: 255 }}
                        />
                      </div>
                      <div className="col-6">
                        <InputText
                          name="locale"
                          label="Locale"
                          {...{ register, errors }}
                          validation={{ maxLength: 10 }}
                        />
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
                        <InputText
                          name="apikey"
                          label="API Key"
                          {...{ register, errors }}
                          validation={{ maxLength: 255 }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputUrl
                          name="documentation"
                          label="Documentation (URL)"
                          {...{ register, errors }}
                          validation={{ maxLength: 255 }}
                        />
                      </div>
                      <div className="col-6">
                        <InputText
                          name="authorizationHeader"
                          label="Authorization Header"
                          {...{ register, errors }}
                          validation={{ maxLength: 255 }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText
                          name="username"
                          label="Username"
                          {...{ register, errors }}
                          validation={{ maxLength: 255 }}
                        />
                      </div>
                      <div className="col-6">
                        <InputText
                          name="password"
                          label="Password"
                          {...{ register, errors }}
                          validation={{ maxLength: 255 }}
                        />
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
                              {...{ control, errors }}
                            />
                          ),
                        },
                        {
                          title: "OAS",
                          id: "oasAccordion",
                          render: () => (
                            <CreateArray name="oas" label="OAS" data={getValues("oas")} {...{ control, errors }} />
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
                              {...{ control, errors }}
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
