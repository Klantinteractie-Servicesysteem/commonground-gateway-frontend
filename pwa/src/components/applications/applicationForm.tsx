import * as React from "react";
import { Spinner, Card, Accordion, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { HeaderContext } from "../../context/headerContext";
import { AlertContext } from "../../context/alertContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { CreateArray, InputText, SelectMultiple, Textarea } from "../formFields";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";

interface ApplicationFormProps {
  applicationId?: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ applicationId }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = applicationId ? "Edit Application" : "Create Application";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    control,
  } = useForm();

  const onSubmit = (data): void => {
    setLoadingOverlay({ isLoading: true });

    data.endpoints = data.endpoints?.map((endpoint) => endpoint.value);

    API.Application.createOrUpdate(data, applicationId)
      .then(() => {
        setAlert({ message: `${applicationId ? "Updated" : "Created"} application`, type: "success" });
        navigate("/applications");
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error(`Create or update application error ${err}`);
      })
      .finally(() => {
        setLoadingOverlay({ isLoading: false });
      });
  };

  const handleSetFormValues = (source): void => {
    const basicFields: string[] = ["name", "resource", "public", "secret", "description", "endpoints", "domains"];
    basicFields.forEach((field) => setValue(field, source[field]));
  };

  const getEndpointsSelectQuery = useQuery<any[], Error>("endpoints-select", API.Endpoint.getSelect, {
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
  });

  React.useEffect(() => {
    setHeader("Application");
    applicationId && handleSetApplication();
  }, [API, applicationId]);

  const handleSetApplication = () => {
    setShowSpinner(true);

    API.Application.getOne(applicationId)
      .then((res) => {
        const application = res.data;

        setHeader(
          <>
            Application <i>{application.name}</i>
          </>,
        );

        application.endpoints = resourceArrayToSelectArray(application.endpoints, "endpoints");
        handleSetFormValues(application);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET application error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("applications")
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
                data-bs-target="#applicationHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Application Documentation"
                id="applicationHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <Link className="utrecht-link" to={"/applications"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
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
                  <div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="name" label="Name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <InputText name="resource" label="Resource" {...{ register, errors }} />
                      </div>
                    </div>

                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="public" label="Public" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputText name="secret" label="Secret" {...{ register, errors }} />
                      </div>
                    </div>

                    <div className="row form-row">
                      <div className="col-6">
                        <Textarea name="description" label="Description" {...{ register, errors }} />
                      </div>
                    </div>

                    <Accordion
                      id="applicationAccordion"
                      items={[
                        {
                          title: "Domains",
                          id: "domainsAccordion",
                          render: () => (
                            <CreateArray
                              name="domains"
                              label="Domains"
                              data={getValues("domains")}
                              {...{ control, errors }}
                            />
                          ),
                        },
                        {
                          title: "Endpoints",
                          id: "endpointsAccordion",
                          render: function () {
                            return getEndpointsSelectQuery.isSuccess ? (
                              <SelectMultiple
                                name="endpoints"
                                label="Endpoints"
                                options={getEndpointsSelectQuery.data}
                                {...{ register, errors, control }}
                              />
                            ) : (
                              <Spinner />
                            );
                          },
                        },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
};

export default ApplicationForm;
