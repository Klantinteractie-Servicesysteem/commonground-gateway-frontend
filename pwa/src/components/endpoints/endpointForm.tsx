import * as React from "react";
import { Spinner, Card, Modal, Accordion } from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useForm } from "react-hook-form";
import { InputText, Textarea, SelectMultiple } from "../formFields";

interface EndpointFormProps {
  endpointId: string;
}

export const EndpointForm: React.FC<EndpointFormProps> = ({ endpointId }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [applications, setApplications] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const title: string = endpointId ? "Edit Endpoint" : "Create Endpoint";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const fields = ["name", "path", "description", "applications"];

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm();

  React.useEffect(() => {
    handleSetApplications();
    endpointId && handleSetEndpoint();
  }, [API, endpointId]);

  const handleSetEndpoint = () => {
    setShowSpinner(true);

    API.Endpoint.getOne(endpointId)
      .then((res) => {
        setHeader(res.data.name);

        const endpoint = res.data;

        endpoint.applications = res.data.applications.map((endpoint) => {
          return { label: endpoint.name, value: `/admin/applications/${endpoint.id}` };
        });

        fields.map((field) => {
          setValue(field, endpoint[field]);
        });
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET endpoints error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetApplications = () => {
    API.Application.getAll()
      .then((res) => {
        const _applications = res.data?.map((application) => {
          return { label: application.name, value: `/admin/applications/${application.id}` };
        });
        setApplications(_applications);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET application error: " + err);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("endpoints")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const onSubmit = (data): void => {
    setLoadingOverlay(true);

    data.applications = data.applications.map((application) => application.value);

    API.Endpoint.createOrUpdate(data, endpointId)
      .then(() => {
        setAlert({ message: `${endpointId ? "Updated" : "Created"} endpoint`, type: "success" });
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", type: "danger", message: err.message });
        throw new Error(`Create or update endpoint error: ${err}`);
      })
      .finally(() => {
        navigate("/endpoints");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <div>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#endpointHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Endpoint Documentation"
                id="endpointHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <Link className="utrecht-link" to={"/endpoints"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button
                className="utrecht-button utrecht-button-sm btn-sm btn-success"
                type="submit"
                disabled={!setApplications}
              >
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
                {showSpinner === true ? (
                  <Spinner />
                ) : (
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText label="Name" name="name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <InputText label="Path" name="path" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <Textarea label="Description" name="description" {...{ register, errors }} />
                      </div>
                    </div>
                    <Accordion
                      id="endpointAccordion"
                      items={[
                        {
                          title: "Applications",
                          id: "applicationsAccordion",
                          render: function () {
                            return applications ? (
                              <SelectMultiple
                                label="Applications"
                                name="applications"
                                options={applications}
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
export default EndpointForm;
