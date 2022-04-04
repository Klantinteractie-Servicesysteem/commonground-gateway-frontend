import * as React from "react";
import "./collectionForm.css";
import { Spinner, Card, Modal, Accordion } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import { HeaderContext } from "../../context/headerContext";
import { useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { InputText, InputUrl, SelectMultiple, SelectSingle, Textarea } from "../formFields";
import { ISelectValue } from "../formFields/types";
import { useApplication } from "../../hooks/application";
import { useEndpoint } from "../../hooks/endpoint";
import { useEntity } from "../../hooks/entity";
import { useSource } from "../../hooks/source";
import { useCollection } from "../../hooks/collection";

interface CollectionFormProps {
  collectionId: string;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({ collectionId }) => {
  const title: string = collectionId ? "Edit Collection" : "Create Collection";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [selectedSourceType, setSelectedSourceType] = React.useState<any>(null);

  const sourceTypeSelectOptions: ISelectValue[] = [
    { label: "URL", value: "url" },
    { label: "GitHub", value: "GitHub" },
  ];

  const queryClient = useQueryClient();

  const _useCollection = useCollection(queryClient);
  const createOrEditCollection = _useCollection.createOrEdit(collectionId);
  const getCollection = _useCollection.getOne(collectionId);

  const _useApplication = useApplication(queryClient);
  const getApplicationsSelect = _useApplication.getSelect();

  const _useEndpoint = useEndpoint(queryClient);
  const getEndpointsSelect = _useEndpoint.getSelect();

  const _useEntity = useEntity(queryClient);
  const getEntitiesSelect = _useEntity.getSelect();

  const _useSource = useSource(queryClient);
  const getSourcesSelect = _useSource.getSelect();

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
    data.sourceType = data.sourceType && data.sourceType.value;
    data.source = data.source && data.source.value;
    data.applications = data.applications?.map((application) => application.value);
    data.endpoints = data.endpoints?.map((endpoint) => endpoint.value);
    data.entities = data.entities?.map((entity) => entity.value);

    createOrEditCollection.mutate({ payload: data, id: collectionId });
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
    setHeader("Collection");

    if (getCollection.isSuccess) {
      setHeader(
        <>
          Collection <i>{getCollection.data.name}</i>
        </>,
      );
      handleSetFormValues(getCollection.data);
    }
  }, [getCollection.isSuccess]);

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
                {getCollection.isLoading ? (
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
                            options={getSourcesSelect.data ?? []}
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
                            getEntitiesSelect.isSuccess ? (
                              <SelectMultiple
                                label="Entities"
                                name="entities"
                                options={getEntitiesSelect.data ?? []}
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
                        {getCollection.data?.syncedAt
                          ? new Date(getCollection.data?.syncedAt).toLocaleString("nl-NL")
                          : "Not synced yet"}
                      </span>
                      <span>
                        <strong>Date modified: </strong>{" "}
                        {getCollection.data?.dateModified &&
                          new Date(getCollection.data?.dateModified).toLocaleString("nl-NL")}
                      </span>
                      <span>
                        <strong>Date created: </strong>{" "}
                        {getCollection.data?.dateCreated &&
                          new Date(getCollection.data?.dateCreated).toLocaleString("nl-NL")}
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
