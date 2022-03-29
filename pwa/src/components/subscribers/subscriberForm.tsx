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
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import MultiSelect from "../common/multiSelect";
import { validateJSON } from "../../services/validateJSON";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { Textarea, CreateArray, CreateKeyValue, InputText, SelectSingle, SelectMultiple, InputUrl } from "../formFields";
import { isTemplateExpression } from "typescript";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";


interface SubscriberFormProps {
  subscriberId: string;
  entityId: string;
}

export const SubscriberForm: React.FC<SubscriberFormProps> = ({ subscriberId, entityId }) => {
  const [subscriber, setSubscriber] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = subscriberId ? "Edit Subscriber" : "Create Subscriber";
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
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
        const subscriber = res.data;
        setHeader(
          <>
            Source <i>{subscriber && subscriber.name}</i>
          </>,
        );

        handleSetFormValues(subscriber);
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
    API.Source.getAll()
      .then((res) => {
        setSources(resourceArrayToSelectArray(res.data, "gateways"));
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

  // const saveSubscriber = (event) => {
  //   event.preventDefault();
  //   setLoadingOverlay(true);

  //   let headers: {} = retrieveFormArrayAsObject(event.target, "headers");
  //   let queryParameters: {} = retrieveFormArrayAsObject(event.target, "queryParameters");
  //   let mappingIn: {} = retrieveFormArrayAsObject(event.target, "mappingIn");
  //   let mappingOut: {} = retrieveFormArrayAsObject(event.target, "mappingOut");
  //   let translationsIn: any[] = retrieveFormArrayAsOArray(event.target, "translationsIn");
  //   let translationsOut: any[] = retrieveFormArrayAsOArray(event.target, "translationsOut");

  //   let body: any = {
  //     name: event.target.name.value,
  //     description: event.target.description.value ?? null,
  //     type: event.target.type.value,
  //     entity: `admin/entities/${entityId}`,
  //     endpoint: event.target.endpoint.value ?? null,
  //     gateway: event.target.source.value ?? null,
  //     method: event.target.method.value,
  //     conditions: event.target.conditions.value ?? null,
  //     runOrder: event.target.runOrder.value ? parseInt(event.target.runOrder.value) : 0,
  //     asynchronous: event.target.asynchronous.checked,
  //     blocking: event.target.blocking.checked,
  //     mappingIn,
  //     mappingOut,
  //     translationsIn,
  //     translationsOut,
  //     headers,
  //     queryParameters,
  //   };

  //   body = removeEmptyObjectValues(body);

  //   if (!checkValues([body.name, body.type])) {
  //     setAlert({ type: "danger", message: "Required fields are empty" });
  //     setLoadingOverlay(false);
  //     return;
  //   }



  //   API.Subscriber.createOrUpdate(body, subscriberId)
  //     .then(() => {
  //       setAlert({ message: `${subscriberId ? "Updated" : "Created"} subscriber`, type: "success" });
  //       navigate(`/entities/${entityId}`, {
  //         state: { activeTab: "subscribers" },
  //       });
  //     })
  //     .catch((err) => {
  //       setAlert({ type: "danger", message: err.message });
  //       throw new Error(`Create or update subscriber error: ${err}`);
  //     })
  //     .finally(() => {
  //       setLoadingOverlay(false);
  //     });
  // };
  
  const onSubmit = (data): void => {
    setLoadingOverlay(true);

    data.method = data.method.value;
    data.type = data.type.value;
    data.source = data.source.value;

    if (data.conditions && !validateJSON(data.conditions)) {
      setAlert({ type: "danger", message: "Conditions is not valid JSON" });
      setLoadingOverlay(false);
      return;
    }

    API.Subscriber.createOrUpdate(data, subscriberId)
      .then(() => {
        setAlert({ type: "success", message: `${subscriberId ? "Updated" : "Created"} subscriber` });
        // navigate("/sources");
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error("Create or update subscriber error: " + err);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSetFormValues = (subscriber): void => {
    console.log(subscriber);
    const basicFields: string[] = [
      "name",
      "description",
      "type",
      "entity",
      "endpoint",
      "gateway",
      "method",
      "conditions",
      "runOrder",
      "asynchronous",
      "blocking",
      "mappingIn",
      "mappingOut",
      "translationsIn",
      "translationsOut",
      "headers",
      "queryParameters",
    ];
    basicFields.forEach((field) => setValue(field, subscriber[field]));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText 
                          name="name"
                          label="Name" 
                          {...{ register, errors }} 
                          validation={{ required: true }} 
                        />
                      </div>
                      <div className="col-6">
                        <Textarea 
                          name="description"
                          label="Description" 
                          {...{ register, errors }} 
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectSingle 
                          options={[
                            { label: "GET", value: "GET" },
                            { label: "POST", value: "POST" },
                            { label: "PUT", value: "PUT" },
                            { label: "PATCH", value: "PATCH" },
                          ]}
                          name="method"
                          label="Method" 
                          {...{ control, errors }} 
                          validation={{ required: true }} 
                        />
                      </div>
                      <div className="col-6">
                        <InputText 
                          name="Run order"
                          label="runOrder" 
                          {...{ register, errors }} 
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <Textarea 
                          name="conditions"
                          label={'Conditions (JSON Logic)'} 
                          {...{ register, errors }} 
                        />
                      </div>
                      <div className="col-6">
                        <SelectSingle 
                          options={sources ?? []}
                          name="source"
                          label="Source" 
                          {...{ control, errors }} 
                          validation={{ required: true }} 
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectSingle 
                          options={[
                            { label: "Extern Source", value: "externSource" },
                            { label: "Intern Gateway", value: "internGateway" },
                          ]}
                          name={"type"}
                          label="Type" 
                          {...{ control, errors }} 
                          validation={{ required: true }}
                        />
                      </div>
                      <div className="col-6">
                        <SelectSingle 
                          options={getEndpointsSelectQuery.data ??  []}
                          name="endpoint"
                          label="Endpoint" 
                          {...{ control, errors }} 
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
                          title: "Translations in",
                          id: "translationsInAccordion",
                          render: function () {
                            return tableNames ? (
                              <SelectMultiple
                                name="translationsIn"
                                label="Translations in"
                                options={tableNames}
                                {...{ control, errors }} 
                              />
                            ) : (
                              <>
                                <Spinner />
                              </>
                            );
                          },
                        },
                        {
                          title: "Translations out",
                          id: "translationsOutAccordion",
                          render: function () {
                            return tableNames ? (
                              <SelectMultiple
                                name="translationsOut"
                                label="Translations out"
                                options={tableNames}
                                {...{ control, errors }} 
                              />
                            ) : (
                              <>
                                <Spinner />
                              </>
                            );
                          },
                        },
                        {
                          title: "Mapping in",
                          id: "mappingInAccordion",
                          render: () => (
                            <CreateKeyValue
                              name="mappingIn"
                              label="Mapping in"
                              data={getValues("mappingIn")}
                              {...{ control, errors }}
                            />
                          )
                        },
                        {
                          title: "Mapping out",
                          id: "mappingOutAccordion",
                          render: () => (
                            <CreateKeyValue
                              name="mappingOut"
                              label="Mapping out"
                              data={getValues("mappingOut")}
                              {...{ control, errors }}
                            />
                          )
                        },
                        {
                          title: "Headers",
                          id: "headersAccordion",
                          render: () => (
                            <CreateKeyValue
                              name="headers"
                              label="Headers"
                              data={getValues("headers")}
                              {...{ control, errors }}
                            />
                          )
                        },
                        {
                          title: "Query parameters",
                          id: "queryParametersAccordion",
                          render: () => (
                            <CreateKeyValue
                              name="queryParameters"
                              label="Query parameters"
                              data={getValues("queryParameters")}
                              {...{ control, errors }}
                            />
                          )
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
