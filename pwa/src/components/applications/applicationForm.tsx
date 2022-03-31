import * as React from "react";
import {
  GenericInputComponent,
  TextareaGroup,
  Spinner,
  Card,
  Accordion,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsOArrayWithName,
} from "../utility/inputHandler";
import ElementCreationNew from "../common/elementCreationNew";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { HeaderContext } from "../../context/headerContext";
import { AlertContext } from "../../context/alertContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import MultiSelect from "../common/multiSelect";
import { useQuery } from "react-query";

interface IApplication {
  name: string;
  description: string;
  public: string;
  secret: string;
  resource: string;
  domains: Array<string>;
  endpoints: any;
}

interface ApplicationFormProps {
  id?: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ id }) => {
  const [application, setApplication] = React.useState<IApplication>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = id ? "Edit Application" : "Create Application";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const getEndpointsSelectQuery = useQuery<any[], Error>("endpoints-select", API.Endpoint.getSelect, {
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
  });

  React.useEffect(() => {
    setHeader(
      <>
        Application <i>{application && application.name}</i>
      </>,
    );
  }, [setHeader, application]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    id && handleSetApplications();
  }, [API, id]);

  const handleSetApplications = () => {
    setShowSpinner(true);

    API.Application.getOne(id)
      .then((res) => {
        res.data.endpoints = res.data.endpoints.map((endpoint) => {
          return { name: endpoint.name, id: endpoint.name, value: `/admin/endpoints/${endpoint.id}` };
        });
        setApplication(res.data);
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

  const saveApplication = (event) => {
    event.preventDefault();
    setLoadingOverlay({ isLoading: true });

    let domains = retrieveFormArrayAsOArray(event.target, "domains");
    let endpoints = retrieveFormArrayAsOArrayWithName(event.target, "endpoints");

    let body: any = {
      name: event.target.name.value,
      description: event.target.description ? event.target.description.value : null,
      public: event.target.public.value ? event.target.public.value : null,
      secret: event.target.secret.value ? event.target.secret.value : null,
      resource: event.target.resource.value ? event.target.resource.value : null,
      domains,
      endpoints,
    };

    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name, body.domains])) {
      setAlert({ type: "danger", message: "Required fields are empty" });
      setLoadingOverlay({ isLoading: false });
      return;
    }

    API.Application.createOrUpdate(body, id)
      .then(() => {
        setAlert({ message: `${id ? "Updated" : "Created"} application`, type: "success" });
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

  return (
    <form id="applicationForm" onSubmit={saveApplication}>
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
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={application && application.name && application.name}
                          nameOverride={"Name"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"resource"}
                          id={"resourceInput"}
                          data={application && application.resource && application.resource}
                          nameOverride={"Resource"}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"public"}
                          id={"publicInput"}
                          data={application && application.public && application.public}
                          nameOverride={"Public"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"secret"}
                          id={"secretInput"}
                          data={application && application.secret && application.secret}
                          nameOverride={"Secret"}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <TextareaGroup
                          label="Description"
                          name="description"
                          id="descriptionInput"
                          defaultValue={application?.description}
                        />
                      </div>
                    </div>
                    <Accordion
                      id="applicationAccordion"
                      items={[
                        {
                          title: "Domains *",
                          id: "domainsAccordion",
                          render: function () {
                            return <ElementCreationNew id="domains" label="Domains" data={application?.domains} />;
                          },
                        },
                        {
                          title: "Endpoints",
                          id: "endpointsAccordion",
                          render: function () {
                            return getEndpointsSelectQuery.isSuccess ? (
                              <MultiSelect
                                id=""
                                label="endpoints"
                                data={application?.endpoints}
                                options={getEndpointsSelectQuery.data}
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
