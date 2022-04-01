import * as React from "react";
import "./collectionForm.css";
import { Spinner, Card, Modal, Accordion } from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { InputText, InputUrl, SelectMultiple, SelectSingle, Textarea } from "../formFields";
import { ISelectValue } from "../formFields/types";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";
import { useApplication } from "../../hooks/application";
import { useEndpoint } from "../../hooks/endpoint";

interface CollectionFormProps {
  collectionId: string;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({ collectionId }) => {
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [collection, setCollection] = React.useState<any>(null);
  const [sources, setSources] = React.useState<any>(null);
  const [entities, setEntities] = React.useState<any>(null);
  const title: string = collectionId ? "Edit Collection" : "Create Collection";
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);
  const [selectedSourceType, setSelectedSourceType] = React.useState<any>(null);

  const sourceTypeSelectOptions: ISelectValue[] = [
    { label: "URL", value: "url" },
    { label: "GitHub", value: "GitHub" },
  ];

  const queryClient = useQueryClient();

  const _useApplication = useApplication(queryClient);
  const getApplicationsSelect = _useApplication.getSelect();

  const _useEndpoint = useEndpoint(queryClient);
  const getEndpointsSelect = _useEndpoint.getSelect();

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data): void => {
    setLoadingOverlay({ isLoading: true });

    data.sourceType = data.sourceType && data.sourceType.value;
    data.source = data.source && data.source.value;
    data.applications = data.applications?.map((application) => application.value);
    data.endpoints = data.endpoints?.map((endpoint) => endpoint.value);
    data.entities = data.entities?.map((entity) => entity.value);

    API.Collection.createOrUpdate(data, collectionId)
      .then(() => {
        setAlert({ message: `${collectionId ? "Updated" : "Created"} collection`, type: "success" });
        navigate("/collections");
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error(`Create or update collection error: ${err}`);
      })
      .finally(() => {
        setLoadingOverlay({ isLoading: false });
      });
  };

  const handleSetFormValues = (collection): void => {
    const basicFields: string[] = [
      "name",
      "description",
      "sourceBranch",
      "applications",
      "collections",
      "endpoints",
      "entities",
    ];
    basicFields.forEach((field) => setValue(field, collection[field]));

    setValue(
      "sourceType",
      sourceTypeSelectOptions.find((option) => collection.sourceType === option.value),
    );
    collection.source &&
      setValue("source", { label: collection.source.name, value: `/admin/gateways/${collection.source.id}` });
  };

  React.useEffect(() => {
    const sourceType = getValues("sourceType");
    setSelectedSourceType(sourceType?.value);
  }, [watch("sourceType")]);

  React.useEffect(() => {
    setHeader(
      <>
        Collection <i>{collection && collection.name}</i>
      </>,
    );
  }, [setHeader, collection]);

  React.useEffect(() => {
    handleSetSources();
    handleSetEntities();
    collectionId && handleSetCollection();
  }, [API, collectionId]);

  const handleSetCollection = () => {
    setShowSpinner(true);

    API.Collection.getOne(collectionId)
      .then((res) => {
        const collection = res.data;

        collection.applications = resourceArrayToSelectArray(collection.applications, "applications");
        collection.endpoints = resourceArrayToSelectArray(collection.endpoints, "endpoints");
        collection.entities = resourceArrayToSelectArray(collection.entities, "entities");

        handleSetFormValues(collection);
        setCollection(collection);
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
        setSources(resourceArrayToSelectArray(res.data, "gateways"));
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET sources error: " + err);
      });
  };

  const handleSetEntities = () => {
    API.Entity.getAll()
      .then((res) => {
        setEntities(resourceArrayToSelectArray(res.data, "entities"));
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET entities error: " + err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <div>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#collectionHelpModal"
                type="button"
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
                {showSpinner === true ? (
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
                      <div className="col-12">
                        <SelectSingle
                          name="sourceType"
                          label="Source Type"
                          options={sourceTypeSelectOptions}
                          validation={{ required: true }}
                          {...{ errors, control }}
                        />
                      </div>
                    </div>

                    <div className="row form-row">
                      <div className="col-6">
                        {selectedSourceType === "GitHub" && (
                          <InputUrl
                            name="source"
                            label="GitHub URL"
                            {...{ register, errors }}
                            validation={{ required: true }}
                          />
                        )}

                        {selectedSourceType === "url" && (
                          <SelectSingle
                            name="source"
                            label="Source URL"
                            options={sources}
                            validation={{ required: true }}
                            {...{ control, errors }}
                          />
                        )}
                      </div>

                      <div className="col-6">
                        {selectedSourceType === "GitHub" && (
                          <InputText name="sourceBranch" label="GitHub Branch" {...{ register, errors }} />
                        )}
                      </div>
                    </div>

                    <Accordion
                      id="collectionAccordion"
                      items={[
                        {
                          title: "Applications",
                          id: "applicationsAccordion",
                          render: () =>
                            getApplicationsSelect.isSuccess ? (
                              <SelectMultiple
                                label="Applications"
                                name="applications"
                                options={getApplicationsSelect.data ?? []}
                                {...{ control, register, errors }}
                              />
                            ) : (
                              <Spinner />
                            ),
                        },
                        {
                          title: "Endpoints",
                          id: "endpointsAccordion",
                          render: () =>
                            getEndpointsSelect.isSuccess ? (
                              <SelectMultiple
                                label="Endpoints"
                                name="endpoints"
                                options={getEndpointsSelect.data}
                                {...{ control, register, errors }}
                              />
                            ) : (
                              <Spinner />
                            ),
                        },
                        {
                          title: "Entities",
                          id: "entitiesAccordion",
                          render: () =>
                            entities ? (
                              <SelectMultiple
                                label="Entities"
                                name="entities"
                                options={entities}
                                {...{ control, register, errors }}
                              />
                            ) : (
                              <Spinner />
                            ),
                        },
                      ]}
                    />
                    <div className="collectionFormContainer">
                      <span>
                        <strong>Last synced at: </strong>{" "}
                        {collection?.syncedAt
                          ? new Date(collection?.syncedAt).toLocaleString("nl-NL")
                          : "Not synced yet"}
                      </span>
                      <span>
                        <strong>Date modified: </strong>{" "}
                        {collection?.dateModified && new Date(collection?.dateModified).toLocaleString("nl-NL")}
                      </span>
                      <span>
                        <strong>Date created: </strong>{" "}
                        {collection?.dateCreated && new Date(collection?.dateCreated).toLocaleString("nl-NL")}
                      </span>
                    </div>
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
