import * as React from "react";
import {
  GenericInputComponent,
  SelectInputComponent,
  TextareaGroup,
  Spinner,
  Card,
  Modal, Accordion
} from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import { checkValues, removeEmptyObjectValues, retrieveFormArrayAsOArray } from "../utility/inputHandler";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import ElementCreationNew from "../common/elementCreationNew";
import MultiSelect from "../common/multiSelect";

interface EndpointFormProps {
  endpointId: string;
}

export const EndpointForm: React.FC<EndpointFormProps> = ({ endpointId }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [endpoint, setEndpoint] = React.useState<any>(null);
  const [applicationOptions, setApplicationOptions] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const title: string = endpointId ? "Edit Endpoint" : "Create Endpoint";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({
      title: "Endpoint",
      subText: "Manage your endpoint here",
    });
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    handleSetApplications();
    endpointId && handleSetEndpoint();
  }, [API, endpointId]);

  const handleSetEndpoint = () => {
    setShowSpinner(true);

    API.Endpoint.getOne(endpointId)
      .then((res) => {
        console.log(res.data, "endpoint")
        setEndpoint(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET endpoints error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetApplications = () => {
    API.Application.getAll()
      .then((res) => {
        console.log(res.data, "app")
        setApplicationOptions(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET application error: " + err);
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

  const saveEndpoint = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let applications: any[] = retrieveFormArrayAsOArray(event.target, "applications");

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description.value ?? null,
      path: event.target.path.value,
      applications
    };

    console.log(body, "body")

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"], body["path"]])) {
      return;
    }

    if (!endpointId) {
      // unset id means we're creating a new entry
      API.Endpoint.create(body)
        .then(() => {
          setAlert({ message: "Saved endpoint", type: "success" });
          navigate(`/endpoints`);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Create endpoint error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }

    if (endpointId) {
      // set id means we're updating a existing entry
      API.Endpoint.update(body, endpointId)
        .then((res) => {
          setAlert({ message: "Updated endpoint", type: "success" });
          setEndpoint(res.data);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Update endpoint error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }
  };

  return (
    <form id="dataForm" onSubmit={saveEndpoint}>
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
                <Modal
                  title="Endpoint Documentation"
                  id="endpointHelpModal"
                  body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
                />
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Link className="utrecht-link" to={"/endpoints"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button
                className="utrecht-button utrecht-button-sm btn-sm btn-success"
                type="submit"
                disabled={!applicationOptions}
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
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={endpoint && endpoint.name && endpoint.name}
                          nameOverride={"Name"}
                        />
                      </div>
                      <div className="col-6">
                        <TextareaGroup
                          name={"description"}
                          id={"descriptionInput"}
                          defaultValue={endpoint?.description}
                        />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            nameOverride={"Path"}
                            name={"path"}
                            data={endpoint?.path}
                            type={"text"}
                            id={"pathInput"}
                            required={true}
                          />
                        </div>
                      </div>
                    </div>
                    <Accordion
                      id="endpointAccordion"
                      items={[
                        {
                          title: "Applications",
                          id: "applicationsAccordion",
                          render: function() {
                            return (
                              <>
                                <MultiSelect
                                  id="applications"
                                  label="Applications"
                                  data={endpoint?.applications}
                                  options={applicationOptions ?? null}
                                />
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
export default EndpointForm;
