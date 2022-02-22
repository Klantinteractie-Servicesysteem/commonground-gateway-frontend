import * as React from "react";
import {Link} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject
} from "../utility/inputHandler";
import {
  GenericInputComponent,
  SelectInputComponent,
  Accordion,
  Spinner,
  Card,
  Modal
} from "@conductionnl/nl-design-system/lib";
import {MultiDimensionalArrayInput} from "../common/multiDimensionalArrayInput";
import ElementCreationNew from "../common/elementCreationNew";
import {navigate} from "gatsby-link";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import {AlertContext} from "../../context/alertContext";
import {HeaderContext} from "../../context/headerContext";

interface HandlerFormProps {
  handlerId: string,
  endpointId: string,
}

export const HandlerForm: React.FC<HandlerFormProps> = ({handlerId, endpointId}) => {
  const [handler, setHandler] = React.useState(null);
  const [handlers, setHandlers] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const title: string = handlerId ? "Edit Handler" : "Create Handler";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    if (handlerId) {
      handleSetHandlers();
      handleSetHandler();
      handleSetDocumentation();
      setHeader({
        title: "Handler",
        subText: "Manage your handler here"
      });
    }
  }, [API]);

  const handleSetHandler = () => {
    setShowSpinner(true);

    API.Handler.getOne(handlerId)
      .then((res) => {
        setHandler(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Handler error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleSetHandlers = () => {
    setShowSpinner(true);

    API.Handler.getAllFromEndpoint(endpointId)
      .then((res) => {
        setHandlers(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Handlers error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const saveHandler = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let skeletonIn: any[] = retrieveFormArrayAsOArray(event.target, "skeletonIn");
    let skeletonOut: any[] = retrieveFormArrayAsOArray(event.target, "skeletonOut");
    let mappingIn: {} = retrieveFormArrayAsObject(event.target, "mappingIn");
    let mappingOut: {} = retrieveFormArrayAsObject(event.target, "mappingOut");
    let translationsIn: any[] = retrieveFormArrayAsOArray(event.target, "translationsIn");
    let translationsOut: any[] = retrieveFormArrayAsOArray(event.target, "translationsOut");

    // get the inputs and check if set other set null
    let body: {} = {
      name: event.target.name.value,
      description: event.target.description
        ? event.target.description.value : null,
      sequence: event.target.sequence.value
        ? parseInt(event.target.sequence.value)
        : null,
      endpoint: `/admin/endpoints/${endpointId}`,
      entity: event.target.entity.value
        ? event.target.entity.value : null,
      template: event.target.template.value
        ? event.target.template.value : null,
      templateType: event.target.templateType.value
        ? event.target.templateType.value : null,
      skeletonIn,
      skeletonOut,
      mappingIn,
      mappingOut,
      translationsIn,
      translationsOut
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"]])) {
      setAlert({type: "danger", message: "Required fields are empty"});
      setLoadingOverlay(false);
      return;
    }

    if (!handlerId) { // unset id means we're creating a new entry
      API.Handler.create(body)
        .then(() => {
          setAlert({ message: "Saved handler", type: "success" });
          navigate(`/entities/${endpointId}`);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Create application error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }

    if (handlerId) { // set id means we're updating a existing entry
      API.Attribute.update(body, handlerId)
        .then((res) => {
          setAlert({ message: "Updated handler", type: "success" });
          setHandler(res.data);
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
    <form id="handlerForm" onSubmit={saveHandler}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#handlerHelpModal"
                onClick={(e) => e.preventDefault()}
              >
                <Modal
                  title="Handler Documentation"
                  id="handlerHelpModal"
                  body={() => (
                    <div dangerouslySetInnerHTML={{__html: documentation}}/>
                  )}
                />
                <i className="fas fa-question mr-1"/>
                <span className="mr-2">Help</span>
              </button>
              <Link className="utrecht-link" to={`/endpoints/${endpointId}`}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                </button>
              </Link>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
                <i className="fas fa-save mr-2"/>Save
              </button>
            </>);
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner === true ? (
                  <Spinner/>
                ) : (
                  <>
                    {loadingOverlay && <LoadingOverlay/>}
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"name"}
                          id={"nameInput"}
                          data={handler && handler.name && handler.name}
                          nameOverride={"Name"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"description"}
                          id={"descriptionInput"}
                          data={handler && handler.description && handler.description}
                          nameOverride={"Description"}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"sequence"}
                          id={"sequenceInput"}
                          data={handler && handler.sequence && handler.sequence}
                          nameOverride={"Sequence"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            {name: "twig", value: "twig"},
                            {name: "markdown", value: "markdown"},
                            {name: "restructuredText", value: "restructuredText"}
                          ]}
                          name={"templateType"}
                          id={"templateTypeInput"}
                          nameOverride={"Template Type"}
                          required={true}
                          data={handler?.templateType}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"template"}
                          id={"templateInput"}
                          data={handler && handler.template && handler.template}
                          nameOverride={"Template"}
                        />
                      </div>
                      <div className="col-6">
                        {
                          handlers !== null && handlers.length > 0 ? (
                            <div className="form-group">
                              {handler !== null &&
                              handler.entity !== undefined &&
                              handler.entity !== null ? (
                                  <SelectInputComponent
                                    options={handlers}
                                    data={handler.entity}
                                    name={"entity"} id={"entityInput"} nameOverride={"Entity"}
                                    value={"/admin/entities/"}/>
                                )
                                : (
                                  <SelectInputComponent
                                    options={handlers}
                                    name={"entity"} id={"entityInput"} nameOverride={"Entity"}
                                    value={"/admin/entities/"}/>
                                )}
                            </div>
                          ) : (
                            <SelectInputComponent
                              options={[]}
                              name={"entity"} id={"entityInput"} nameOverride={"Entity"}
                              value={"/admin/entities/"}/>
                          )
                        }
                      </div>
                    </div>
                    <Accordion
                      id="handlerAccordion"
                      items={[
                        {
                          title: "Conditions *",
                          id: "conditionsAccordion",
                          render: function () {
                            return (
                              <ElementCreationNew
                                id="conditions"
                                label="Conditions"
                                data={handler?.conditions}
                              />
                            );
                          }
                        },
                        {
                          title: "Translations In",
                          id: "translationsInAccordion",
                          render: function () {
                            return (
                              <ElementCreationNew
                                id="translationsIn"
                                label="Translations In"
                                data={handler?.translationsIn}
                                select
                                selectName={"translationIn"}
                                options={tableNames}
                              />
                            );
                          }
                        },
                        {
                          title: "Translations Out",
                          id: "translationsOutAccordion",
                          render: function () {
                            return (
                              <ElementCreationNew
                                id="translationsOut"
                                label="Translations Out"
                                data={handler?.translationsOut}
                                select
                                selectName={"translationOut"}
                                options={tableNames}
                              />
                            );
                          }
                        },
                        {
                          title: "Mapping In",
                          id: "mappingInAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"mappingIn"}
                                label={"Mapping In"}
                                data={handler && handler.mappingIn ? [{
                                  key: "mappingIn",
                                  value: handler.mappingIn
                                }] : null}
                              />
                            );
                          }
                        },
                        {
                          title: "Mapping Out",
                          id: "mappingOutAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"mappingOut"}
                                label={"Mapping Out"}
                                data={handler && handler.mappingOut ? [{
                                  key: "mappingOut",
                                  value: `${handler.mappingOut}`
                                }] : null}
                              />
                            );
                          }
                        },
                        {
                          title: "Skeleton In",
                          id: "skeletonInAccordion",
                          render: function () {
                            return (
                              <ElementCreationNew
                                id="skeletonIn"
                                label="Skeleton In"
                                data={handler?.skeletonIn}
                              />
                            );
                          }
                        },
                        {
                          title: "Skeleton Out",
                          id: "skeletonOutAccordion",
                          render: function () {
                            return (
                              <ElementCreationNew
                                id="skeletonOut"
                                label="Skeleton Out"
                                data={handler?.skeletonOut}
                              />
                            );
                          }
                        }
                      ]}/>
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
export default HandlerForm;
