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
import { InputText, Textarea, SelectMultiple, SelectSingle, CreateArray } from "../formFields";
import { useQueryClient } from "react-query";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";
import { ISelectValue } from "../formFields/types";
import { useEndpoint } from "../../hooks/endpoint";

interface EndpointFormProps {
  endpointId: string;
}

export const EndpointForm: React.FC<EndpointFormProps> = ({ endpointId }) => {
  const [applications, setApplications] = React.useState<any>(null);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const title: string = endpointId ? "Edit Endpoint" : "Create Endpoint";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  const operationTypeSelectOptions: ISelectValue[] = [
    { label: "Item", value: "item" },
    { label: "Collection", value: "collection" },
  ];

  const queryClient = useQueryClient();
  const _useEndpoint = useEndpoint(queryClient);
  const getEndpoint = _useEndpoint.getOne(endpointId);
  const createOrEditEndpoint = _useEndpoint.createOrEdit(setLoadingOverlay);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    control,
  } = useForm();

  const onSubmit = (data): void => {
    data.applications = data.applications?.map((application) => application.value);
    data.operationType = data.operationType && data.operationType.value;

    createOrEditEndpoint.mutate({ payload: data, id: endpointId });
  };

  const handleSetFormValues = (endpoint): void => {
    const basicFields: string[] = ["name", "path", "description", "applications"];
    basicFields.forEach((field) => setValue(field, endpoint[field]));

    setValue(
      "operationType",
      operationTypeSelectOptions.find((option) => endpoint.operationType === option.value),
    );
  };

  React.useEffect(() => {
    setHeader("Endpoint");

    if (getEndpoint.isSuccess) {
      setHeader(
        <>
          Endpoint: <i>{getEndpoint.data.name}</i>
        </>,
      );

      handleSetFormValues(getEndpoint.data);
    }
  }, [getEndpoint.isSuccess]);

  React.useEffect(() => {
    handleSetApplications();
  }, [API]);

  const handleSetApplications = () => {
    API.Application.getAll()
      .then((res) => {
        setApplications(resourceArrayToSelectArray(res.data, "applications"));
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <div>
              <a
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#endpointHelpModal"
                onClick={handleSetDocumentation}
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </a>
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
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
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
                {getEndpoint.isLoading ? (
                  <Spinner />
                ) : (
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText label="Name" name="name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          name="operationType"
                          label="Operation type"
                          options={operationTypeSelectOptions}
                          validation={{ required: true }}
                          {...{ control, errors }}
                        />
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
                          title: "Paths*",
                          id: "pathsAccordion",
                          render: () => (
                            <CreateArray
                              name="path"
                              label="Paths"
                              data={getValues("path")}
                              {...{ control, errors }}
                              validation={{ required: true }}
                            />
                          ),
                        },
                        {
                          title: "Applications*",
                          id: "applicationsAccordion",
                          render: () =>
                            applications ? (
                              <SelectMultiple
                                label="Applications"
                                name="applications"
                                options={applications}
                                validation={{ required: true }}
                                {...{ control, register, errors }}
                              />
                            ) : (
                              <Spinner />
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
export default EndpointForm;
