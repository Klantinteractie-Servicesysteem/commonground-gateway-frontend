import * as React from "react";
import {
  GenericInputComponent,
  TextareaGroup,
  Spinner,
  Card,
  Modal,
  Accordion,
  SelectInputComponent,
} from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import { checkValues, removeEmptyObjectValues, retrieveFormArrayAsOArrayWithName } from "../utility/inputHandler";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import MultiSelect from "../common/multiSelect";

interface CollectionFormProps {
  collectionId: string;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({ collectionId }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [collection, setCollection] = React.useState<any>(null);
  const [sources, setSources] = React.useState<any>(null);
  const [applications, setApplications] = React.useState<any>(null);
  const [endpoints, setEndpoints] = React.useState<any>(null);
  const [entities, setEntities] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const title: string = collectionId ? "Edit Collection" : "Create Collection";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [selectedSourceType, setSelectedSourceType] = React.useState<any>(null);

  React.useEffect(() => {
    setHeader(
      <>
        Collection <i>{collection && collection.name}</i>
      </>,
    );
  }, [setHeader, collection]);

  React.useEffect(() => {
    handleSetSources();
    handleSetApplications();
    handleSetEndpoints();
    handleSetEntities();
    collectionId && handleSetCollection();
  }, [API, collectionId]);

  const handleSetCollection = () => {
    setShowSpinner(true);

    API.Collection.getOne(collectionId)
      .then((res) => {
        res.data.applications = res.data.applications.map((application) => {
          return { name: application.name, id: application.name, value: `/admin/applications/${application.id}` };
        });

        res.data.endpoints = res.data.endpoints.map((endpoint) => {
          return { name: endpoint.name, id: endpoint.name, value: `/admin/endpoints/${endpoint.id}` };
        });

        res.data.entities = res.data.entities.map((entity) => {
          return { name: entity.name, id: entity.name, value: `/admin/entities/${entity.id}` };
        });

        setCollection(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Collection error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetSources = () => {
    API.Source.getAll()
      .then((res) => {
        const _sources = res.data.map((source) => ({
          name: source.name,
          value: `/admin/gateways/${source.id}`,
        }));
        setSources(_sources);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET sources error: " + err);
      });
  };

  const handleSetApplications = () => {
    API.Application.getAll()
      .then((res) => {
        const _applications = res.data?.map((application) => {
          return { name: application.name, id: application.name, value: `/admin/applications/${application.id}` };
        });
        setApplications(_applications);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET application error: " + err);
      });
  };

  const handleSetEndpoints = () => {
    API.Endpoint.getAll()
      .then((res) => {
        const _endpoints = res.data?.map((endpoint) => {
          return { name: endpoint.name, id: endpoint.name, value: `/admin/endpoints/${endpoint.id}` };
        });
        setEndpoints(_endpoints);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET endpoints error: " + err);
      });
  };

  const handleSetEntities = () => {
    API.Entity.getAll()
      .then((res) => {
        const _entities = res.data?.map((entity) => {
          return { name: entity.name, id: entity.name, value: `/admin/entities/${entity.id}` };
        });
        setEntities(_entities);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET entities error: " + err);
      });
  };

  const saveCollection = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let applications: any[] = retrieveFormArrayAsOArrayWithName(event.target, "applications");
    let endpoints: any[] = retrieveFormArrayAsOArrayWithName(event.target, "endpoints");
    let entities: any[] = retrieveFormArrayAsOArrayWithName(event.target, "entities");

    let body: any = {
      name: event.target.name.value,
      description: event.target.description.value ?? null,
      source: !event.target.source.disabled ? event.target.source.value : null,
      sourceType: !event.target.sourceType.disabled ? event.target.sourceType.value : null,
      sourceBranch: event.target.sourceBranch.value ?? null,
      applications,
      endpoints,
      entities,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name])) {
      setAlert({ type: "danger", message: "Required fields are empty" });
      setLoadingOverlay(false);
      return;
    }

    API.Collection.createOrUpdate(body, collectionId)
      .then(() => {
        setAlert({ message: `${collectionId ? "Updated" : "Created"} collection`, type: "success" });
        navigate("/collections");
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error(`Create or update collection error: ${err}`);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  return (
    <form id="collectionForm" onSubmit={saveCollection}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <div>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#collectionHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Collection Documentation"
                id="collectionHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <Link className="utrecht-link" to={"/collections"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button
                className="utrecht-button utrecht-button-sm btn-sm btn-success"
                type="submit"
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
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={collection?.name}
                          nameOverride={"Name"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <TextareaGroup
                          name={"description"}
                          id={"descriptionInput"}
                          defaultValue={collection?.description}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "url", value: "url" },
                            { name: "GitHub", value: "GitHub" },
                          ]}
                          onChange={(e) => setSelectedSourceType(e.target.value)}
                          data={collection?.sourceType}
                          name={"sourceType"}
                          id={"sourceTypeInput"}
                          nameOverride={"Source Type"}
                          disabled={collection?.source?.name}
                        />
                      </div>
                      <div className="col-6">
                        {
                          selectedSourceType === 'url' ? (
                            <SelectInputComponent
                              options={
                                sources !== null && sources.length > 0
                                  ? sources
                                  : [{ name: "Please create a source  first.", value: null }]
                              }
                              data={collection?.source?.name}
                              name={"source"}
                              id={"sourceInput"}
                              nameOverride={"Source url"}
                              disabled={collection?.source?.name}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"source"}
                              id={"sourceInput"}
                              data={collection?.source?.name}
                              nameOverride={selectedSourceType === "GitHub" ? "Source GitHub url" : "Source url"}
                              disabled={!selectedSourceType}
                              infoTooltip={!selectedSourceType && !collection?.source?.name && {
                                content: <span>Please select a source type first.</span>,
                              }}
                            />
                          )
                        }
                      </div>
                    </div>
                    {
                      selectedSourceType === 'GitHub' && (
                        <div className="row form-row">
                          <div className="col-6">
                            <GenericInputComponent
                              type={"text"}
                              name={"sourceBranch"}
                              id={"sourceBranchInput"}
                              data={collection?.sourceBranch}
                              nameOverride={"Source GitHub Branch"}
                            />
                          </div>
                        </div>
                      )
                    }

                    <Accordion
                      id="collectionAccordion"
                      items={[
                        {
                          title: "Applications",
                          id: "applicationsAccordion",
                          render: function () {
                            return applications ? (
                              <MultiSelect
                                id=""
                                label="Applications"
                                data={collection?.applications}
                                options={applications}
                              />
                            ) : (
                              <Spinner />
                            );
                          },
                        },
                        {
                          title: "Endpoints",
                          id: "endpointsAccordion",
                          render: function () {
                            return endpoints ? (
                              <MultiSelect
                                id=""
                                label="Endpoints"
                                data={collection?.endpoints}
                                options={endpoints}
                              />
                            ) : (
                              <Spinner />
                            );
                          },
                        },
                        {
                          title: "Entities",
                          id: "entitiesAccordion",
                          render: function () {
                            return entities ? (
                              <MultiSelect
                                id=""
                                label="Entities"
                                data={collection?.entities}
                                options={entities}
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
export default CollectionForm;
