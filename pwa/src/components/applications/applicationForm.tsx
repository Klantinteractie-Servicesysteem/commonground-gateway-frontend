import * as React from "react";
import { Spinner, Card, Accordion, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import ElementCreationNew from "../common/elementCreationNew";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { HeaderContext } from "../../context/headerContext";
import { AlertContext } from "../../context/alertContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { InputText, SelectMultiple, Textarea } from "../formFields";

interface ApplicationFormProps {
  applicationId?: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ applicationId }) => {
  const [endpoints, setEndpoints] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const title: string = applicationId ? "Edit Application" : "Create Application";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  /**
   * Form fields and logic
   */
  const fields = ["name", "resource", "public", "secret", "description", "endpoints"];

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  const onSubmit = (data): void => {
    data.endpoints = data.endpoints?.map((endpoints) => endpoints.value);
    createOrEditApplication.mutate({ payload: data, id: applicationId });
  };

  /**
   * Queries and mutations
   */
  const queryClient = useQueryClient();

  const getApplication = useQuery<any, Error>(
    ["Applications", applicationId],
    () => API.Endpoint.getOne(applicationId),
    {
      initialData: () =>
        queryClient.getQueryData<any[]>("Applications")?.find((application) => application.id === applicationId),
      onError: (error) => {
        setAlert({ message: error.message, type: "danger" });
      },
      enabled: !!applicationId,
    },
  );

  const createOrEditApplication = useMutation<any, Error, any>(API.Application.createOrUpdate, {
    onMutate: () => {
      setLoadingOverlay(true);
    },
    onSuccess: async (newApplication) => {
      const previousApplications = queryClient.getQueryData<any[]>("applications");
      await queryClient.cancelQueries("applications");

      if (applicationId) {
        const index = previousApplications.findIndex((application) => application.id === applicationId);
        previousApplications[index] = newApplication;
        queryClient.setQueryData("applications", previousApplications);
        queryClient.setQueryData(["applications", applicationId], newApplication);
      }

      if (!applicationId) {
        queryClient.setQueryData("applications", [newApplication, ...previousApplications]);
        queryClient.setQueryData(["applications", newApplication.id], newApplication);
      }

      queryClient.invalidateQueries("applications");
      setAlert({ message: `${applicationId ? "Updated" : "Created"} application`, type: "success" });
      navigate("/applications");
    },
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    onSettled: () => {
      setLoadingOverlay(false);
    },
  });

  /**
   * Effects
   */
  React.useEffect(() => {
    setHeader("Endpoint");

    if (getApplication.isSuccess) {
      setHeader(
        <>
          Application: <i>{getApplication.data.name}</i>
        </>,
      );

      fields.map((field) => {
        setValue(field, getApplication.data[field]);
      });
    }
  }, [getApplication.isSuccess]);

  React.useEffect(() => {
    handleSetEndpoints();
  }, [API, applicationId]);

  const handleSetEndpoints = () => {
    API.Endpoint.getAll()
      .then((res) => {
        const _endpoints = res.data?.map((endpoint) => {
          return { label: endpoint.name, value: `/admin/applications/${endpoint.id}` };
        });
        setEndpoints(_endpoints);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET endpoint error: " + err);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("endpoints")
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
            <div>
              <a
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#applicationHelpModal"
                onClick={!documentation && handleSetDocumentation}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </a>
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
            </div>
          );
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {getApplication.isLoading ? (
                  <Spinner />
                ) : (
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText label="Name" name="name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <InputText label="Resource" name="resource" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText label="Public" name="public" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputText label="Secret" name="secret" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <Textarea label="Description" name="description" {...{ register, errors }} />
                      </div>
                    </div>
                    <Accordion
                      id="applicationAccordion"
                      items={[
                        {
                          title: "Domains *",
                          id: "domainsAccordion",
                          render: function () {
                            return <ElementCreationNew id="domains" label="Domains" />;
                          },
                        },
                        {
                          title: "Endpoints",
                          id: "endpointsAccordion",
                          render: function () {
                            return endpoints ? (
                              <SelectMultiple
                                label="Endpoints"
                                name="endpoints"
                                options={endpoints}
                                {...{ control, register, errors }}
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
