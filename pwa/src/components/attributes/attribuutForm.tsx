import * as React from "react";
import { Link } from "gatsby";
import { Accordion, Spinner, Card, Modal } from "@conductionnl/nl-design-system/lib";
import { navigate } from "gatsby-link";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { MIMETypes } from "../../data/mimeTypes";
import { useForm } from "react-hook-form";
import { ISelectValue } from "../formFields/types";
import {
  InputText,
  SelectSingle,
  Textarea,
  InputNumber,
  InputCheckbox,
  InputDate,
  CreateKeyValue,
  CreateArray,
  SelectMultiple,
} from "../formFields";
import { resourceArrayToSelectArray } from "../../services/resourceArrayToSelectArray";

interface AttributeFormProps {
  attributeId: string;
  entityId: string;
}

export const AttributeForm: React.FC<AttributeFormProps> = ({ attributeId, entityId }) => {
  const [attribute, setAttribute] = React.useState<any>(null);
  const [attributes, setAttributes] = React.useState<any>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = attributeId ? "Edit Attribute" : "Create Attribute";
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const typeSelectOptions: ISelectValue[] = [
    { label: "String", value: "string" },
    { label: "Array", value: "array" },
    { label: "Integer", value: "integer" },
    { label: "Boolean", value: "boolean" },
    { label: "Object", value: "object" },
    { label: "Date", value: "date" },
    { label: "Datetime", value: "datetime" },
    { label: "Number", value: "number" },
    { label: "Float", value: "float" },
    { label: "File", value: "file" },
  ];

  const formatSelectOptions: ISelectValue[] = [
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Country code", value: "countryCode" },
    { label: "BSN", value: "bsn" },
    { label: "Url", value: "url" },
    { label: "UUID", value: "uuid" },
    { label: "Json", value: "json" },
  ];

  const {
    register,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data): void => {
    setLoadingOverlay({ isLoading: true });

    data.entity = `/admin/entities/${entityId}`;
    data.type = data.type && data.type.value;
    data.format = data.format && data.format.value;
    data.inversedBy = data.inversedBy && data.inversedBy.value;

    API.Attribute.createOrUpdate(data, attributeId)
      .then((res) => {
        setAlert({ message: `${attributeId ? "Updated" : "Created"} attribute`, type: "success" });
        setAttribute(res.data);
        navigate(`/entities/${entityId}`, {
          state: { activeTab: "attributes" },
        });
      })
      .catch((err) => {
        setAlert({ type: "danger", message: err.message });
        throw new Error(`Create or update application error: ${err}`);
      })
      .finally(() => {
        setLoadingOverlay({ isLoading: false });
      });
  };

  const handleSetFormValues = (source): void => {
    const basicFields: string[] = [
      "name",
      "defaultValue",
      "multipleOf",
      "description",
      "minimum",
      "maximum",
      "exclusiveMinimum",
      "exclusiveMaximum",
      "minLength",
      "maxLength",
      "minItems",
      "maxItems",
      "minDate",
      "maxDate",
      "minProperties",
      "maxProperties",
      "example",
      "maxFileSize",
      "requiredIf",
      "forbiddenIf",
      "objectConfig",
      "persistToGateway",
      "required",
      "mustBeUnique",
      "multiple",
      "readOnly",
      "deprecated",
      "cascade",
      "searchable",
      "uniqueItems",
      "nullable",
      "writeOnly",
      "fileTypes",
      "enum",
      "allOf",
      "anyOf",
      "oneOf",
    ];
    basicFields.forEach((field) => setValue(field, source[field]));

    setValue(
      "type",
      typeSelectOptions.find((option) => source.type === option.value),
    );
    setValue(
      "format",
      formatSelectOptions.find((option) => source.format === option.value),
    );
    source.inversedBy &&
      setValue("inversedBy", { label: source.inversedBy.name, value: `/admin/attributes/${source.inversedBy.id}` });
  };

  React.useEffect(() => {
    setHeader(
      <>
        Attribute <i>{attribute && attribute.name}</i>
      </>,
    );
  }, [setHeader, attribute]);

  React.useEffect(() => {
    handleSetDocumentation();
  }, [API]);

  React.useEffect(() => {
    handleSetAttributes();
    attributeId && handleSetAttribute();
  }, [API, attributeId]);

  React.useEffect(() => {
    if (attributeId) {
      if ((!attribute || !attributes) && !showSpinner) setShowSpinner(true);

      if (attribute && attributes) setShowSpinner(false);
    }
  }, [attribute, attributes]);

  const handleSetAttribute = () => {
    API.Attribute.getOne(attributeId)
      .then((res) => {
        handleSetFormValues(res.data);
        setAttribute(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET attribute error: " + err);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("attributes")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleSetAttributes = () => {
    API.Attribute.getAllFromEntity(entityId)
      .then((res) => {
        setAttributes(resourceArrayToSelectArray(res.data, "attributes"));
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET attributes error: " + err);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#attributeHelpModal"
                type="button"
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <Modal
                title="Attribute Documentation"
                id="attributeHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <Link className="utrecht-link" to={`/entities/${entityId}`} state={{ activeTab: "attributes" }}>
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
                        <InputText name="name" label="Name" {...{ register, errors }} validation={{ required: true }} />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          name="type"
                          label="Type"
                          options={typeSelectOptions}
                          {...{ control, errors }}
                          validation={{ required: true }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <SelectSingle
                          name="inversedBy"
                          label="Inversed by"
                          options={attributes ?? []}
                          {...{ control, errors }}
                        />
                      </div>
                      <div className="col-6">
                        <SelectSingle
                          name="format"
                          label="Format"
                          options={formatSelectOptions}
                          {...{ control, errors }}
                        />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-6">
                        <InputText name="defaultValue" label="Default value" {...{ register, errors }} />
                      </div>
                      <div className="col-6">
                        <InputNumber name="multipleOf" label="Multiple of" {...{ register, errors }} />
                      </div>
                    </div>
                    <div className="row form-row">
                      <div className="col-12">
                        <Textarea name="description" label="Description" {...{ register, errors }} />
                      </div>
                    </div>
                    <Accordion
                      id="attributeAccordion"
                      items={[
                        {
                          title: "Configuration",
                          id: "ConfigAccordion",
                          render: function () {
                            return (
                              <>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <InputNumber name="minimum" label="Minimum" {...{ register, errors }} />
                                  </div>
                                  <div className="col-6">
                                    <InputNumber name="maximum" label="Maximum" {...{ register, errors }} />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <InputCheckbox
                                      name="exclusiveMinimum"
                                      label="Exclusive minimum"
                                      {...{ register, errors }}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <InputCheckbox
                                      name="exclusiveMaximum"
                                      label="Exclusive maximum"
                                      {...{ register, errors }}
                                    />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <InputNumber name="minLength" label="Minimum length" {...{ register, errors }} />
                                  </div>
                                  <div className="col-6">
                                    <InputNumber name="maxLength" label="Maximum length" {...{ register, errors }} />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <InputNumber name="minItems" label="Minimum items" {...{ register, errors }} />
                                  </div>
                                  <div className="col-6">
                                    <InputNumber name="maxItems" label="Maximum items" {...{ register, errors }} />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <InputDate name="minDate" label="Minimum date" {...{ register, errors }} />
                                  </div>
                                  <div className="col-6">
                                    <InputDate name="maxDate" label="Maximum date" {...{ register, errors }} />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <InputNumber
                                      name="minProperties"
                                      label="Minimum properties"
                                      {...{ register, errors }}
                                    />
                                  </div>
                                  <div className="col-6">
                                    <InputNumber
                                      name="maxProperties"
                                      label="Maximum properties"
                                      {...{ register, errors }}
                                    />
                                  </div>
                                </div>
                                <div className="row form-row">
                                  <div className="col-6">
                                    <InputText name="example" label="Example" {...{ register, errors }} />
                                  </div>
                                  <div className="col-6">
                                    <InputNumber
                                      name="maxFileSize"
                                      label="Maximum file size"
                                      {...{ register, errors }}
                                    />
                                  </div>
                                </div>
                                <Accordion
                                  id="attributeAccordion"
                                  items={[
                                    {
                                      title: "Required if",
                                      id: "requiredIfAccordion",
                                      render: () => (
                                        <CreateKeyValue
                                          name="requiredIf"
                                          label="Required if"
                                          data={getValues("requiredIf")}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                    {
                                      title: "Forbidden if",
                                      id: "forbiddenIfAccordion",
                                      render: () => (
                                        <CreateArray
                                          name="forbiddenIf"
                                          label="Forbidden if"
                                          data={getValues("forbiddenIf")}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                    {
                                      title: "Object config",
                                      id: "objectConfigAccordion",
                                      render: () => (
                                        <CreateKeyValue
                                          name="objectConfig"
                                          label="Object config"
                                          data={getValues("objectConfig")}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                  ]}
                                />
                              </>
                            );
                          },
                        },
                        {
                          title: "Validation",
                          id: "ValidationAccordion",
                          render: function () {
                            return (
                              <>
                                <div className="row form-row">
                                  <div className="col-12 col-sm-6 ">
                                    <InputCheckbox
                                      name="persistToGateway"
                                      label="Persist to gateway"
                                      {...{ register, errors }}
                                    />
                                  </div>
                                  <div className="col-12 col-sm-6 ">
                                    <InputCheckbox name="cascade" label="Cascade" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6 ">
                                    <InputCheckbox name="required" label="Required" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6 ">
                                    <InputCheckbox name="searchable" label="Searchable" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <InputCheckbox
                                      name="mustBeUnique"
                                      label="Must be unique"
                                      {...{ register, errors }}
                                    />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <InputCheckbox name="uniqueItems" label="Unique items" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <InputCheckbox name="multiple" label="Multiple" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <InputCheckbox name="nullable" label="Nullable" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <InputCheckbox name="readOnly" label="Read only" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <InputCheckbox name="writeOnly" label="Write only" {...{ register, errors }} />
                                  </div>
                                  <div className="col-12 col-sm-6">
                                    <InputCheckbox name="deprecated" label="Deprecated" {...{ register, errors }} />
                                  </div>
                                </div>
                                <Accordion
                                  id="validationAccordion"
                                  items={[
                                    {
                                      title: "File Types",
                                      id: "fileTypesAccordion",
                                      render: () => (
                                        <SelectMultiple
                                          name="fileTypes"
                                          label="File Types"
                                          options={MIMETypes}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                    {
                                      title: "Enum",
                                      id: "enumAccordion",
                                      render: () => (
                                        <CreateArray
                                          name="enum"
                                          label="Enum"
                                          data={getValues("enum")}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                    {
                                      title: "All Of",
                                      id: "allOfAccordion",
                                      render: () => (
                                        <CreateArray
                                          name="allOf"
                                          label="All of"
                                          data={getValues("allOf")}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                    {
                                      title: "Any Of",
                                      id: "anyOfAccordion",
                                      render: () => (
                                        <CreateArray
                                          name="anyOf"
                                          label="Any of"
                                          data={getValues("anyOf")}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                    {
                                      title: "One Of",
                                      id: "oneOfAccordion",
                                      render: () => (
                                        <CreateArray
                                          name="oneOf"
                                          label="One of"
                                          data={getValues("oneOf")}
                                          {...{ control, errors }}
                                        />
                                      ),
                                    },
                                  ]}
                                />
                              </>
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

export default AttributeForm;
