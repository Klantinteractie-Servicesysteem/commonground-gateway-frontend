import * as React from "react";
import { Link } from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import MultiDimensionalArrayInput from "../common/multiDimensionalArrayInput";
import {
  GenericInputComponent,
  Checkbox,
  SelectInputComponent,
  TextareaGroup,
  Accordion,
  Spinner,
  Card,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import ElementCreationNew from "../common/elementCreationNew";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { MIMETypes } from "../../data/mimeTypes";
import MultiSelect from "../common/multiSelect";

interface ISubscriber {
  subscriberId: string;
  entityId: string;
}

export const SubscriberForm: React.FC<ISubscriber> = ({ subscriberId, entityId }) => {
  const [subscriber, setSubscriber] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = subscriberId ? "Edit Subscriber" : "Create Subscriber";
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [sources, setSources] = React.useState<any>(null);
  const [endpoints, setEndpoint] = React.useState<any>(null);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);

  React.useEffect(() => {
    setHeader({
      title: "Subscriber",
      subText: "Manage your subscriber here",
    });
  }, [setHeader]);


  React.useEffect(() => {
    subscriberId && handleSetSubscriber()
    handleSetSources();
    handleSetEndpoints();
    handleSetTableNames();
  }, [API]);

  const handleSetSubscriber= () => {
    setShowSpinner(true);

    API.Subscriber.getOne(subscriberId)
      .then((res) => {
        setSubscriber(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET subscriber error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetSources = () => {
    setShowSpinner(true);

    API.Source.getAll()
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET sources error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetEndpoints = () => {
    setShowSpinner(true);

    API.Endpoint.getAll()
      .then((res) => {
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

  const handleSetTableNames = () => {
    setShowSpinner(true);

    API.Translation.getTableNames()
      .then((res) => {
        const convertedArray = res.data["results"].map((value, idx) => ({ id: idx, name: value, value: value }));
        setTableNames(convertedArray);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET table names error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const saveSubscriber = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let headers: {} = retrieveFormArrayAsObject(event.target, "headers");
    let queryParameters: {} = retrieveFormArrayAsObject(event.target, "queryParameters");
    let mappingIn: {} = retrieveFormArrayAsObject(event.target, "mappingIn");
    let mappingOut: {} = retrieveFormArrayAsObject(event.target, "mappingOut");
    let translationsIn: any[] = retrieveFormArrayAsOArray(event.target, "translationsIn");
    let translationsOut: any[] = retrieveFormArrayAsOArray(event.target, "translationsOut");

    let body: {} = {
      name: event.target.name.value ? event.target.name.value : null,
      description: event.target.description.value ? event.target.description.value : null,
      entity: `admin/entities/${entityId}`,
      endpoint: event.target.endpoint.value ? event.target.endpoint.value : null,
      source: event.target.source.value ? event.target.source.value : null,
      method: event.target.method.value,
      conditions: event.target.conditions.value ? event.target.conditions.value : null,
      order: event.target.order.value ? parseInt(event.target.order.value) : null,
      asynchronous: event.target.checked,
      blocking: event.target.checked,
      mappingIn,
      mappingOut,
      translationsIn,
      translationsOut,
      headers,
      queryParameters
    };

    body = removeEmptyObjectValues(body);

    if (!subscriberId) {
      // unset id means we're creating a new entry
      API.Subscriber.create(body)
        .then(() => {
          setAlert({ message: "Saved subscriber", type: "success" });
          navigate(`/entities/${entityId}`);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Create subscriber error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }

    if (subscriberId) {
      // set id means we're updating a existing entry
      API.Subscriber.update(body, subscriberId)
        .then((res) => {
          setAlert({ message: "Updated subscriber", type: "success" });
          setSubscriber(res.data);
        })
        .catch((err) => {
          setAlert({ type: "danger", message: err.message });
          throw new Error("Update subscriber error: " + err);
        })
        .finally(() => {
          setLoadingOverlay(false);
        });
    }
  };

  return (
    <form id="subscriberForm" onSubmit={saveSubscriber}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <Link className="utrecht-link" to={`/entities/${entityId}`}>
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
                          data={subscriber && subscriber.name && subscriber.name}
                          nameOverride={"Name"}
                        />
                      </div>
                      <div className="col-6">
                        <TextareaGroup
                          name={"description"}
                          id={"descriptionInput"}
                          defaultValue={subscriber?.description}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "POST", value: "POST" },
                            { name: "PUT", value: "PUT" },
                            { name: "GET", value: "GET" },
                          ]}
                          name={"method"}
                          id={"methodInput"}
                          nameOverride={"Method"}
                          data={subscriber && subscriber.method && subscriber.method}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"order"}
                          id={"orderInput"}
                          data={subscriber && subscriber.order && subscriber.order}
                          nameOverride={"Order"}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"conditions"}
                          id={"conditionsInput"}
                          data={subscriber && subscriber.conditions && subscriber.conditions}
                          nameOverride={"Conditions"}
                        />
                      </div>
                      <div className="col-6">
                        {sources !== null && sources.length > 0 ? (
                          <>
                            {subscriber !== null &&
                            subscriber.source !== undefined &&
                            subscriber.source !== null ? (
                              <SelectInputComponent
                                options={sources}
                                data={subscriber.source.name}
                                name={"source"}
                                id={"sourceInput"}
                                nameOverride={"Source"}
                                value={"/admin/sources/"}
                              />
                            ) : (
                              <SelectInputComponent
                                options={sources}
                                name={"source"}
                                id={"sourceInput"}
                                nameOverride={"Source"}
                                value={"/admin/sources/"}
                              />
                            )}
                          </>
                        ) : (
                          <SelectInputComponent
                            options={[{ name: "Please create a source first.", value: null }]}
                            name={"source"}
                            id={"sourceInput"}
                            nameOverride={"Source"}
                          />
                        )}
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        {endpoints !== null && endpoints.length > 0 ? (
                          <>
                            {subscriber !== null &&
                            subscriber.endpoint !== undefined &&
                            subscriber.endpoint !== null ? (
                              <SelectInputComponent
                                options={endpoints}
                                data={subscriber.endpoint.name}
                                name={"endpoint"}
                                id={"endpointInput"}
                                nameOverride={"Endpoint"}
                                value={"/admin/endpoints/"}
                              />
                            ) : (
                              <SelectInputComponent
                                options={endpoints}
                                name={"endpoint"}
                                id={"endpointInput"}
                                nameOverride={"Endpoint"}
                                value={"/admin/endpoints/"}
                              />
                            )}
                          </>
                        ) : (
                          <SelectInputComponent
                            options={[{ name: "Please create a endpoint first.", value: null }]}
                            name={"endpoint"}
                            id={"endpointInput"}
                            nameOverride={"Endpoint"}
                          />
                        )}
                      </div>
                    </div>
                    <br/>
                    <div className="row mt-3">
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"asynchronousInput"}
                            nameLabel={"Asynchronous"}
                            nameAttribute={"asynchronous"}
                            data={subscriber && subscriber.asynchronous && subscriber.asynchronous}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"blockingInput"}
                            nameLabel={"Blocking"}
                            nameAttribute={"blocking"}
                            data={subscriber && subscriber.blocking && subscriber.blocking}
                            defaultValue={"true"}
                          />
                        </div>
                      </div>
                    </div>

                    <Accordion
                      id="handlerAccordion"
                      items={[
                        {
                          title: "Translations In",
                          id: "translationsInAccordion",
                          render: function () {
                            return tableNames ? (
                              <MultiSelect
                                id="translationsIn"
                                label="Translations In"
                                data={subscriber?.translationsIn}
                                options={tableNames}
                              />
                            ) : (
                              <>
                                <Spinner />
                              </>
                            );
                          },
                        },
                        {
                          title: "Translations Out",
                          id: "translationsOutAccordion",
                          render: function () {
                            return tableNames ? (
                              <MultiSelect
                                id="translationsOut"
                                label="Translations Out"
                                data={subscriber?.translationsOut}
                                options={tableNames}
                              />
                            ) : (
                              <>
                                <Spinner />
                              </>
                            );
                          },
                        },
                        {
                          title: "Mapping In",
                          id: "mappingInAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"mappingIn"}
                                label={"Mapping In"}
                                data={
                                  subscriber && subscriber.mappingIn
                                    ? [
                                      {
                                        key: "mappingIn",
                                        value: subscriber.mappingIn,
                                      },
                                    ]
                                    : null
                                }
                              />
                            );
                          },
                        },
                        {
                          title: "Mapping Out",
                          id: "mappingOutAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"mappingOut"}
                                label={"Mapping Out"}
                                data={
                                  subscriber && subscriber.mappingOut
                                    ? [
                                      {
                                        key: "mappingOut",
                                        value: `${subscriber.mappingOut}`,
                                      },
                                    ]
                                    : null
                                }
                              />
                            );
                          },
                        },
                        {
                          title: "Headers",
                          id: "headersAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"headers"}
                                label={"Headers"}
                                data={
                                  subscriber && subscriber.headers
                                    ? [
                                      {
                                        key: "headers",
                                        value: `${subscriber.headers}`,
                                      },
                                    ]
                                    : null
                                }
                              />
                            );
                          },
                        },
                        {
                          title: "Query Parameters",
                          id: "queryParametersAccordion",
                          render: function () {
                            return (
                              <MultiDimensionalArrayInput
                                id={"queryParameters"}
                                label={"Query Parameters"}
                                data={
                                  subscriber && subscriber.queryParameters
                                    ? [
                                      {
                                        key: "queryParameters",
                                        value: `${subscriber.queryParameters}`,
                                      },
                                    ]
                                    : null
                                }
                              />
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

export default SubscriberForm;
