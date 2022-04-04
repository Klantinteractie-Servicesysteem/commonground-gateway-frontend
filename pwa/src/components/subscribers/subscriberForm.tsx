import * as React from "react";
import { Link } from "gatsby";
import { Accordion, Spinner, Card } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { validateJSON } from "../../services/validateJSON";
import { ISelectValue } from "../formFields/types";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import {
  Textarea,
  InputNumber,
  CreateKeyValue,
  InputText,
  SelectSingle,
  SelectMultiple,
  InputCheckbox,
} from "../formFields";
import { useSubscriber } from "../../hooks/subscriber";
import { useEndpoint } from "../../hooks/endpoint";
import { useSource } from "../../hooks/source";

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
  const [tableNames, setTableNames] = React.useState<any>(null);

  const typeSelectOptions: ISelectValue[] = [
    { label: "Extern Source", value: "externSource" },
    { label: "Intern Gateway", value: "internGateway" },
  ];

  const methodSelectOptions: ISelectValue[] = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "PATCH", value: "PATCH" },
  ];

  const queryClient = useQueryClient();

  const _useSubscriber = useSubscriber(queryClient);
  const getSubscriber = _useSubscriber.getOne(subscriberId);
  const createOrEditSubscriber = _useSubscriber.createOrEdit(entityId, subscriberId);

  const _useEndpoint = useEndpoint(queryClient);
  const getEndpointsSelect = _useEndpoint.getSelect();

  const _useSource = useSource(queryClient);
  const getSourcesSelect = _useSource.getSelect();

  React.useEffect(() => {
    setHeader("Subscriber");

    if (getSubscriber.isSuccess) {
      const subscriber = getSubscriber.data;

      setHeader(
        <>
          Subscriber: <i>{subscriber.name}</i>
        </>,
      );

      handleSetFormValues(subscriber);
    }
  }, [getSubscriber.isSuccess]);

  React.useEffect(() => {
    handleSetTableNames();
  }, [API, subscriberId]);

  React.useEffect(() => {
    setShowSpinner(
      !getSourcesSelect.isSuccess ||
        !getEndpointsSelect.isSuccess ||
        tableNames === null ||
        (subscriberId && !getSubscriber.isSuccess),
    );
  }, [subscriber, getSourcesSelect.isSuccess, getEndpointsSelect.isSuccess, tableNames, subscriberId]);

  const handleSetTableNames = () => {
    API.Translation.getTableNames()
      .then((res) => {
        const mappedTableNames = res.data.results.map((value) => ({ label: value, value: value }));

        setTableNames(mappedTableNames);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error(`GET table names error: ${err}`);
      });
  };

  const onSubmit = (data): void => {
    setLoadingOverlay({ isLoading: true });

    data.entity = `/admin/entities/${entityId}`;
    data.method = data.method && data.method.value;
    data.type = data.type && data.type.value;
    data.gateway = data.gateway && data.gateway.value;
    data.endpoint = data.endpoint && data.endpoint.value;

    createOrEditSubscriber.mutate({ payload: data, id: subscriberId });
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
    const basicFields: string[] = [
      "name",
      "description",
      "entity",
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

    setValue(
      "type",
      typeSelectOptions.find((option) => subscriber.type === option.value),
    );
    setValue(
      "method",
      methodSelectOptions.find((option) => subscriber.method === option.value),
    );
    subscriber.endpoint &&
      setValue("endpoint", { label: subscriber.endpoint.name, value: `/admin/endpoints/${subscriber.endpoint.id}` });

    subscriber.gateway &&
      setValue("gateway", { label: subscriber.gateway.name, value: `/admin/gateways/${subscriber.gateway.id}` });
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
                {getSubscriber.isLoading || showSpinner ? (
                  <Spinner />
                ) : (
                  <div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="name" label="Name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <Textarea name="description" label="Description" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectSingle
                          options={methodSelectOptions}
                          name="method"
                          label="Method"
                          {...{ control, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                      <div className="col-6">
                        <InputNumber name="runOrder" label="Run order" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <Textarea
                          name="conditions"
                          label="Conditions (JSON Logic)"
                          tooltipContent={
                            <a target="_blank" href="https://docs.conductor-gateway.app/en/latest/features/handlers/">
                              Read more about the use of JSON Logic
                            </a>
                          }
                          {...{ register, errors }}
                          validation={{ validate: () => validateJSON(getValues("conditions")) }}
                        />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          options={getSourcesSelect.data ?? []}
                          name="gateway"
                          label="Source"
                          {...{ control, errors }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectSingle
                          options={typeSelectOptions}
                          name={"type"}
                          label="Type"
                          {...{ control, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          options={getEndpointsSelect.data ?? []}
                          name="endpoint"
                          label="Endpoint"
                          {...{ control, errors }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-12 col-sm-6 ">
                        <InputCheckbox name="asynchronous" label="Asynchronous" {...{ register, errors }} />
                      </div>
                      <div className="col-12 col-sm-6 ">
                        <InputCheckbox name="blocking" label="Blocking" {...{ register, errors }} />
                      </div>
                    </div>

                    <Accordion
                      id="handlerAccordion"
                      items={[
                        {
                          title: "Translations in",
                          id: "translationsInAccordion",
                          render: () =>
                            tableNames ? (
                              <SelectMultiple
                                name="translationsIn"
                                label="Translations in"
                                options={tableNames}
                                {...{ control, errors }}
                              />
                            ) : (
                              <Spinner />
                            ),
                        },
                        {
                          title: "Translations out",
                          id: "translationsOutAccordion",
                          render: () =>
                            tableNames ? (
                              <SelectMultiple
                                name="translationsOut"
                                label="Translations out"
                                options={tableNames}
                                {...{ control, errors }}
                              />
                            ) : (
                              <Spinner />
                            ),
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
                          ),
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
                          ),
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
                          ),
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
                          ),
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
