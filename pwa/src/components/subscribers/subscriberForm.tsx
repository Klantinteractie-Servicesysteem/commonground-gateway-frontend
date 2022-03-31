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
} from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import MultiSelect from "../common/multiSelect";
import { validateJSON } from "../../services/validateJSON";
import { useQuery } from "react-query";

interface SubscriberFormProps {
  subscriberId: string;
  entityId: string;
}

export const SubscriberForm: React.FC<SubscriberFormProps> = ({ subscriberId, entityId }) => {
  const [subscriber, setSubscriber] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = subscriberId ? "Edit Subscriber" : "Create Subscriber";
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);
  const [sources, setSources] = React.useState<any>(null);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);

  const getEndpointsSelectQuery = useQuery<any[], Error>("endpoints-select", API.Endpoint.getSelect, {
    onError: (error) => {
      console.log("error!!");
      setAlert({ message: error.message, type: "danger" });
    },
    onSuccess: () => {
      console.log("success");
    },
  });

  React.useEffect(() => {
    setHeader(
      <>
        Subscriber <i>{subscriber && subscriber.name}</i>
      </>,
    );
  }, [setHeader, subscriber]);

  React.useEffect(() => {
    subscriberId && handleSetSubscriber();
    handleSetSources();
    handleSetTableNames();
  }, [API, subscriberId]);

  React.useEffect(() => {
    setShowSpinner(!sources || !getEndpointsSelectQuery.isSuccess || !tableNames || (subscriberId && !subscriber));
  }, [subscriber, sources, getEndpointsSelectQuery.isSuccess, tableNames, subscriberId]);

  const handleSetSubscriber = () => {
    API.Subscriber.getOne(subscriberId)
      .then((res) => {
        setSubscriber(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET subscriber error: " + err);
      });
  };

  const handleSetSources = () => {
    API.Source.getAll()
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET sources error: " + err);
      });
  };

  const handleSetTableNames = () => {
    API.Translation.getTableNames()
      .then((res) => {
        const mappedTableNames = res.data.results.map((value, idx) => ({ id: idx, name: value, value: value }));
        setTableNames(mappedTableNames);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET table names error: " + err);
      });
  };

  const saveSubscriber = (event) => {
    event.preventDefault();
    setLoadingOverlay({ isLoading: true });

    let headers: {} = retrieveFormArrayAsObject(event.target, "headers");
    let queryParameters: {} = retrieveFormArrayAsObject(event.target, "queryParameters");
    let mappingIn: {} = retrieveFormArrayAsObject(event.target, "mappingIn");
    let mappingOut: {} = retrieveFormArrayAsObject(event.target, "mappingOut");
    let translationsIn: any[] = retrieveFormArrayAsOArray(event.target, "translationsIn");
    let translationsOut: any[] = retrieveFormArrayAsOArray(event.target, "translationsOut");

    let body: any = {
      name: event.target.name.value,
      description: event.target.description.value ?? null,
      type: event.target.type.value,
      entity: `admin/entities/${entityId}`,
      endpoint: event.target.endpoint.value ?? null,
      gateway: event.target.source.value ?? null,
      method: event.target.method.value,
      conditions: event.target.conditions.value ?? null,
      runOrder: event.target.runOrder.value ? parseInt(event.target.runOrder.value) : 0,
      asynchronous: event.target.asynchronous.checked,
      blocking: event.target.blocking.checked,
      mappingIn,
      mappingOut,
      translationsIn,
      translationsOut,
      headers,
      queryParameters,
    };

    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name, body.type])) {
      setAlert({ type: "danger", message: "Required fields are empty" });
      setLoadingOverlay({ isLoading: false });
      return;
    }

    if (body.conditions && !validateJSON(body.conditions)) {
      setAlert({ type: "danger", message: "Conditions is not valid JSON" });
      setLoadingOverlay({ isLoading: false });
      return;
    }

    API.Subscriber.createOrUpdate(body, subscriberId)
      .then(() => {
        setAlert({ message: `${subscriberId ? "Updated" : "Created"} subscriber`, type: "success" });
        navigate(`/entities/${entityId}`, {
          state: { activeTab: "subscribers" },
        });
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error(`Create or update subscriber error: ${err}`);
      })
      .finally(() => {
        setLoadingOverlay({ isLoading: false });
      });
  };

  return (
    <form id="subscriberForm" onSubmit={saveSubscriber}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <Link className="utrecht-link" to={`/entities/${entityId}`} state={{ activeTab: "subscribers" }}>
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
                          data={subscriber?.name}
                          nameOverride={"Name"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <TextareaGroup
                          label="Description"
                          name="description"
                          id="descriptionInput"
                          defaultValue={subscriber?.description}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "GET", value: "GET" },
                            { name: "POST", value: "POST" },
                            { name: "PUT", value: "PUT" },
                            { name: "PATCH", value: "PATCH" },
                          ]}
                          name={"method"}
                          id={"methodInput"}
                          nameOverride={"Method"}
                          data={subscriber?.method}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"number"}
                          name={"runOrder"}
                          id={"runOrderInput"}
                          data={subscriber?.runOrder}
                          nameOverride={"Order"}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <TextareaGroup
                          name="conditions"
                          label={
                            <span>
                              Conditions (JSON Logic){" "}
                              <a target="_blank" href="https://docs.conductor-gateway.app/en/latest/features/handlers/">
                                Read more about the use of JSON Logic
                              </a>
                            </span>
                          }
                          id="conditionsInput"
                          defaultValue={subscriber?.conditions}
                        />
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={
                            sources !== null && sources.length > 0
                              ? sources
                              : [{ name: "Please create a source  first.", value: null }]
                          }
                          data={subscriber?.source?.name}
                          name={"source"}
                          id={"sourceInput"}
                          nameOverride={"Source"}
                          value={"admin/gateways/"}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectInputComponent
                          options={[
                            { name: "Extern Source", value: "externSource" },
                            { name: "Intern Gateway", value: "internGateway" },
                          ]}
                          data={subscriber?.type}
                          name={"type"}
                          id={"typeInput"}
                          nameOverride={"Type"}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <SelectInputComponent
                          options={getEndpointsSelectQuery.data ?? []}
                          data={subscriber?.endpoint?.name}
                          name={"endpoint"}
                          id={"endpointInput"}
                          nameOverride={"Endpoint"}
                          value={"admin/endpoints/"}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          <Checkbox
                            type={"checkbox"}
                            id={"asynchronousInput"}
                            nameLabel={"Asynchronous"}
                            nameAttribute={"asynchronous"}
                            data={subscriber?.asynchronous}
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
                            data={subscriber?.blocking}
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
