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
  retrieveFormArrayAsObject, retrieveFormObjectAsArray
} from "../utility/inputHandler";
import ElementCreationNew from "../common/elementCreationNew";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { HeaderContext } from "../../context/headerContext";
import { AlertContext } from "../../context/alertContext";
import MultiSelect from "../common/multiSelect";
import ObjectMultiSelect from "../common/objectMultiSelect";

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
  const [endpoints, setEndpoints] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = id ? "Edit Application" : "Create Application";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({
      title: "Applications",
      subText: "Manage your applications here",
    });
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    id && handleSetApplications();
    handleSetEndpoints();
  }, [API, id]);

  const handleSetApplications = () => {
    setShowSpinner(true);

    API.Application.getOne(id)
      .then((res) => {
        console.log("application", application)
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

  const handleSetEndpoints = () => {
    API.Endpoint.getAll()
      .then((res) => {
        setEndpoints(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET endpoints error: " + err);
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
    setLoadingOverlay(true);

    let domains = retrieveFormArrayAsOArray(event.target, "domains");
    let endpoints = retrieveFormArrayAsOArray(event.target, "endpoints");

    // console.log("endpoints", endpoints)
    // console.log("domains", domains)

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description ? event.target.description.value : null,
      public: event.target.public.value ? event.target.public.value : null,
      secret: event.target.secret.value ? event.target.secret.value : null,
      resource: event.target.resource.value ? event.target.resource.value : null,
      domains,
      endpoints
    };

    body = removeEmptyObjectValues(body);

    console.log("body", body)

    if (!checkValues([body["name"], body["domains"]])) {
      setAlert({ type: "danger", message: "Required fields are empty" });
      setLoadingOverlay(false);
      return;
    }

    if (!id) {
      // unset id means we're creating a new entry
      API.Application.create(body)
        .then(() => {
          setAlert({ message: "Saved application", type: "success" });
          navigate("/applications");
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Create application error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }

    if (id) {
      // set id means we're updating a existing entry
      API.Application.update(body, id)
        .then((res) => {
          setAlert({ message: "Updated application", type: "success" });
          setApplication(res.data);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Update application error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }
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
                <Modal
                  title="Application Documentation"
                  id="applicationHelpModal"
                  body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
                />
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
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
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row">
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
                    <div className="row">
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
                    <div className="row">
                      <div className="col-12">
                        <TextareaGroup
                          name={"description"}
                          id={"descriptionInput"}
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
                            console.log(endpoints)
                           const _endpoints = endpoints?.map((endpoint) => {
                             return { name: endpoint.name, id: endpoint.name, value: `/admin/endpoints/${endpoint.id}` }
                           })
                            const _data = application?.endpoints.map((endpoint) => {
                              return { name: endpoint.name, id: endpoint.name, value: `/admin/endpoints/${endpoint.id}` }
                            })
                            console.log({_data})
                            console.log({ _endpoints })
                            return endpoints ? (
                              <MultiSelect
                                id="endpoints"
                                label="endpoints"
                                data={_data}
                                options={_endpoints}
                              />
                            ) : (
                              <>
                                <Spinner />
                              </>
                            );
                          }
                        }
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
